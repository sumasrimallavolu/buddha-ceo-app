import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/session';
import connectDB from '@/lib/mongodb';
import { Content } from '@/lib/models';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await getSessionFromRequest(request);

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'content_manager')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const content = await Content.findById(id);

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // Only content manager who created the content can submit
    if (content.createdBy.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (content.status !== 'draft') {
      return NextResponse.json(
        { error: 'Can only submit draft content for review' },
        { status: 400 }
      );
    }

    content.status = 'pending_review';
    await content.save();

    return NextResponse.json({ message: 'Content submitted for review', content });
  } catch (error: any) {
    console.error('Error submitting content:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to submit content' },
      { status: 500 }
    );
  }
}
