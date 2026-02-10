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

    const userId = session.user.id;
    const userEmail = session.user.email;

    console.log('=== Fetching Volunteer Applications ===');
    console.log('User ID:', userId);
    console.log('User Email:', userEmail);
    console.log('User Role:', session.user.role);

    // Build the query - match by userId OR email (case-insensitive)
    // This handles both cases:
    // 1. User was logged in when applying (has userId)
    // 2. User applied as guest, then logged in later (only has email)

    // First, try exact match with userId OR email
    const exactMatchQuery: any = {
      $or: []
    };

    if (userId) {
      exactMatchQuery.$or.push({ userId: userId });
    }

    if (userEmail) {
      exactMatchQuery.$or.push({ email: userEmail });
    }

    console.log('MongoDB Query (exact match):', JSON.stringify(exactMatchQuery, null, 2));

    let applications = await VolunteerApplication
      .find(exactMatchQuery)
      .sort({ createdAt: -1 })
      .lean();

    console.log('Found applications (exact match):', applications.length);

    // If no applications found with exact match, try case-insensitive email search
    if (applications.length === 0 && userEmail) {
      console.log('No exact matches found, trying case-insensitive email search...');

      // Get all applications and filter manually for case-insensitive email match
      const allApps = await VolunteerApplication.find({}).lean();
        applications = allApps.filter((app: any) => {
        // Match by userId OR case-insensitive email
        if (userId && app.userId?.toString() === userId) {
          return true;
        }
        if (app.email && app.email.toLowerCase() === userEmail.toLowerCase()) {
          return true;
        }
        return false;
      });

      console.log('Found applications (case-insensitive):', applications.length);
    }

    console.log('Found applications:', applications.length);
    applications.forEach((app: any) => {
      console.log('- Application:', {
        id: app._id,
        userId: app.userId,
        email: app.email,
        status: app.status,
        opportunityId: app.opportunityId
      });
    });

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

    console.log('Returning enriched applications:', enrichedApplications.length);

    return NextResponse.json({ applications: enrichedApplications });
  } catch (error) {
    console.error('Error fetching volunteer applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
