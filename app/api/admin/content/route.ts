import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { Content } from '@/lib/models';

// GET all content with filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// POST create new content
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'content_manager')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    if (autoPublish && (session.user.role === 'content_manager' || session.user.role === 'admin')) {
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
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}
