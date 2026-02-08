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
    console.log('Creating resource with data:', JSON.stringify(body, null, 2));

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
      subtitle,
      quote,
    } = body;

    // For testimonials and blogs, description is optional
    if (type === 'testimonial' || type === 'blog') {
      if (!title || !type || !category) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }
    } else {
      if (!title || !type || !description || !category) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }
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
      subtitle,
      quote,
    });

    return NextResponse.json(
      { message: 'Resource created successfully', resource },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating resource:', error);
    console.error('Error details:', {
      message: error?.message,
      name: error?.name,
      errors: error?.errors,
    });
    return NextResponse.json(
      {
        error: 'Failed to create resource',
        details: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
