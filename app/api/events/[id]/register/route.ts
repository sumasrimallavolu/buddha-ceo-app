import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Event from '@/lib/models/Event';
import Registration from '@/lib/models/Registration';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    const { id: eventId } = await params;
    const body = await request.json();
    const { name, email, phone, city, profession } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if event exists and is available for registration
    const event = await Event.findById(eventId);

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    if (event.status !== 'upcoming' && event.status !== 'ongoing') {
      return NextResponse.json(
        { error: 'Event is not available for registration' },
        { status: 400 }
      );
    }

    // Check if event has reached maximum participants
    if (event.maxParticipants && event.currentRegistrations >= event.maxParticipants) {
      return NextResponse.json(
        { error: 'Event is fully booked' },
        { status: 400 }
      );
    }

    // Check for duplicate registration
    const existingRegistration = await Registration.findOne({
      eventId,
      email,
      status: { $ne: 'cancelled' },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'You have already registered for this event' },
        { status: 400 }
      );
    }

    // Create registration
    const registration = await Registration.create({
      eventId,
      name,
      email,
      phone,
      city: city || null,
      profession: profession || null,
      status: 'confirmed',
      paymentStatus: 'free',
    });

    // Update event registration count
    await Event.findByIdAndUpdate(eventId, {
      $inc: { currentRegistrations: 1 },
    });

    // Return success response
    return NextResponse.json(
      {
        message: 'Registration successful',
        registrationId: registration._id,
        eventTitle: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        timings: event.timings,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating registration:', error);
    return NextResponse.json(
      { error: 'Failed to create registration' },
      { status: 500 }
    );
  }
}
