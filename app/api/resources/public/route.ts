import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Resource from '@/lib/models/Resource';
import Content from '@/lib/models/Content';

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    const { searchParams } = new URL(request.url);

    // Get query parameters
    const type = searchParams.get('type');
    const category = searchParams.get('category');

    // Build query
    const query: any = { status: 'published' };

    if (type && type !== 'all') {
      query.type = type;
    }

    if (category) {
      query.category = category;
    }

    // Fetch resources
    const resources = await Resource.find(query)
      .sort({ order: 1, createdAt: -1 })
      .lean();

    // Group by type
    const groupedResources = {
      books: resources.filter((r) => r.type === 'book'),
      videos: resources.filter((r) => r.type === 'video'),
      magazines: resources.filter((r) => r.type === 'magazine'),
      links: resources.filter((r) => r.type === 'link'),
      blogs: [], // Can be added later as a separate type or via 'link' type
    };

    // Fetch testimonials
    const testimonials = await Content.find({
      type: 'testimonial',
      status: 'published'
    })
      .sort({ createdAt: -1 })
      .lean();

    // Get stats
    const stats = {
      books: groupedResources.books.length,
      videos: groupedResources.videos.length,
      magazines: groupedResources.magazines.length,
      links: groupedResources.links.length,
      blogs: groupedResources.blogs.length,
      testimonials: testimonials.length,
    };

    return NextResponse.json({
      success: true,
      resources: groupedResources,
      testimonials,
      stats,
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}
