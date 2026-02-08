import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { Registration, Event } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Allow any authenticated user to see their registrations (no role restriction)
    await connectDB();

    // Get all registrations for this user's email
    const registrations = await Registration.find({
      email: session.user.email,
      status: { $ne: 'cancelled' },
    }).sort({ createdAt: -1 });

    if (!registrations || registrations.length === 0) {
      return NextResponse.json({
        success: true,
        registrations: [],
        total: 0,
      });
    }

    // Get event IDs
    const eventIds = registrations
      .map((reg) => reg.eventId)
      .filter((id): id is mongoose.Types.ObjectId => id !== undefined);

    // Fetch all events
    const events = await Event.find({
      _id: { $in: eventIds },
    });

    // Combine registration data with event data
    const registrationsWithEvents = registrations.map((registration) => {
      const event = events.find(
        (e) => e._id.toString() === registration.eventId?.toString()
      );

      return {
        registration: {
          id: registration._id.toString(),
          status: registration.status,
          paymentStatus: registration.paymentStatus,
          phone: registration.phone,
          city: registration.city,
          profession: registration.profession,
          registeredAt: registration.createdAt,
        },
        event: event ? {
          id: event._id.toString(),
          title: event.title,
          description: event.description,
          type: event.type,
          startDate: event.startDate,
          endDate: event.endDate,
          timings: event.timings,
          imageUrl: event.imageUrl,
          status: event.status,
          location: event.location,
          teacherName: event.teacherName,
          benefits: event.benefits,
        } : null,
      };
    });

    return NextResponse.json({
      success: true,
      registrations: registrationsWithEvents,
      total: registrationsWithEvents.length,
    });
  } catch (error) {
    console.error('Error fetching user registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}
