import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import VolunteerOpportunity from '@/lib/models/VolunteerOpportunity';
import VolunteerApplication from '@/lib/models/VolunteerApplication';
import connectDB from '@/lib/mongodb';
import { createAndSendOtp } from '@/lib/otp';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('\n========== VOLUNTEER APPLICATION OTP REQUEST ==========');
  console.log('📥 Received send-otp request for volunteer application');
  
  try {
    const { id: opportunityId } = await params;
    const body = await request.json();
    console.log('📦 Request body:', JSON.stringify(body, null, 2));
    console.log('🤝 Opportunity ID:', opportunityId);
    
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

    await connectDB();
    console.log('✅ Database connected');

    // Check if opportunity exists
    console.log('🔍 Checking if volunteer opportunity exists...');
    const opportunity = await VolunteerOpportunity.findById(opportunityId);

    if (!opportunity || opportunity.status !== 'open') {
      console.log('❌ Volunteer opportunity not found or closed');
      return NextResponse.json(
        { error: 'Volunteer opportunity not found or closed' },
        { status: 404 }
      );
    }
    console.log('✅ Opportunity found:', opportunity.title);

    // Check if already applied
    console.log('🔍 Checking if already applied...');
    const existingApplication = await VolunteerApplication.findOne({
      email: normalizedEmail,
      opportunityId,
    });

    if (existingApplication) {
      console.log('❌ Already applied for this opportunity');
      return NextResponse.json(
        { error: 'You have already applied for this opportunity' },
        { status: 400 }
      );
    }
    console.log('✅ Email not yet applied');

    // Create and send OTP
    console.log('🚀 Creating and sending OTP...');
    await createAndSendOtp({ email: normalizedEmail, purpose: 'volunteer_application' });

    console.log('✅ OTP process completed successfully');
    console.log('========================================\n');

    return NextResponse.json(
      {
        message: 'Verification code sent to your email address. Please check your inbox.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('\n❌ ERROR in volunteer application send-otp route:');
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
