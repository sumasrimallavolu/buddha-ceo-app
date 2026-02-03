import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Event from '@/lib/models/Event';

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Fetch all events (publicly accessible)
    const events = await Event.find({})
      .select('title description type startDate endDate timings imageUrl maxParticipants currentRegistrations status')
      .sort({ startDate: 1 })
      .lean();

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
