import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import TeacherApplication from '@/lib/models/TeacherApplication';
import { createAndSendOtp } from '@/lib/otp';

export async function POST(request: NextRequest) {
  console.log('\n========== TEACHER APPLICATION OTP REQUEST ==========');
  console.log('📥 Received send-otp request for teacher application');
  
  try {
    const body = await request.json();
    console.log('📦 Request body:', JSON.stringify(body, null, 2));
    
    const { email } = body as { email?: string };

    if (!email) {
      console.log('❌ Email missing in request');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    console.log('📧 Processing email:', normalizedEmail);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      console.log('❌ Invalid email format');
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    console.log('✅ Email format valid');

    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Database connected');

    // Check if already applied recently
    console.log('🔍 Checking if already applied...');
    const existingApplication = await TeacherApplication.findOne({
      email: normalizedEmail,
    });

    if (existingApplication) {
      console.log('⚠️  Note: Email has an existing application (will allow, but they may want to check)');
    }
    console.log('✅ Proceeding with OTP');

    // Create and send OTP
    console.log('🚀 Creating and sending OTP...');
    await createAndSendOtp({ email: normalizedEmail, purpose: 'teacher_application' });

    console.log('✅ OTP process completed successfully');
    console.log('========================================\n');

    return NextResponse.json(
      {
        message: 'Verification code sent to your email address. Please check your inbox.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('\n❌ ERROR in teacher application send-otp route:');
    console.error('  - Error message:', error?.message);
    console.error('  - Full error:', error);
    console.error('========================================\n');

    return NextResponse.json(
      {
        error: 'Failed to send verification code. Please try again.',
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
