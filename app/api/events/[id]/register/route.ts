import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Event from '@/lib/models/Event';
import Registration from '@/lib/models/Registration';

import { verifyOtp } from '@/lib/otp';
import { sendEventRegistrationConfirmation } from '@/lib/email-helpers';

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
    const { name, email, phone, city, profession, otpCode } = body;

    // Validate required fields
    if (!name || !email || !phone || !otpCode) {
      return NextResponse.json(
        { error: 'Name, email, phone, and verification code are required' },
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

    // Verify OTP before creating registration
    const otpVerification = await verifyOtp({
      email,
      code: otpCode,
      purpose: 'event_registration',
    });

    if (!otpVerification.valid) {
      return NextResponse.json(
        { error: otpVerification.error || 'Invalid or expired verification code' },
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

    // Send confirmation email
    try {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      
      await sendEventRegistrationConfirmation({
        name: registration.name,
        email: registration.email,
        eventTitle: event.title,
        eventDate: startDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        eventTime: startDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }) + ' - ' + endDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        eventLocation: event.location?.online 
          ? 'Online Event (Link will be sent 24 hours before)' 
          : `${event.location?.venue || 'TBA'}${event.location?.city ? ', ' + event.location.city : ''}`,
        isOnline: event.location?.online || false,
        registeredAt: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
      });
      console.log('✅ Event registration confirmation email sent');
    } catch (emailError) {
      console.error('❌ Failed to send event confirmation email:', emailError);
      // Don't fail the registration if email fails
    }

    // Return success response
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
  } catch (error) {
    console.error('Error creating registration:', error);
    return NextResponse.json(
      { error: 'Failed to create registration' },
      { status: 500 }
    );
  }
}
