import { NextRequest, NextResponse } from 'next/server';
import VolunteerOpportunity, { VolunteerType } from '@/lib/models/VolunteerOpportunity';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

// Helper function to validate enum values
function isValidVolunteerType(value: string): value is VolunteerType {
  return ['Remote', 'On-site', 'Hybrid'].includes(value);
}

// GET all volunteer opportunities (public - no authentication required)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const location = searchParams.get('location');

    // Build filter - only show open opportunities to the public
    const filter: Record<string, unknown> = { status: 'open' };

    // Validate and add type filter if provided
    if (type) {
      if (!isValidVolunteerType(type)) {
        return NextResponse.json(
          { error: 'Invalid type. Must be one of: Remote, On-site, Hybrid' },
          { status: 400 }
        );
      }
      filter.type = type;
    }

    // Add location filter if provided (case-insensitive regex)
    if (location) {
      filter.location = new RegExp(location, 'i');
    }

    const opportunities = await VolunteerOpportunity.find(filter)
      .sort({ startDate: 1 })
      .lean();

    return NextResponse.json(opportunities);
  } catch (error) {
    console.error('Error fetching volunteer opportunities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch volunteer opportunities' },
      { status: 500 }
    );
  }
}
