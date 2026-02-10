import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import VolunteerOpportunity from '@/lib/models/VolunteerOpportunity';

// GET all volunteer opportunities
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const filter: any = {};
    if (status && status !== 'all') {
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

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!body.description || !body.description.trim()) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    if (!body.location || !body.location.trim()) {
      return NextResponse.json(
        { error: 'Location is required' },
        { status: 400 }
      );
    }

    if (!body.type) {
      return NextResponse.json(
        { error: 'Type is required' },
        { status: 400 }
      );
    }

    if (!body.timeCommitment || !body.timeCommitment.trim()) {
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

    if (!body.maxVolunteers || body.maxVolunteers < 1) {
      return NextResponse.json(
        { error: 'Maximum volunteers must be at least 1' },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(body.startDate);
    const end = new Date(body.endDate);
    if (end < start) {
      return NextResponse.json(
        { error: 'End date must be on or after start date' },
        { status: 400 }
      );
    }

    // Build opportunity object with proper defaults
    const opportunityData: any = {
      title: body.title.trim(),
      description: body.description.trim(),
      location: body.location.trim(),
      type: body.type,
      timeCommitment: body.timeCommitment.trim(),
      startDate: body.startDate,
      endDate: body.endDate,
      maxVolunteers: parseInt(body.maxVolunteers),
      currentApplications: 0,
      status: body.status || 'draft',
      requiredSkills: Array.isArray(body.requiredSkills)
        ? body.requiredSkills.filter((s: string) => s?.trim()).map((s: string) => s.trim())
        : [],
      customQuestions: Array.isArray(body.customQuestions)
        ? body.customQuestions.filter((q: any) => q?.title?.trim())
        : [],
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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create volunteer opportunity' },
      { status: 500 }
    );
  }
}
