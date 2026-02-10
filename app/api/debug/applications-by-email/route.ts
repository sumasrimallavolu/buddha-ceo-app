import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import VolunteerApplication from '@/lib/models/VolunteerApplication';
import VolunteerOpportunity from '@/lib/models/VolunteerOpportunity';

// GET debug endpoint to find applications by email (for testing)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
    }

    await connectDB();

    console.log('=== Debug: Searching for applications ===');
    console.log('Search email:', email);

    // Case-insensitive search for applications by email
    const allApplications = await VolunteerApplication
      .find({})
      .lean();

    console.log('Total applications in DB:', allApplications.length);

    // Filter manually to check for case-insensitive match
    const matchingApps = allApplications.filter((app: any) => {
      const appEmail = app.email?.toLowerCase().trim();
      const searchEmail = email.toLowerCase().trim();
      return appEmail === searchEmail;
    });

    console.log('Matching applications (case-insensitive):', matchingApps.length);

    // Also show exact match results
    const exactMatchApps = allApplications.filter((app: any) => {
      return app.email === email;
    });

    console.log('Matching applications (exact match):', exactMatchApps.length);

    // Enrich with opportunity details
    const enrichedMatchingApps = await Promise.all(
      matchingApps.map(async (app: any) => {
        const opportunity = await VolunteerOpportunity.findById(app.opportunityId).lean();
        return {
          ...app,
          _id: app._id.toString(),
          userId: app.userId?.toString(),
          opportunityId: app.opportunityId?.toString(),
          storedEmail: app.email, // Show exactly how email is stored
          opportunity: opportunity ? {
            _id: opportunity._id.toString(),
            title: opportunity.title,
          } : null
        };
      })
    );

    return NextResponse.json({
      searchEmail: email,
      totalApplications: allApplications.length,
      matchingCount: matchingApps.length,
      exactMatchCount: exactMatchApps.length,
      matchingApplications: enrichedMatchingApps,
      allEmails: allApplications.map((app: any) => ({
        id: app._id.toString(),
        email: app.email,
        exactMatch: app.email === email,
        caseInsensitiveMatch: app.email?.toLowerCase().trim() === email.toLowerCase().trim()
      }))
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
