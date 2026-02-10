import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import VolunteerOpportunity from '@/lib/models/VolunteerOpportunity';
import VolunteerApplication from '@/lib/models/VolunteerApplication';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

// Helper function to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// POST submit application for a volunteer opportunity (public - no authentication required)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid opportunity ID format' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user is logged in (optional - public can still apply)
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Find the opportunity
    const opportunity = await VolunteerOpportunity.findById(id);

    // Check if opportunity exists and is open
    if (!opportunity || opportunity.status !== 'open') {
      return NextResponse.json(
        { error: 'Volunteer opportunity not found or closed' },
        { status: 404 }
      );
    }

    // Parse request body
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
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'city',
      'state',
      'country',
      'age',
      'profession',
      'experience',
      'availability',
      'whyVolunteer',
      'skills'
    ];

    for (const field of requiredFields) {
      if (!body[field] || (typeof body[field] === 'string' && !(body[field] as string).trim())) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    if (typeof body.email === 'string' && !isValidEmail(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate age is a number
    const age = parseInt(String(body.age));
    if (isNaN(age) || age < 1) {
      return NextResponse.json(
        { error: 'Age must be a valid number' },
        { status: 400 }
      );
    }

    // Validate customAnswers against opportunity's customQuestions
    if (opportunity.customQuestions && opportunity.customQuestions.length > 0) {
      const customAnswers = (body.customAnswers as Record<string, string>) || {};

      for (const question of opportunity.customQuestions) {
        if (question.required && !customAnswers[question.id]?.trim()) {
          return NextResponse.json(
            { error: `Custom question "${question.title}" is required` },
            { status: 400 }
          );
        }

        // For select/checkbox types, validate answer is in options
        if ((question.type === 'select' || question.type === 'checkbox') && question.options) {
          const answer = customAnswers[question.id];
          if (answer) {
            const selectedOptions = answer.split(',').map(s => s.trim());
            const validOptions = selectedOptions.filter(opt => question.options!.includes(opt));
            if (validOptions.length === 0) {
              return NextResponse.json(
                { error: `Invalid option selected for "${question.title}"` },
                { status: 400 }
              );
            }
          }
        }
      }
    }

    // Check for duplicate application by email for this opportunity
    const existing = await VolunteerApplication.findOne({
      email: String(body.email),
      opportunityId: id
    });

    if (existing) {
      return NextResponse.json(
        { error: 'You have already applied for this opportunity' },
        { status: 400 }
      );
    }

    // Atomically increment application count and check capacity
    const updatedOpportunity = await VolunteerOpportunity.findByIdAndUpdate(
      id,
      { $inc: { currentApplications: 1 } },
      { new: true }
    );

    // Double-check capacity after atomic increment
    if (!updatedOpportunity || updatedOpportunity.status !== 'open') {
      return NextResponse.json(
        { error: 'Volunteer opportunity not found or closed' },
        { status: 404 }
      );
    }

    if (updatedOpportunity.maxVolunteers > 0 && updatedOpportunity.currentApplications > updatedOpportunity.maxVolunteers) {
      // Decrement back since we're over capacity
      await VolunteerOpportunity.findByIdAndUpdate(id, { $inc: { currentApplications: -1 } });
      return NextResponse.json(
        { error: 'This opportunity is full' },
        { status: 400 }
      );
    }

    // Create the application
    const applicationData: Record<string, unknown> = {
      userId: userId || undefined,
      opportunityId: id,
      opportunityTitle: opportunity.title,
      firstName: (body.firstName as string).trim(),
      lastName: (body.lastName as string).trim(),
      email: (body.email as string).trim(),
      phone: (body.phone as string).trim(),
      city: (body.city as string).trim(),
      state: (body.state as string).trim(),
      country: (body.country as string).trim(),
      age,
      profession: (body.profession as string).trim(),
      interestArea: (body.interestArea as string) || 'Other', // Default to 'Other' if not provided
      experience: (body.experience as string).trim(),
      availability: (body.availability as string).trim(),
      whyVolunteer: (body.whyVolunteer as string).trim(),
      skills: (body.skills as string).trim(),
      status: 'pending',
      statusHistory: [{
        status: 'pending',
        changedAt: new Date(),
        changedBy: session?.user?.email || 'Applicant'
      }]
    };

    // Add custom answers if provided (already validated above)
    if (body.customAnswers && typeof body.customAnswers === 'object') {
      applicationData.customAnswers = body.customAnswers;
    }

    console.log('=== Creating Volunteer Application ===');
    console.log('Session userId:', userId);
    console.log('Application email:', applicationData.email);
    console.log('Application Data:', JSON.stringify(applicationData, null, 2));

    const application = await VolunteerApplication.create(applicationData);

    console.log('Application created with ID:', application._id);
    console.log('Stored userId:', application.userId);
    console.log('Stored email:', application.email);

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully',
        applicationId: application._id
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting application:', error);

    // Handle Mongoose validation errors
    if (error && typeof error === 'object' && 'errors' in error) {
      const validationErrors = Object.values((error as any).errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit application' },
      { status: 500 }
    );
  }
}
