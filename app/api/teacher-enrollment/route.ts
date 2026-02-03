import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import TeacherEnrollment from '@/lib/models/TeacherEnrollment';

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    const body = await request.json();
    const {
      name,
      firstName,
      lastName,
      email,
      phone,
      age,
      city,
      state,
      country,
      profession,
      education,
      meditationExperience,
      teachingExperience,
      whyTeach,
      availability,
    } = body;

    // Validate required fields
    if (
      !name ||
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !age ||
      !city ||
      !state ||
      !country ||
      !profession ||
      !education ||
      !meditationExperience ||
      !whyTeach ||
      !availability
    ) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate age
    if (age < 18 || age > 100) {
      return NextResponse.json(
        { error: 'Must be between 18 and 100 years old' },
        { status: 400 }
      );
    }

    // Check for recent application to prevent spam
    const recentApplication = await TeacherEnrollment.findOne({
      email,
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
    });

    if (recentApplication) {
      // If they have a pending application, tell them to wait
      if (recentApplication.status === 'pending' || recentApplication.status === 'under_review') {
        return NextResponse.json(
          {
            error: 'You already have an application under review. Please wait for our team to respond.',
            applicationId: recentApplication._id,
          },
          { status: 400 }
        );
      }

      // If rejected, they can re-apply after 30 days
      if (recentApplication.status === 'rejected') {
        const daysSinceRejection = Math.floor(
          (Date.now() - new Date(recentApplication.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        );
        const daysRemaining = 30 - daysSinceRejection;
        return NextResponse.json(
          {
            error: `Your previous application was rejected. Please wait ${daysRemaining} more days before re-applying.`,
          },
          { status: 400 }
        );
      }

      // If approved or enrolled, no need to apply again
      if (recentApplication.status === 'approved' || recentApplication.status === 'enrolled') {
        return NextResponse.json(
          {
            message: 'You have already been approved for the teacher training program!',
            status: recentApplication.status,
          },
          { status: 200 }
        );
      }
    }

    // Create teacher enrollment application
    const application = await TeacherEnrollment.create({
      name,
      firstName,
      lastName,
      email,
      phone,
      age,
      city,
      state,
      country,
      profession,
      education,
      meditationExperience,
      teachingExperience: teachingExperience || null,
      whyTeach,
      availability,
      status: 'pending',
    });

    // Return success response
    return NextResponse.json(
      {
        message: 'Application submitted successfully',
        applicationId: application._id,
        referenceNumber: `TE-${Date.now().toString(36).toUpperCase()}`,
        nextSteps: [
          'Our team will review your application within 5-7 business days',
          'You will receive an email with the next steps',
          'If selected, you will be invited for an interview',
          'Final candidates will be enrolled in the next teacher training batch',
        ],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating teacher enrollment:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}
