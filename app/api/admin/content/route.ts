import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/session';
import connectDB from '@/lib/mongodb';
import { Content } from '@/lib/models';

// GET all content with filters
export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session) {
      console.error('GET /api/admin/content - No session found');
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    const query: any = {};

    // Content managers can only see their own content unless it's published
    if (session.user.role === 'content_manager') {
      query.$or = [
        { createdBy: session.user.id },
        { status: 'published' },
      ];
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    const content = await Content.find(query)
      .populate('createdBy', 'name email')
      .populate('reviewedBy', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json(content);
  } catch (error: any) {
    console.error('Error fetching content:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json(
      { error: error.message || 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// POST create new content
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);

    if (!session) {
      console.error('POST /api/admin/content - No session found');
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
    }

    if (session.user.role !== 'admin' && session.user.role !== 'content_manager') {
      console.error('POST /api/admin/content - Forbidden - Role:', session.user.role);
      return NextResponse.json({ error: 'Forbidden - Insufficient permissions' }, { status: 403 });
    }

    await connectDB();

    const body = await request.json();
    const { title, type, content: contentData, status, autoPublish, thumbnailUrl, layout, isFeatured } = body;

    if (!title || !type || !contentData) {
      return NextResponse.json(
        { error: 'Title, type, and content are required' },
        { status: 400 }
      );
    }

    // Determine the status
    let contentStatus = status || 'draft';

    // Auto-publish for content_manager and admin roles
    // Content managers and admins can publish directly without review
    if (contentStatus === 'pending_review' && (session.user.role === 'content_manager' || session.user.role === 'admin')) {
      contentStatus = 'published';
    }

    const content = await Content.create({
      title,
      type,
      content: contentData,
      status: contentStatus,
      createdBy: session.user.id,
      ...(thumbnailUrl && { thumbnailUrl }),
      ...(layout && { layout }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(contentStatus === 'published' && { publishedAt: new Date() }),
    });

    await content.populate('createdBy', 'name email');

    return NextResponse.json(
      {
        message: contentStatus === 'published' ? 'Content published successfully' : 'Content created successfully',
        content
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating content:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json(
      { error: error.message || 'Failed to create content' },
      { status: 500 }
    );
  }
}
