import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { Content } from '@/lib/models';

// GET single content by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const content = await Content.findById(id)
      .populate('createdBy', 'name email')
      .populate('reviewedBy', 'name');

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // Check permissions
    if (session.user.role === 'content_manager') {
      // Managers can only see their own content or published content
      if (
        content.createdBy._id.toString() !== session.user.id &&
        content.status !== 'published'
      ) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// PUT update content
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
  const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'content_manager')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { title, type, content: contentData, status, autoPublish } = body;

    const contentItem = await Content.findById(id);

    if (!contentItem) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // Only content managers can edit their own draft content
    if (session.user.role === 'content_manager' && contentItem.createdBy.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Can only edit draft content
    if (contentItem.status !== 'draft') {
      return NextResponse.json(
        { error: 'Can only edit draft content' },
        { status: 400 }
      );
    }

    // Determine status based on request
    let newStatus: 'draft' | 'pending_review' | 'published' | 'archived' = contentItem.status as any;
    if (status) {
      newStatus = status;
    } else if (autoPublish && (session.user.role === 'admin' || session.user.role === 'content_manager')) {
      newStatus = 'published';
    }

    contentItem.title = title;
    contentItem.type = type;
    contentItem.content = contentData;
    contentItem.status = newStatus;

    if (newStatus === 'published') {
      contentItem.publishedAt = new Date();
    }

    await contentItem.save();

    await contentItem.populate('createdBy', 'name email');

    return NextResponse.json({ content: contentItem });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

// DELETE content
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const content = await Content.findById(id);

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // Only admins or content managers who created the content can delete
    if (session.user.role === 'content_manager' && content.createdBy.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await Content.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}
