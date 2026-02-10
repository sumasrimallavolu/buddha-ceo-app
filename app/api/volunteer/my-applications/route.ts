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

    console.log('Fetching applications for user:', {
      userId: session.user.id,
      email: session.user.email
    });

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

    console.log('Found applications:', applications.length);

    // Enrich with opportunity details
    const enrichedApplications = await Promise.all(
      applications.map(async (app: any) => {
        const opportunity = await VolunteerOpportunity.findById(app.opportunityId).lean();
        return {
          ...app,
          _id: app._id.toString(),
          userId: app.userId?.toString(),
          opportunityId: app.opportunityId?.toString(),
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
          } : null,
          customAnswers: app.customAnswers ? Object.fromEntries(app.customAnswers) : {},
          statusHistory: app.statusHistory?.map((h: any) => ({
            ...h,
            changedAt: new Date(h.changedAt).toISOString()
          })) || []
        };
      })
    );

    return NextResponse.json({ applications: enrichedApplications });
  } catch (error) {
    console.error('Error fetching volunteer applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
