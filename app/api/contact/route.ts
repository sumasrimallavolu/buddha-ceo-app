import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ContactMessage } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create contact message
    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
      status: 'new',
    });

    return NextResponse.json(
      { message: 'Message sent successfully', id: contactMessage._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
