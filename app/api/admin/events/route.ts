import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { Event } from '@/lib/models';

// GET all events
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const events = await Event.find({})
      .sort({ startDate: -1 });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST create new event
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
      description,
      type,
      startDate,
      endDate,
      timings,
      imageUrl,
      maxParticipants,
    } = body;

    if (!title || !description || !type || !startDate || !endDate || !timings) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const event = await Event.create({
      title,
      description,
      type,
      startDate,
      endDate,
      timings,
      imageUrl,
      maxParticipants,
      currentRegistrations: 0,
      status: 'upcoming',
    });

    return NextResponse.json(
      { message: 'Event created successfully', event },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
