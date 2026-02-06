import { NextRequest, NextResponse } from 'next/server';
import Photo from '@/lib/models/Photo';
import mongoose from 'mongoose';

// GET /api/photos - Fetch all active photos
export async function GET(request: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = parseInt(searchParams.get('skip') || '0');
    const category = searchParams.get('category');

    const query: any = { isActive: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    const photos = await Photo.find(query)
      .sort({ order: 1, createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Photo.countDocuments(query);

    return NextResponse.json({
      success: true,
      photos,
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

// POST /api/photos - Create a new photo (admin only)
export async function POST(request: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    const body = await request.json();

    const photo = await Photo.create({
      title: body.title,
      description: body.description,
      imageUrl: body.imageUrl,
      category: body.category,
      order: body.order || 0,
      isActive: body.isActive !== undefined ? body.isActive : true
    });

    return NextResponse.json({
      success: true,
      photo
    });
  } catch (error) {
    console.error('Error creating photo:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create photo' },
      { status: 500 }
    );
  }
}
