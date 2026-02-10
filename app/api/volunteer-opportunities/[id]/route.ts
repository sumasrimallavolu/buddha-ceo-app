import { NextRequest, NextResponse } from 'next/server';
import VolunteerOpportunity from '@/lib/models/VolunteerOpportunity';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET single volunteer opportunity by ID (public - no authentication required)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid opportunity ID format' },
        { status: 400 }
      );
    }

    await connectDB();

    const opportunity = await VolunteerOpportunity.findById(id);

    // Return open and closed opportunities, but not draft
    if (!opportunity || opportunity.status === 'draft') {
      return NextResponse.json(
        { error: 'Volunteer opportunity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(opportunity);
  } catch (error) {
    console.error('Error fetching volunteer opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch volunteer opportunity' },
      { status: 500 }
    );
  }
}
