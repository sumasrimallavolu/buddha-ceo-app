import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { VisitorLog, logVisitor } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { page, pageTitle, referrer, sessionId } = body;

    // Skip tracking for admin pages
    if (page?.startsWith('/admin')) {
      return NextResponse.json({ success: true, tracked: false });
    }

    // Get IP address from headers
    const ipAddress = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      'unknown';

    // Get user agent
    const userAgent = request.headers.get('user-agent') || undefined;

    // Parse user agent for device info (simple implementation)
    let device: any = {};
    if (userAgent) {
      device.type = /mobile|android|iphone/i.test(userAgent) ? 'mobile' :
                   /tablet|ipad/i.test(userAgent) ? 'tablet' : 'desktop';

      // Simple OS detection
      if (/windows/i.test(userAgent)) device.os = 'Windows';
      else if (/mac|iphone|ipad/i.test(userAgent)) device.os = 'macOS/iOS';
      else if (/android/i.test(userAgent)) device.os = 'Android';
      else if (/linux/i.test(userAgent)) device.os = 'Linux';

      // Simple browser detection
      if (/chrome/i.test(userAgent)) device.browser = 'Chrome';
      else if (/firefox/i.test(userAgent)) device.browser = 'Firefox';
      else if (/safari/i.test(userAgent)) device.browser = 'Safari';
      else if (/edge/i.test(userAgent)) device.browser = 'Edge';
    }

    // Log the visitor
    await logVisitor({
      sessionId: sessionId || generateSessionId(),
      page,
      pageTitle,
      referrer,
      userAgent,
      ipAddress,
      device,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging visitor:', error);
    return NextResponse.json(
      { error: 'Failed to log visitor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const page = searchParams.get('page');

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Build query
    const query: any = {
      createdAt: { $gte: startDate },
    };

    if (page && page !== 'all') {
      query.page = page;
    }

    // Get visitor stats
    const [totalVisits, uniqueVisitors, pageStats, recentVisits] = await Promise.all([
      VisitorLog.countDocuments(query),
      VisitorLog.distinct('sessionId', query).then(sessions => sessions.length),
      VisitorLog.aggregate([
        { $match: query },
        { $group: { _id: '$page', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      VisitorLog.find(query)
        .sort({ createdAt: -1 })
        .limit(100)
        .lean(),
    ]);

    return NextResponse.json({
      totalVisits,
      uniqueVisitors,
      pageStats,
      recentVisits,
    });
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch visitor stats' },
      { status: 500 }
    );
  }
}

function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
