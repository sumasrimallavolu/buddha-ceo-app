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

// GET all volunteer opportunities
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Priority 1 #3: Add role check to GET endpoint
    if (session.user.role !== 'admin' && session.user.role !== 'content_manager') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const filter: Record<string, unknown> = {};
    if (status && status !== 'all') {
      // Priority 1 #4: Validate status enum
      if (!isValidVolunteerStatus(status)) {
        return NextResponse.json(
          { error: 'Invalid status. Must be one of: open, closed, draft' },
          { status: 400 }
        );
      }
      filter.status = status;
    }

    const opportunities = await VolunteerOpportunity.find(filter)
      .sort({ createdAt: -1 })
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

// POST create new volunteer opportunity
export async function POST(request: NextRequest) {
  try {
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

    // Validate required fields
    if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!body.description || typeof body.description !== 'string' || !body.description.trim()) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    if (!body.location || typeof body.location !== 'string' || !body.location.trim()) {
      return NextResponse.json(
        { error: 'Location is required' },
        { status: 400 }
      );
    }

    if (!body.type || typeof body.type !== 'string') {
      return NextResponse.json(
        { error: 'Type is required' },
        { status: 400 }
      );
    }

    // Priority 1 #4: Validate type enum
    if (body.type && !isValidVolunteerType(body.type as string)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be one of: Remote, On-site, Hybrid' },
        { status: 400 }
      );
    }

    if (!body.timeCommitment || typeof body.timeCommitment !== 'string' || !body.timeCommitment.trim()) {
      return NextResponse.json(
        { error: 'Time commitment is required' },
        { status: 400 }
      );
    }

    if (!body.startDate) {
      return NextResponse.json(
        { error: 'Start date is required' },
        { status: 400 }
      );
    }

    if (!body.endDate) {
      return NextResponse.json(
        { error: 'End date is required' },
        { status: 400 }
      );
    }

    // Priority 1 #5: Add NaN check for parseInt
    const maxVolunteers = parseInt(String(body.maxVolunteers));
    if (!body.maxVolunteers || isNaN(maxVolunteers) || maxVolunteers < 1) {
      return NextResponse.json(
        { error: 'Maximum volunteers must be a valid number greater than 0' },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(body.startDate as string);
    const end = new Date(body.endDate as string);
    if (end < start) {
      return NextResponse.json(
        { error: 'End date must be on or after start date' },
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

    // Priority 2 #7: Improve customQuestions validation
    let validatedQuestions: ICustomQuestion[] = [];
    if (Array.isArray(body.customQuestions)) {
      const validQuestions = body.customQuestions.filter(isValidCustomQuestion);
      if (validQuestions.length !== body.customQuestions.length) {
        return NextResponse.json(
          { error: 'Custom questions must have id, title, type, required fields. For select/checkbox types, options array is required.' },
          { status: 400 }
        );
      }
      validatedQuestions = validQuestions;
    }

    // Build opportunity object with proper defaults
    const opportunityData: Omit<IVolunteerOpportunity, 'createdAt' | 'updatedAt'> = {
      title: (body.title as string).trim(),
      description: (body.description as string).trim(),
      location: (body.location as string).trim(),
      type: body.type as VolunteerType,
      timeCommitment: (body.timeCommitment as string).trim(),
      startDate: new Date(body.startDate as string),
      endDate: new Date(body.endDate as string),
      maxVolunteers,
      currentApplications: 0,
      status: ((body.status as string) || 'draft') as VolunteerStatus,
      requiredSkills: Array.isArray(body.requiredSkills)
        ? body.requiredSkills.filter((s: string) => s?.trim()).map((s: string) => s.trim())
        : [],
      customQuestions: validatedQuestions,
      createdBy: {
        name: session.user.name,
        email: session.user.email
      }
    };

    const opportunity = await VolunteerOpportunity.create(opportunityData);

    return NextResponse.json(
      { message: 'Volunteer opportunity created successfully', opportunity },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating volunteer opportunity:', error);

    // Priority 1 #1: Add Mongoose ValidationError handling
    if (error instanceof Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create volunteer opportunity' },
      { status: 500 }
    );
  }
}
