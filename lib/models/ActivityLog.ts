import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IActivityLog {
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failure' | 'warning';
  createdAt: Date;
}

export interface IActivityLogDocument extends IActivityLog, Document {}

const ActivityLogSchema = new Schema<IActivityLogDocument>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    resource: {
      type: String,
      required: true,
      index: true,
    },
    resourceId: {
      type: String,
      index: true,
    },
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    status: {
      type: String,
      enum: ['success', 'failure', 'warning'],
      default: 'success',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
ActivityLogSchema.index({ createdAt: -1 });
ActivityLogSchema.index({ userId: 1, createdAt: -1 });
ActivityLogSchema.index({ action: 1, createdAt: -1 });

const ActivityLog: Model<IActivityLogDocument> =
  mongoose.models.ActivityLog || mongoose.model<IActivityLogDocument>('ActivityLog', ActivityLogSchema);

export default ActivityLog;

// Helper function to log activity
export async function logActivity(data: {
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status?: 'success' | 'failure' | 'warning';
}) {
  try {
    await ActivityLog.create({
      ...data,
      status: data.status || 'success',
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}
