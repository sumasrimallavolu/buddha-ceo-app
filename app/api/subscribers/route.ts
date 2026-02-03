import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Subscriber } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email } = body;

    // Validate input
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber) {
      if (existingSubscriber.status === 'unsubscribed') {
        // Resubscribe
        existingSubscriber.status = 'active';
        await existingSubscriber.save();
        return NextResponse.json(
          { message: 'Successfully resubscribed!' },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { message: 'Already subscribed' },
        { status: 200 }
      );
    }

    // Create new subscriber
    await Subscriber.create({
      email,
      status: 'active',
    });

    return NextResponse.json(
      { message: 'Successfully subscribed!' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Subscription error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'Already subscribed' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const subscribers = await Subscriber.find({ status: 'active' })
      .sort({ subscribedAt: -1 })
      .limit(100);

    return NextResponse.json(subscribers);
  } catch (error) {
    console.error('Get subscribers error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}
