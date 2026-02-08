import mongoose, { Document, Model, Schema } from 'mongoose';

export type FeedbackType = 'rating' | 'comment' | 'photo';
export type FeedbackStatus = 'pending' | 'approved' | 'rejected';

export interface IEventFeedback {
  eventId: mongoose.Types.ObjectId;
  userId?: string;
  userName: string;
  userEmail: string;
  type: FeedbackType;
  status: FeedbackStatus;

  // For rating feedback
  rating?: number; // 1-5 stars

  // For comment feedback
  comment?: string;

  // For photo feedback
  photoUrl?: string;
  photoCaption?: string;

  // Admin review
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface IEventFeedbackDocument extends IEventFeedback, Document {}

const EventFeedbackSchema = new Schema<IEventFeedbackDocument>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    userId: {
      type: String,
      default: null,
    },
    userName: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
    },
    userEmail: {
      type: String,
      required: [true, 'User email is required'],
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['rating', 'comment', 'photo'],
      required: [true, 'Feedback type is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      required: true,
    },

    // Rating fields
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    // Comment fields
    comment: {
      type: String,
      default: null,
      trim: true,
    },

    // Photo fields
    photoUrl: {
      type: String,
      default: null,
      trim: true,
    },
    photoCaption: {
      type: String,
      default: null,
      trim: true,
    },

    // Admin review fields
    adminNotes: {
      type: String,
      default: null,
      trim: true,
    },
    reviewedBy: {
      type: String,
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
EventFeedbackSchema.index({ eventId: 1, status: 1 });
EventFeedbackSchema.index({ userId: 1, createdAt: -1 });
EventFeedbackSchema.index({ status: 1, createdAt: -1 });
EventFeedbackSchema.index({ type: 1, status: 1 });

const EventFeedback: Model<IEventFeedbackDocument> =
  mongoose.models.EventFeedback ||
  mongoose.model<IEventFeedbackDocument>('EventFeedback', EventFeedbackSchema);

export default EventFeedback;
