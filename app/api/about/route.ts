import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import AboutPage from '@/lib/models/AboutPage';
import Content from '@/lib/models/Content';

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

    // Fetch mentors from Content collection
    if (section === 'teamMembers') {
      const [mentors, founders, steeringCommittee] = await Promise.all([
        Content.find({
          type: 'mentors',
          status: 'published'
        })
          .sort({ order: 1, createdAt: -1 })
          .lean(),
        Content.find({
          type: 'founders',
          status: 'published'
        })
          .sort({ order: 1, createdAt: -1 })
          .lean(),
        Content.find({
          type: 'steering_committee',
          status: 'published'
        })
          .sort({ order: 1, createdAt: -1 })
          .lean(),
      ]);

      // Transform mentors to the format expected by the Mentors component
      const transformedMentors = mentors.map((m: any) => ({
        _id: m._id,
        name: m.title,
        title: m.content?.role || 'Mentor',
        role: 'mentor',
        description: m.content?.bio,
        imageUrl: m.content?.image,
        order: m.order,
      }));

      // Transform founders to the format expected by the Founders component
      const transformedFounders = founders.map((f: any) => ({
        _id: f._id,
        name: f.title,
        title: f.content?.role || 'Founder',
        role: 'founder',
        description: f.content?.bio,
        imageUrl: f.content?.image,
        order: f.order,
      }));

      // Transform steering committee to the format expected by the SteeringCommittee component
      const transformedSteering = steeringCommittee.map((s: any) => ({
        _id: s._id,
        name: s.title,
        title: s.content?.role || 'Steering Committee',
        role: 'steering_committee',
        description: s.content?.bio,
        imageUrl: s.content?.image,
        order: s.order,
      }));

      // Combine all: founders, mentors, and steering committee
      return NextResponse.json({
        success: true,
        data: [...transformedFounders, ...transformedMentors, ...transformedSteering],
      });
    }

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
