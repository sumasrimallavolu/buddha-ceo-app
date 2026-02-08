import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Event from '@/lib/models/Event';
import Registration from '@/lib/models/Registration';

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    const body = await request.json();
    const { name, firstName, lastName, email, phone, city, profession, eventType, experience, expectations, eventId } = body;

    // Validate required fields
    if (!name || !email || !phone || !city) {
      return NextResponse.json(
        { error: 'Name, email, phone, and city are required' },
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

    // If eventId is provided, check if event exists and validate registration
    if (eventId) {
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

      // Create event-specific registration
      const registration = await Registration.create({
        eventId,
        name,
        email,
        phone,
        city,
        profession: profession || null,
        status: 'confirmed',
        paymentStatus: 'free',
      });

      // Update event registration count
      await Event.findByIdAndUpdate(eventId, {
        $inc: { currentRegistrations: 1 },
      });

      return NextResponse.json(
        {
          message: 'Registration successful',
          registrationId: registration._id,
          eventTitle: event.title,
          startDate: event.startDate,
          endDate: event.endDate,
        },
        { status: 201 }
      );
    }

    // General registration (no specific event)
    // Check for recent general registration to prevent spam
    const recentRegistration = await Registration.findOne({
      email,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24 hours
    });

    if (recentRegistration) {
      return NextResponse.json(
        { error: 'You have already registered in the last 24 hours. Please wait before registering again.' },
        { status: 400 }
      );
    }

    // Create general interest registration
    const registration = await Registration.create({
      name,
      email,
      phone,
      city,
      profession: profession || undefined,
      status: 'confirmed',
      paymentStatus: 'free',
    });

    // Store additional info in a note or metadata if needed
    // For now, we'll include it in the success response

    return NextResponse.json(
      {
        message: 'Registration successful',
        registrationId: registration._id,
        note: 'We will contact you when upcoming events match your interest',
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
