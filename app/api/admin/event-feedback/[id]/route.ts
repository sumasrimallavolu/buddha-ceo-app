import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { EventFeedback } from '@/lib/models';

// GET single feedback
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Allow admin, content_manager, and content_reviewer to view
    if (
      session.user.role !== 'admin' &&
      session.user.role !== 'content_manager' &&
      session.user.role !== 'content_reviewer'
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();

    const { id } = await params;
    const feedback = await EventFeedback.findById(id);

    if (!feedback) {
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}

// PATCH update feedback (approve/reject)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Allow admin, content_manager, and content_reviewer to moderate
    if (
      session.user.role !== 'admin' &&
      session.user.role !== 'content_manager' &&
      session.user.role !== 'content_reviewer'
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { status, adminNotes } = body;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const feedback = await EventFeedback.findByIdAndUpdate(
      id,
      {
        status,
        adminNotes: adminNotes || '',
        reviewedBy: session.user.email,
        reviewedAt: new Date(),
      },
      { new: true }
    );

    if (!feedback) {
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      feedback,
      message: `Feedback ${status} successfully`,
    });
  } catch (error) {
    console.error('Error updating feedback:', error);
    return NextResponse.json(
      { error: 'Failed to update feedback' },
      { status: 500 }
    );
  }
}

// DELETE feedback
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin can delete feedback
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();

    const { id } = await params;
    const feedback = await EventFeedback.findByIdAndDelete(id);

    if (!feedback) {
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Feedback deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return NextResponse.json(
      { error: 'Failed to delete feedback' },
      { status: 500 }
    );
  }
}
