import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import VolunteerApplication from '@/lib/models/VolunteerApplication';
import mongoose from 'mongoose';

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

// Helper function to validate application status
function isValidApplicationStatus(value: string): value is 'pending' | 'approved' | 'rejected' | 'contacted' {
  return ['pending', 'approved', 'rejected', 'contacted'].includes(value);
}

// GET all volunteer applications with filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Role-based access: admin, content_manager, content_reviewer can view
    if (session.user.role !== 'admin' &&
        session.user.role !== 'content_manager' &&
        session.user.role !== 'content_reviewer') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const opportunityId = searchParams.get('opportunityId');
    const status = searchParams.get('status');

    const filter: Record<string, unknown> = {};

    if (opportunityId) {
      if (!isValidObjectId(opportunityId)) {
        return NextResponse.json(
          { error: 'Invalid opportunity ID format' },
          { status: 400 }
        );
      }
      filter.opportunityId = opportunityId;
    }

    if (status && status !== 'all') {
      if (!isValidApplicationStatus(status)) {
        return NextResponse.json(
          { error: 'Invalid status. Must be one of: pending, approved, rejected, contacted' },
          { status: 400 }
        );
      }
      filter.status = status;
    }

    const applications = await VolunteerApplication
      .find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Error fetching volunteer applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
