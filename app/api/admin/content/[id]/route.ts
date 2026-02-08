import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/session';
import connectDB from '@/lib/mongodb';
import { Content } from '@/lib/models';

// GET single content by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSessionFromRequest(request);

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
  } catch (error: any) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch content' },
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
    const session = await getSessionFromRequest(request);

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'content_manager')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { title, type, content: contentData, status, autoPublish, thumbnailUrl, layout, isFeatured, mediaOrder } = body;

    const contentItem = await Content.findById(id);

    if (!contentItem) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // Content managers can only edit their own content
    if (session.user.role === 'content_manager' && contentItem.createdBy.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Allow editing all content types (draft, pending_review, published)
    // Content managers and admins can edit published content

    // Determine status based on request
    let newStatus: 'draft' | 'pending_review' | 'published' | 'archived' = contentItem.status as any;

    if (status) {
      newStatus = status;
      // Auto-publish for content_manager and admin roles
      // Content managers and admins can publish directly without review
      if (newStatus === 'pending_review' && (session.user.role === 'content_manager' || session.user.role === 'admin')) {
        newStatus = 'published';
      }
    } else if (autoPublish && (session.user.role === 'admin' || session.user.role === 'content_manager')) {
      newStatus = 'published';
    }

    // Update root-level fields
    contentItem.title = title;
    contentItem.type = type;
    contentItem.content = contentData;
    contentItem.status = newStatus;

    // Update optional root-level fields
    if (thumbnailUrl !== undefined) contentItem.thumbnailUrl = thumbnailUrl;
    if (layout !== undefined) contentItem.layout = layout;
    if (isFeatured !== undefined) contentItem.isFeatured = isFeatured;
    if (mediaOrder !== undefined) contentItem.mediaOrder = mediaOrder;

    if (newStatus === 'published') {
      contentItem.publishedAt = new Date();
    }

    await contentItem.save();

    await contentItem.populate('createdBy', 'name email');

    return NextResponse.json({ content: contentItem });
  } catch (error: any) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update content' },
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

    const session = await getSessionFromRequest(request);

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
  } catch (error: any) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete content' },
      { status: 500 }
    );
  }
}
