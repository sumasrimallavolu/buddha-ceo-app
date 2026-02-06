import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IVisitorLog {
  sessionId: string;
  page: string;
  pageTitle?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  location?: {
    country?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  device?: {
    type?: 'desktop' | 'mobile' | 'tablet';
    os?: string;
    browser?: string;
  };
  duration?: number; // Time spent on page in seconds
  createdAt: Date;
}

export interface IVisitorLogDocument extends IVisitorLog, Document {}

const VisitorLogSchema = new Schema<IVisitorLogDocument>(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    page: {
      type: String,
      required: true,
      index: true,
    },
    pageTitle: {
      type: String,
    },
    referrer: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    location: {
      country: String,
      city: String,
      latitude: Number,
      longitude: Number,
    },
    device: {
      type: {
        type: String,
        enum: ['desktop', 'mobile', 'tablet'],
      },
      os: String,
      browser: String,
    },
    duration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
VisitorLogSchema.index({ createdAt: -1 });
VisitorLogSchema.index({ sessionId: 1, createdAt: -1 });
VisitorLogSchema.index({ page: 1, createdAt: -1 });

const VisitorLog: Model<IVisitorLogDocument> =
  mongoose.models.VisitorLog || mongoose.model<IVisitorLogDocument>('VisitorLog', VisitorLogSchema);

export default VisitorLog;

// Helper function to log visitor
export async function logVisitor(data: {
  sessionId: string;
  page: string;
  pageTitle?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  location?: {
    country?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  device?: {
    type?: 'desktop' | 'mobile' | 'tablet';
    os?: string;
    browser?: string;
  };
}) {
  try {
    await VisitorLog.create({
      ...data,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Failed to log visitor:', error);
  }
}
