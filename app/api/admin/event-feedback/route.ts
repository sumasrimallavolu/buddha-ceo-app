import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { EventFeedback, Event } from '@/lib/models';

// GET all pending feedback (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== 'admin' && session.user.role !== 'content_manager') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const type = searchParams.get('type');

    const query: any = {};
    if (status !== 'all') query.status = status;
    if (type) query.type = type;

    const feedbacks = await EventFeedback.find(query)
      .sort({ createdAt: -1 })
      .populate('eventId', 'title startDate endDate imageUrl');

    return NextResponse.json({
      success: true,
      feedbacks,
      total: feedbacks.length,
    });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedbacks' },
      { status: 500 }
    );
  }
}
