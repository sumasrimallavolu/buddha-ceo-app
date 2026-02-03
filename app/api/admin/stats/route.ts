import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { User, Content, Event, Resource, ContactMessage, Subscriber } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get all stats in parallel for better performance
    const [
      usersCount,
      contentCount,
      eventsCount,
      resourcesCount,
      messagesCount,
      subscribersCount,
      pendingReviewsCount,
      upcomingEventsCount,
    ] = await Promise.all([
      User.countDocuments(),
      Content.countDocuments(),
      Event.countDocuments(),
      Resource.countDocuments(),
      ContactMessage.countDocuments(),
      Subscriber.countDocuments({ status: 'active' }),
      Content.countDocuments({ status: 'pending_review' }),
      Event.countDocuments({ status: 'upcoming' }),
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
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
