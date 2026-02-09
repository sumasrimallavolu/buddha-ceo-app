import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import { Event, EventFeedback, Registration } from '@/lib/models';

// GET approved feedback for an event (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await connectDB();

    const feedbacks = await EventFeedback.find({
      eventId: id,
      status: 'approved', // Only show approved feedback
    }).sort({ createdAt: -1 });

    // Group by type
    const videos = feedbacks.filter((f) => f.type === 'video');
    const comments = feedbacks.filter((f) => f.type === 'comment');
    const photos = feedbacks.filter((f) => f.type === 'photo');

    return NextResponse.json({
      success: true,
      feedback: {
        videos: videos.map((v) => ({
          id: v._id.toString(),
          videoUrl: v.videoUrl,
          videoCaption: v.videoCaption,
          userName: v.userName,
          createdAt: v.createdAt,
        })),
        comments: comments.map((c) => ({
          id: c._id.toString(),
          comment: c.comment,
          userName: c.userName,
          createdAt: c.createdAt,
        })),
        photos: photos.map((p) => ({
          id: p._id.toString(),
          photoUrl: p.photoUrl,
          photoCaption: p.photoCaption,
          userName: p.userName,
          createdAt: p.createdAt,
        })),
        stats: {
          totalVideos: videos.length,
          totalComments: comments.length,
          totalPhotos: photos.length,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}

// POST submit feedback for an event (requires auth)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be signed in to submit feedback' },
        { status: 401 }
      );
    }

    await connectDB();

    // Check if event exists
    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if user has registered for this event
    const registration = await Registration.findOne({
      eventId: id,
      email: session.user.email,
      status: { $ne: 'cancelled' },
    });

    if (!registration) {
      return NextResponse.json(
        { error: 'You must be registered for this event to submit feedback' },
        { status: 403 }
      );
    }

    // Check if event has ended
    const now = new Date();
    const eventEndDate = new Date(event.endDate);

    if (now < eventEndDate) {
      return NextResponse.json(
        { error: 'You can only submit feedback after the event has ended' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { type, videoUrl, videoCaption, comment, photoUrl, photoCaption } = body;

    // Validate type
    if (!type || !['video', 'comment', 'photo'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid feedback type. Must be video, comment, or photo' },
        { status: 400 }
      );
    }

    // Validate based on type
    if (type === 'video' && !videoUrl?.trim()) {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      );
    }

    if (type === 'comment' && !comment?.trim()) {
      return NextResponse.json(
        { error: 'Comment is required' },
        { status: 400 }
      );
    }

    if (type === 'photo' && !photoUrl?.trim()) {
      return NextResponse.json(
        { error: 'Photo URL is required' },
        { status: 400 }
      );
    }

    // Create feedback
    const feedback = await EventFeedback.create({
      eventId: id,
      userId: session.user.id,
      userName: session.user.name,
      userEmail: session.user.email,
      type,
      status: 'pending', // Requires admin approval
      videoUrl: type === 'video' ? videoUrl.trim() : undefined,
      videoCaption: type === 'video' ? videoCaption?.trim() || undefined : undefined,
      comment: type === 'comment' ? comment.trim() : undefined,
      photoUrl: type === 'photo' ? photoUrl.trim() : undefined,
      photoCaption: type === 'photo' ? photoCaption?.trim() || undefined : undefined,
    });

    return NextResponse.json(
      {
        message: 'Feedback submitted successfully. It will be visible after admin approval.',
        feedback: {
          id: feedback._id.toString(),
          type: feedback.type,
          status: feedback.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
