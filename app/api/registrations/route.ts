import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { Registration } from '@/lib/models';

// GET check if user is registered for an event
export async function GET(request: NextRequest) {
  try {
    console.log('[Registrations API] Checking registration...');
    const session = await getServerSession(authOptions);
    console.log('[Registrations API] Session:', session ? 'Found' : 'Not found');

    if (!session || !session.user) {
      console.log('[Registrations API] No session or user found');
      return NextResponse.json(
        {
          success: true,
          registered: false,
          message: 'Not authenticated'
        },
        { status: 200 }
      );
    }

    console.log('[Registrations API] User email:', session.user.email);

    await connectDB();

    // Get eventId from query params
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    console.log('[Registrations API] Checking registration for event:', eventId);

    // Check if user has a registration for this event
    const registration = await Registration.findOne({
      eventId: eventId,
      email: session.user.email,
      status: { $ne: 'cancelled' },
    });

    console.log('[Registrations API] Registration found:', !!registration);

    return NextResponse.json({
      success: true,
      registered: !!registration,
      registrationId: registration?._id.toString(),
      status: registration?.status,
    });
  } catch (error) {
    console.error('[Registrations API] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to check registration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST create a general registration (for public registration page)
export async function POST(request: NextRequest) {
  try {
    console.log('[Registrations API] Creating registration...');
    await connectDB();

    const body = await request.json();
    const { name, email, phone, city, profession, firstName, lastName } = body;

    // Handle both name format (first + last) and direct name
    const fullName = name || `${firstName} ${lastName}`;

    // Validate required fields
    if (!fullName || !email || !phone) {
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

    console.log('[Registrations API] Creating registration for:', email);

    // Create general registration (not tied to a specific event)
    const registration = await Registration.create({
      name: fullName,
      email,
      phone,
      city: city || null,
      profession: profession || null,
      status: 'confirmed',
      paymentStatus: 'free',
    });

    console.log('[Registrations API] Registration created successfully');

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful',
        registrationId: registration._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Registrations API] Error creating registration:', error);
    return NextResponse.json(
      {
        error: 'Failed to create registration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
