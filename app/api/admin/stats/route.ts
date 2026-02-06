import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/permissions';
import connectDB from '@/lib/mongodb';
import { User, Content, Event, Resource, ContactMessage, Subscriber, VisitorLog, Registration } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    // Only admins can view analytics
    const session = await requireRole('admin');

    await connectDB();

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Generate daily stats for the chart (excluding admin pages)
    const dailyStats = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const [dayVisits, dayUnique] = await Promise.all([
        VisitorLog.countDocuments({
          createdAt: { $gte: date, $lt: nextDate },
          page: { $not: /^\/admin/ },
        }),
        VisitorLog.distinct('sessionId', {
          createdAt: { $gte: date, $lt: nextDate },
        }).then(async (sessions) => {
          // Count unique sessions that visited non-admin pages
          const count = await VisitorLog.countDocuments({
            createdAt: { $gte: date, $lt: nextDate },
            page: { $not: /^\/admin/ },
            sessionId: { $in: sessions },
          });
          return count;
        }),
      ]);

      dailyStats.push({
        date: date.toISOString().split('T')[0],
        visits: dayVisits,
        uniqueVisitors: dayUnique,
      });
    }

    // Get all stats in parallel
    const [
      usersCount,
      contentCount,
      eventsCount,
      resourcesCount,
      messagesCount,
      subscribersCount,
      pendingReviewsCount,
      upcomingEventsCount,
      totalVisits,
      uniqueVisitors,
      pageStats,
      recentVisits,
      todayVisits,
      todayUniqueVisitors,
    ] = await Promise.all([
      User.countDocuments(),
      Content.countDocuments(),
      Event.countDocuments(),
      Resource.countDocuments(),
      ContactMessage.countDocuments(),
      Subscriber.countDocuments({ status: 'active' }),
      Content.countDocuments({ status: 'pending_review' }),
      Event.countDocuments({
        status: 'published',
        startDate: { $gte: new Date() }
      }),

      // Visitor analytics (excluding admin pages)
      VisitorLog.countDocuments({
        createdAt: { $gte: startDate },
        page: { $not: /^\/admin/ },
      }),
      VisitorLog.distinct('sessionId', {
        createdAt: { $gte: startDate },
        page: { $not: /^\/admin/ },
      }).then(sessions => sessions.length),
      VisitorLog.aggregate([
        { $match: { createdAt: { $gte: startDate }, page: { $not: /^\/admin/ } } },
        { $group: { _id: '$page', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      VisitorLog.find({
        createdAt: { $gte: startDate },
        page: { $not: /^\/admin/ },
      })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean(),

      // Today's stats (excluding admin pages)
      VisitorLog.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        page: { $not: /^\/admin/ },
      }),
      VisitorLog.distinct('sessionId', {
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        page: { $not: /^\/admin/ },
      }).then(sessions => sessions.length),
    ]);

    return NextResponse.json({
      users: usersCount,
      content: contentCount,
      events: eventsCount,
      resources: resourcesCount,
      messages: messagesCount,
      subscribers: subscribersCount,
      pendingReviews: pendingReviewsCount,
      upcomingEvents: upcomingEventsCount,
      // Visitor analytics
      analytics: {
        totalVisits,
        uniqueVisitors,
        todayVisits,
        todayUniqueVisitors,
        pageStats,
        recentVisits,
        dailyStats, // Add daily time-series data for charts
      },
    });
  } catch (error: any) {
    if (error?.digest === 'NEXT_REDIRECT') {
      throw error;
    }

    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
