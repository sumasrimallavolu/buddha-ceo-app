import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { Content } from '@/lib/models';
import mongoose from 'mongoose';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);

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
  } catch (error) {
    console.error('Error approving content:', error);
    return NextResponse.json(
      { error: 'Failed to approve content' },
      { status: 500 }
    );
  }
}
