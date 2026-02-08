import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/session';
import connectDB from '@/lib/mongodb';
import { Content } from '@/lib/models';
import mongoose from 'mongoose';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await getSessionFromRequest(request);

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'content_reviewer')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const content = await Content.findById(id);

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    if (content.status !== 'pending_review') {
      return NextResponse.json(
        { error: 'Content is not pending review' },
        { status: 400 }
      );
    }

    content.status = 'published';
    content.reviewedBy = new mongoose.Types.ObjectId(session.user.id);
    content.publishedAt = new Date();
    await content.save();

    return NextResponse.json({ message: 'Content approved successfully', content });
  } catch (error: any) {
    console.error('Error approving content:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to approve content' },
      { status: 500 }
    );
  }
}
