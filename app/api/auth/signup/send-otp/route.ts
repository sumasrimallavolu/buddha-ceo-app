import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models';
import { createAndSendOtp } from '@/lib/otp';

export async function POST(request: NextRequest) {
  console.log('\n========== SIGNUP OTP REQUEST ==========');
  console.log('📥 Received send-otp request');
  
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

    // Ensure database connection
    console.log('🔌 Connecting to database...');
    await connectDB();
    console.log('✅ Database connected');

    // Check if user already exists
    console.log('🔍 Checking if user exists...');
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      console.log('❌ User already exists');
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }
    console.log('✅ Email available for registration');

    // Create and send OTP
    console.log('🚀 Creating and sending OTP...');
    await createAndSendOtp({ email: normalizedEmail, purpose: 'signup' });

    console.log('✅ OTP process completed successfully');
    console.log('========================================\n');
    
    return NextResponse.json(
      {
        message: 'Verification code sent to your email address. Please check your inbox (and spam folder).',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('\n❌ ERROR in send-otp route:');
    console.error('  - Error type:', error?.constructor?.name);
    console.error('  - Error message:', error?.message);
    console.error('  - Error stack:', error?.stack);
    console.error('  - Full error object:', JSON.stringify(error, null, 2));
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

