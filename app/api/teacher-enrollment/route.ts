import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import TeacherEnrollment from '@/lib/models/TeacherEnrollment';
import { verifyOtp } from '@/lib/otp';
import { sendTeacherApplicationConfirmation } from '@/lib/email-helpers';

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
      otpCode,
    } = body;

    // Validate required fields (including OTP)
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
      !availability ||
      !otpCode
    ) {
      return NextResponse.json(
        { error: 'All required fields must be filled, including verification code' },
        { status: 400 }
      );
    }

    // Verify OTP before creating enrollment
    const otpVerification = await verifyOtp({
      email,
      code: otpCode,
      purpose: 'teacher_enrollment',
    });

    if (!otpVerification.valid) {
      return NextResponse.json(
        { error: otpVerification.error || 'Invalid or expired verification code' },
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

    // Send confirmation email
    try {
      await sendTeacherApplicationConfirmation({
        firstName: application.firstName,
        lastName: application.lastName,
        email: application.email,
        submittedAt: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
      console.log('✅ Teacher enrollment confirmation email sent');
    } catch (emailError) {
      console.error('❌ Failed to send teacher enrollment confirmation email:', emailError);
      // Don't fail the enrollment if email fails
    }

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
