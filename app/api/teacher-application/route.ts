import { NextRequest, NextResponse } from 'next/server';
import TeacherApplication from '@/lib/models/TeacherApplication';
import mongoose from 'mongoose';
import { verifyOtp } from '@/lib/otp';
import { sendTeacherApplicationConfirmation } from '@/lib/email-helpers';

// POST /api/teacher-application - Submit teacher application
export async function POST(request: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const body = await request.json();

    // Require OTP code
    if (!body.otpCode || !body.email) {
      return NextResponse.json(
        { success: false, error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    // Verify OTP
    const otpVerification = await verifyOtp({
      email: body.email,
      code: body.otpCode,
      purpose: 'teacher_application',
    });

    if (!otpVerification.valid) {
      return NextResponse.json(
        { success: false, error: otpVerification.error || 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // Remove otpCode from the data before creating application
    const { otpCode, ...applicationData } = body;
    const application = await TeacherApplication.create(applicationData);

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
      console.log('✅ Teacher application confirmation email sent');
    } catch (emailError) {
      console.error('❌ Failed to send teacher confirmation email:', emailError);
      // Don't fail the application if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      application
    });
  } catch (error: any) {
    console.error('Error submitting teacher application:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit application' },
      { status: 500 }
    );
  }
}

// GET /api/teacher-application - Fetch all applications (admin)
export async function GET(request: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const applications = await TeacherApplication.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      applications
    });
  } catch (error: any) {
    console.error('Error fetching teacher applications:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

// PATCH /api/teacher-application/:id - Update application status
export async function PATCH(request: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const application = await TeacherApplication.findByIdAndUpdate(
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
