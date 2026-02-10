import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Event from '@/lib/models/Event';
import Registration from '@/lib/models/Registration';
import { createAndSendOtp } from '@/lib/otp';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('\n========== EVENT REGISTRATION OTP REQUEST ==========');
  console.log('📥 Received send-otp request for event registration');
  
  try {
    const { id: eventId } = await params;
    const body = await request.json();
    console.log('📦 Request body:', JSON.stringify(body, null, 2));
    console.log('🎫 Event ID:', eventId);
    
    const { email } = body as { email?: string };

    if (!email) {
      console.log('❌ Email missing in request');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    console.log('📧 Processing email:', normalizedEmail);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      console.log('❌ Invalid email format');
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    console.log('✅ Email format valid');

    // Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      console.log('🔌 Connecting to database...');
      await mongoose.connect(process.env.MONGODB_URI!);
    }
    console.log('✅ Database connected');

    // Check if event exists
    console.log('🔍 Checking if event exists...');
    const event = await Event.findById(eventId);

    if (!event) {
      console.log('❌ Event not found');
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    console.log('✅ Event found:', event.title);

    if (event.status !== 'upcoming' && event.status !== 'ongoing') {
      console.log('❌ Event not available for registration');
      return NextResponse.json(
        { error: 'Event is not available for registration' },
        { status: 400 }
      );
    }

    // Check if already registered
    console.log('🔍 Checking if already registered...');
    const existingRegistration = await Registration.findOne({
      eventId,
      email: normalizedEmail,
      status: { $ne: 'cancelled' },
    });

    if (existingRegistration) {
      console.log('❌ Already registered for this event');
      return NextResponse.json(
        { error: 'You have already registered for this event' },
        { status: 400 }
      );
    }
    console.log('✅ Email not yet registered');

    // Create and send OTP
    console.log('🚀 Creating and sending OTP...');
    await createAndSendOtp({ email: normalizedEmail, purpose: 'event_registration' });

    console.log('✅ OTP process completed successfully');
    console.log('========================================\n');

    return NextResponse.json(
      {
        message: 'Verification code sent to your email address. Please check your inbox.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('\n❌ ERROR in event registration send-otp route:');
    console.error('  - Error message:', error?.message);
    console.error('  - Full error:', error);
    console.error('========================================\n');

    return NextResponse.json(
      {
        error: 'Failed to send verification code. Please try again.',
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
