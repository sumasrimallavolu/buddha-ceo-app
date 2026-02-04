import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Content } from '@/lib/models';

// GET published content for public display
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = request.nextUrl;
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '12');
    const featured = searchParams.get('featured');
    const skip = parseInt(searchParams.get('skip') || '0');

    const query: any = { status: 'published' };

    if (type && type !== 'all') {
      query.type = type;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    const content = await Content.find(query)
      .select('title type content thumbnailUrl layout isFeatured publishedAt createdAt')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Content.countDocuments(query);

    return NextResponse.json({
      content,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching public content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}
