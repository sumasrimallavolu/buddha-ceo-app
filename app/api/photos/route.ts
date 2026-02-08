import { NextRequest, NextResponse } from 'next/server';
import Content from '@/lib/models/Content';
import mongoose from 'mongoose';

// GET /api/photos - Fetch all published photos from Content collection
export async function GET(request: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = parseInt(searchParams.get('skip') || '0');
    const category = searchParams.get('category');

    const query: any = {
      type: 'photos',
      status: 'published'
    };

    if (category && category !== 'all') {
      query['content.category'] = category;
    }

    const photos = await Content.find(query)
      .sort({ order: 1, createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Content.countDocuments(query);

    return NextResponse.json({
      success: true,
      photos: photos.map(p => ({
        _id: p._id,
        title: p.title,
        description: p.content?.description,
        imageUrl: p.content?.imageUrl,
        category: p.content?.category,
        likes: p.content?.likes || 0,
        views: p.content?.views || 0,
      })),
      total,
      hasMore: skip + photos.length < total
    });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}
