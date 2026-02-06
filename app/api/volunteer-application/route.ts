import { NextRequest, NextResponse } from 'next/server';
import VolunteerApplication from '@/lib/models/VolunteerApplication';
import mongoose from 'mongoose';

// POST /api/volunteer-application - Submit volunteer application
export async function POST(request: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const body = await request.json();

    const application = await VolunteerApplication.create(body);

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      application
    });
  } catch (error: any) {
    console.error('Error submitting volunteer application:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit application' },
      { status: 500 }
    );
  }
}

// GET /api/volunteer-application - Fetch all applications (admin)
export async function GET(request: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const applications = await VolunteerApplication.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      applications
    });
  } catch (error: any) {
    console.error('Error fetching volunteer applications:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

// PATCH /api/volunteer-application/:id - Update application status
export async function PATCH(request: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const application = await VolunteerApplication.findByIdAndUpdate(
      id,
      { status: body.status },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      application
    });
  } catch (error: any) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update application' },
      { status: 500 }
    );
  }
}
