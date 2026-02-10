import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import VolunteerOpportunity, {
  IVolunteerOpportunity,
  VolunteerType,
  VolunteerStatus,
  ICustomQuestion
} from '@/lib/models/VolunteerOpportunity';
import mongoose, { Error } from 'mongoose';

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

// Helper function to validate enum values
function isValidVolunteerType(value: string): value is VolunteerType {
  return ['Remote', 'On-site', 'Hybrid'].includes(value);
}

function isValidVolunteerStatus(value: string): value is VolunteerStatus {
  return ['open', 'closed', 'draft'].includes(value);
}

// Helper function to validate custom questions
function isValidCustomQuestion(q: any): q is ICustomQuestion {
  if (!q || typeof q !== 'object') return false;
  if (!q.id || typeof q.id !== 'string') return false;
  if (!q.title || typeof q.title !== 'string') return false;
  if (!q.type || typeof q.type !== 'string') return false;
  if (!['text', 'textarea', 'select', 'checkbox'].includes(q.type)) return false;
  if (typeof q.required !== 'boolean') return false;
  // For select and checkbox types, options must be present and non-empty
  if ((q.type === 'select' || q.type === 'checkbox')) {
    if (!Array.isArray(q.options) || q.options.length === 0) return false;
  }
  return true;
}

// GET single volunteer opportunity by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Priority 1 #2: Validate ObjectId format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid opportunity ID format' },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Priority 1 #3: Add role check to GET endpoint
    if (session.user.role !== 'admin' && session.user.role !== 'content_manager') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
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

    // Priority 1 #2: Validate ObjectId format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid opportunity ID format' },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'content_manager')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Priority 2 #6: Add JSON parsing error handling
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Priority 1 #4: Validate type enum if provided
    if (body.type && typeof body.type === 'string' && !isValidVolunteerType(body.type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be one of: Remote, On-site, Hybrid' },
        { status: 400 }
      );
    }

    // Priority 1 #4: Validate status enum if provided
    if (body.status && typeof body.status === 'string' && !isValidVolunteerStatus(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: open, closed, draft' },
        { status: 400 }
      );
    }

    // Validate dates if both are provided
    if (body.startDate && body.endDate) {
      const start = new Date(body.startDate as string);
      const end = new Date(body.endDate as string);
      if (end < start) {
        return NextResponse.json(
          { error: 'End date must be on or after start date' },
          { status: 400 }
        );
      }
    }

    // Priority 1 #5: Validate maxVolunteers if provided
    if (body.maxVolunteers !== undefined) {
      const maxVolunteers = parseInt(String(body.maxVolunteers));
      if (isNaN(maxVolunteers) || maxVolunteers < 1) {
        return NextResponse.json(
          { error: 'Maximum volunteers must be a valid number greater than 0' },
          { status: 400 }
        );
      }
      body.maxVolunteers = maxVolunteers;
    }

    // Build update object with only allowed fields
    const updateData: Record<string, unknown> = {};

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
          updateData[field] = body[field]!.filter((s: string) => s?.trim()).map((s: string) => s.trim());
        } else if (field === 'customQuestions' && Array.isArray(body[field])) {
          // Priority 2 #7: Improve customQuestions validation
          const validQuestions = (body[field] as any[]).filter(isValidCustomQuestion);
          if (validQuestions.length !== (body[field] as any[]).length) {
            throw new Error('Custom questions must have id, title, type, required fields. For select/checkbox types, options array is required.');
          }
          updateData[field] = validQuestions;
        } else if (typeof body[field] === 'string') {
          updateData[field] = body[field]!.trim();
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

    // Priority 1 #1: Add Mongoose ValidationError handling
    if (error instanceof Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update volunteer opportunity' },
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

    // Priority 1 #2: Validate ObjectId format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid opportunity ID format' },
        { status: 400 }
      );
    }

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
