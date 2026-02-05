import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { Resource } from '@/lib/models';

// GET all resources
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const resources = await Resource.find({})
      .sort({ order: 1, createdAt: -1 });

    return NextResponse.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

// POST create new resource
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'content_manager')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const {
      title,
      type,
      description,
      category,
      downloadUrl,
      videoUrl,
      linkUrl,
      thumbnailUrl,
      order,
      status,
      autoPublish,
    } = body;

    if (!title || !type || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Determine status based on request and user role
    let resourceStatus = status || 'draft';
    if (autoPublish && (session.user.role === 'admin' || session.user.role === 'content_manager')) {
      resourceStatus = 'published';
    }

    const resource = await Resource.create({
      title,
      type,
      description,
      category,
      downloadUrl,
      videoUrl,
      linkUrl,
      thumbnailUrl,
      order: order || 0,
      status: resourceStatus,
    });

    return NextResponse.json(
      { message: 'Resource created successfully', resource },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}
