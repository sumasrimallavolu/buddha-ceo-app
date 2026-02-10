import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import { User, logActivity } from '@/lib/models';
import { verifyOtp } from '@/lib/otp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, otpCode } = body as {
      name?: string;
      email?: string;
      password?: string;
      otpCode?: string;
    };

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (!otpCode) {
      return NextResponse.json(
        { error: 'Verification code is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Ensure database connection
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Verify OTP before creating account
    const { valid, error: otpError } = await verifyOtp({
      email: normalizedEmail,
      code: otpCode,
      purpose: 'signup',
    });

    if (!valid) {
      return NextResponse.json(
        { error: otpError || 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with 'user' role
    let user;
    try {
      user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: 'user',
      });
    } catch (createError: any) {
      console.error('User creation error:', createError);

      // Handle validation errors
      if (createError.name === 'ValidationError') {
        const validationErrors = Object.values(createError.errors).map((e: any) => e.message);
        return NextResponse.json(
          { error: validationErrors.join(', ') },
          { status: 400 }
        );
      }

      // Handle duplicate key error
      if (createError.code === 11000 || createError.message.includes('E11000')) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 409 }
        );
      }

      throw createError;
    }

    // Log signup activity
    try {
      await logActivity({
        userId: user._id.toString(),
        userName: user.name,
        userEmail: user.email,
        action: 'signup',
        resource: 'user_registration',
        details: { role: 'user' },
        status: 'success',
      });
    } catch (logError) {
      console.error('Failed to log activity:', logError);
    }

    return NextResponse.json(
      {
        message: 'Account created successfully',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating user:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json(
        { error: validationErrors.join(', ') },
        { status: 400 }
      );
    }

    if (error.code === 11000 || error.message.includes('E11000')) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create account. Please try again.',
        details: error.message
      },
      { status: 500 }
    );
  }
}
