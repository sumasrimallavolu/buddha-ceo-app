import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Resource from '@/lib/models/Resource';
import Content from '@/lib/models/Content';

export async function GET(request: NextRequest) {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');

    // Build query for resources
    const query: any = {
      status: 'published'
    };

    if (type) {
      query.type = type;
    }

    if (category) {
      query.category = category;
    }

    // Fetch all resources (books, videos, articles, links, testimonials)
    const resources = await Resource.find(query)
      .sort({ order: 1, createdAt: -1 })
      .lean();

    // Group by resource type
    const groupedResources = {
      books: resources.filter((r) => r.type === 'book'),
      videos: resources.filter((r) => r.type === 'video'),
      magazines: resources.filter((r) => r.type === 'magazine'),
      links: resources.filter((r) => r.type === 'link'),
      blogs: resources.filter((r) => r.type === 'blog'),
      testimonials: resources.filter((r) => r.type === 'testimonial'),
    };

    // Fetch leadership cards from Content collection
    const leadership = await Content.find({
      type: 'leadership',
      status: 'published'
    })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    // Get stats
    const stats = {
      books: groupedResources.books.length,
      videos: groupedResources.videos.length,
      magazines: groupedResources.magazines.length,
      links: groupedResources.links.length,
      blogs: groupedResources.blogs.length,
      testimonials: groupedResources.testimonials.length,
      leadership: leadership.length,
    };

    return NextResponse.json({
      success: true,
      resources: {
        books: groupedResources.books.map(r => ({
          _id: r._id,
          title: r.title,
          description: r.description,
          thumbnailUrl: r.thumbnailUrl,
          downloadUrl: r.downloadUrl,
          purchaseUrl: r.purchaseUrl,
          category: r.category,
          author: r.author,
          isbn: r.isbn,
          pages: r.pages,
          order: r.order,
        })),
        videos: groupedResources.videos.map(r => ({
          _id: r._id,
          title: r.title,
          description: r.description,
          thumbnailUrl: r.thumbnailUrl,
          videoUrl: r.videoUrl,
          category: r.category,
          order: r.order,
        })),
        magazines: groupedResources.magazines.map(r => ({
          _id: r._id,
          title: r.title,
          description: r.description,
          thumbnailUrl: r.thumbnailUrl,
          downloadUrl: r.downloadUrl,
          content: r.content,
          category: r.category,
          order: r.order,
        })),
        links: groupedResources.links.map(r => ({
          _id: r._id,
          title: r.title,
          description: r.description,
          linkUrl: r.linkUrl,
          category: r.category,
          order: r.order,
        })),
        blogs: groupedResources.blogs.map(r => ({
          _id: r._id,
          title: r.title,
          description: r.description,
          linkUrl: r.linkUrl,
          thumbnailUrl: r.thumbnailUrl,
          category: r.category,
          order: r.order,
        })),
        testimonials: groupedResources.testimonials.map(r => ({
          _id: r._id,
          title: r.title,
          quote: r.quote,
          subtitle: r.subtitle,
          videoUrl: r.videoUrl,
          thumbnailUrl: r.thumbnailUrl,
          category: r.category,
          order: r.order,
        })),
      },
      leadership: leadership.map(l => ({
        _id: l._id,
        title: l.title,
        description: l.content?.description,
        category: l.content?.category,
        author: l.content?.author,
        coverImage: l.content?.coverImage,
        videoUrl: l.content?.videoUrl,
        linkUrl: l.content?.linkUrl,
        content: l.content?.content,
        order: l.order,
      })),
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
