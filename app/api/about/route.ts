import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import AboutPage from '@/lib/models/AboutPage';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined');
}

// Cache the database connection
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const section = searchParams.get('section'); // e.g., 'vision', 'founders', 'mentors', etc.

    let about = await AboutPage.findOne();

    // Return empty state with proper structure if no data exists
    if (!about) {
      return NextResponse.json({
        success: true,
        data: {
          whoWeAre: null,
          visionMission: null,
          teamMembers: [],
          coreValues: [],
          services: [],
          partners: [],
          inspiration: null,
          globalReach: null,
        },
      });
    }

    // If section parameter is provided, return only that section
    if (section) {
      const sectionData = (about as any)[section];
      return NextResponse.json({
        success: true,
        data: sectionData,
      });
    }

    // Return full data
    return NextResponse.json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.error('Error fetching about page data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch about page data',
      },
      { status: 500 }
    );
  }
}
