import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import VolunteerOpportunity from '@/lib/models/VolunteerOpportunity';

// GET single volunteer opportunity by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const opportunity = await VolunteerOpportunity.findById(id);

    if (!opportunity) {
      return NextResponse.json({ error: 'Volunteer opportunity not found' }, { status: 404 });
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

// PATCH update volunteer opportunity
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'content_manager')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();

    // Validate dates if both are provided
    if (body.startDate && body.endDate) {
      const start = new Date(body.startDate);
      const end = new Date(body.endDate);
      if (end < start) {
        return NextResponse.json(
          { error: 'End date must be on or after start date' },
          { status: 400 }
        );
      }
    }

    // Validate maxVolunteers if provided
    if (body.maxVolunteers !== undefined && body.maxVolunteers < 1) {
      return NextResponse.json(
        { error: 'Maximum volunteers must be at least 1' },
        { status: 400 }
      );
    }

    // Build update object with only allowed fields
    const updateData: any = {};

    const allowedFields = [
      'title',
      'description',
      'location',
      'type',
      'timeCommitment',
      'startDate',
      'endDate',
      'maxVolunteers',
      'status',
      'requiredSkills',
      'customQuestions'
    ];

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        if (field === 'requiredSkills' && Array.isArray(body[field])) {
          updateData[field] = body[field].filter((s: string) => s?.trim()).map((s: string) => s.trim());
        } else if (field === 'customQuestions' && Array.isArray(body[field])) {
          updateData[field] = body[field].filter((q: any) => q?.title?.trim());
        } else if (typeof body[field] === 'string') {
          updateData[field] = body[field].trim();
        } else {
          updateData[field] = body[field];
        }
      }
    });

    const opportunity = await VolunteerOpportunity.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!opportunity) {
      return NextResponse.json({ error: 'Volunteer opportunity not found' }, { status: 404 });
    }

    return NextResponse.json({ opportunity });
  } catch (error) {
    console.error('Error updating volunteer opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to update volunteer opportunity' },
      { status: 500 }
    );
  }
}

// DELETE volunteer opportunity
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const opportunity = await VolunteerOpportunity.findByIdAndDelete(id);

    if (!opportunity) {
      return NextResponse.json({ error: 'Volunteer opportunity not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Volunteer opportunity deleted successfully' });
  } catch (error) {
    console.error('Error deleting volunteer opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to delete volunteer opportunity' },
      { status: 500 }
    );
  }
}
