import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Content from '@/lib/models/Content';

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Fetch published achievements
    const achievements = await Content.find({
      type: 'achievement',
      status: 'published',
    })
      .select('title content publishedAt')
      .sort({ publishedAt: -1 })
      .lean();

    return NextResponse.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}
