import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Event from '@/lib/models/Event';

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    const { searchParams } = new URL(request.url);

    // Get query parameters
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || 'startDate';
    const startDate = searchParams.get('startDate');
    const priority = searchParams.get('priority'); // 'upcoming' or 'completed'

    let events: any[] = [];
    let query: any = {};

    // Handle priority parameter
    if (priority === 'upcoming') {
      // First, try to get upcoming events
      query.status = 'upcoming';

      if (startDate) {
        query.startDate = { $gte: new Date(startDate) };
      }

      events = await Event.find(query)
        .select('title description type startDate endDate timings imageUrl maxParticipants currentRegistrations status location')
        .sort({ startDate: 1 })
        .limit(limit)
        .lean();

      // If no upcoming events, fall back to completed events
      if (events.length === 0) {
        query = { status: 'completed' };
        events = await Event.find(query)
          .select('title description type startDate endDate timings imageUrl maxParticipants currentRegistrations status location')
          .sort({ startDate: -1 }) // Most recent first
          .limit(limit)
          .lean();
      }
    } else {
      // Normal query without priority
      if (status && status !== 'all') {
        query.status = status;
      }

      // Filter events after start date if provided
      if (startDate) {
        query.startDate = { $gte: new Date(startDate) };
      }

      // Build sort object
      const sortObj: any = {};
      if (sort === 'startDate') {
        sortObj.startDate = 1; // Ascending for upcoming events
      } else if (sort === '-startDate') {
        sortObj.startDate = -1; // Descending for recent events
      }

      // Fetch events with filters
      events = await Event.find(query)
        .select('title description type startDate endDate timings imageUrl maxParticipants currentRegistrations status location')
        .sort(sortObj)
        .limit(limit)
        .lean();
    }

    // Get total count (based on original query, not priority fallback)
    const total = await Event.countDocuments(query);

    return NextResponse.json({
      success: true,
      events,
      total
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
