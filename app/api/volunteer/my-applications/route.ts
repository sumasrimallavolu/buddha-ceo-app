import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import VolunteerApplication from '@/lib/models/VolunteerApplication';
import VolunteerOpportunity from '@/lib/models/VolunteerOpportunity';
import mongoose from 'mongoose';

// GET my volunteer applications (requires authentication)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized - Please log in' }, { status: 401 });
    }

    await connectDB();

    // Find all applications by this user (by userId or by email if not linked)
    const applications = await VolunteerApplication
      .find({
        $or: [
          { userId: session.user.id },
          { email: session.user.email }
        ]
      })
      .sort({ createdAt: -1 })
      .lean();

    // Enrich with opportunity details
    const enrichedApplications = await Promise.all(
      applications.map(async (app) => {
        const opportunity = await VolunteerOpportunity.findById(app.opportunityId).lean();
        return {
          ...app,
          opportunity: opportunity ? {
            _id: opportunity._id.toString(),
            title: opportunity.title,
            description: opportunity.description,
            location: opportunity.location,
            type: opportunity.type,
            timeCommitment: opportunity.timeCommitment,
            requiredSkills: opportunity.requiredSkills,
            startDate: opportunity.startDate,
            endDate: opportunity.endDate,
          } : null
        };
      })
    );

    return NextResponse.json({ applications: enrichedApplications });
  } catch (error) {
    console.error('Error fetching volunteer applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
