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

    // Extract all possible event fields
    const {
      title,
      description,
      type,
      startDate,
      endDate,
      imageUrl,
      maxParticipants,
      location,
      status,
      registrationLink,
      benefits,
      requirements,
      whatToBring,
      teacherId,
      teacherName,
      targetAudience,
      curriculum,
      price,
      currency,
      galleryImages,
      dateSlots,
    } = body;

    // Validate required fields
    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!type) {
      return NextResponse.json(
        { error: 'Event type is required' },
        { status: 400 }
      );
    }

    if (!startDate) {
      return NextResponse.json(
        { error: 'Start date is required' },
        { status: 400 }
      );
    }

    if (!endDate) {
      return NextResponse.json(
        { error: 'End date is required' },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      return NextResponse.json(
        { error: 'End date must be on or after start date' },
        { status: 400 }
      );
    }

    // Build event object with proper defaults
    const eventData: any = {
      title: title.trim(),
      type,
      startDate,
      endDate,
      status: status || 'draft',
      currentRegistrations: 0,
      // Default values for optional fields
      description: description?.trim() || '',
      benefits: Array.isArray(benefits) ? benefits.filter(b => b?.trim()).map(b => b.trim()) : [],
      requirements: Array.isArray(requirements) ? requirements.filter(r => r?.trim()).map(r => r.trim()) : [],
      whatToBring: Array.isArray(whatToBring) ? whatToBring.filter(w => w?.trim()).map(w => w.trim()) : [],
      galleryImages: Array.isArray(galleryImages) ? galleryImages.filter(g => g?.trim()).map(g => g.trim()) : [],
      currency: currency || 'INR',
      location: location || { online: true },
    };

    // Add imageUrl if provided
    if (imageUrl?.trim()) {
      eventData.imageUrl = imageUrl.trim();
    }

    // Add maxParticipants if provided and valid
    if (maxParticipants && !isNaN(maxParticipants) && maxParticipants > 0) {
      eventData.maxParticipants = parseInt(maxParticipants);
    }

    // Add registrationLink if provided
    if (registrationLink?.trim()) {
      eventData.registrationLink = registrationLink.trim();
    }

    // Add teacher info if provided
    if (teacherId?.trim()) {
      eventData.teacherId = teacherId.trim();
    }
    if (teacherName?.trim()) {
      eventData.teacherName = teacherName.trim();
    }

    // Add targetAudience if provided
    if (targetAudience?.trim()) {
      eventData.targetAudience = targetAudience.trim();
    }

    // Add curriculum if provided
    if (curriculum?.trim()) {
      eventData.curriculum = curriculum.trim();
    }

    // Add price if provided and valid
    if (price !== undefined && !isNaN(price)) {
      eventData.price = parseFloat(price);
    }

    // Add dateSlots if provided and valid
    if (Array.isArray(dateSlots) && dateSlots.length > 0) {
      const validSlots = dateSlots.filter(slot =>
        slot?.date?.trim() &&
        slot?.startTime?.trim() &&
        slot?.endTime?.trim()
      );
      if (validSlots.length > 0) {
        eventData.dateSlots = validSlots;
      }
    }

    const event = await Event.create(eventData);

    return NextResponse.json(
      { message: 'Event created successfully', event },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create event' },
      { status: 500 }
    );
  }
}
