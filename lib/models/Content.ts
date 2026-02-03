import mongoose, { Document, Model, Schema } from 'mongoose';

export type ContentType = 'poster' | 'testimonial' | 'team_member' | 'achievement' | 'service';
export type ContentStatus = 'draft' | 'pending_review' | 'published' | 'archived';

export interface IContent {
  title: string;
  type: ContentType;
  status: ContentStatus;
  content: Record<string, any>;
  createdBy: mongoose.Types.ObjectId;
  reviewedBy?: mongoose.Types.ObjectId;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface IContentDocument extends IContent, Document {}

const ContentSchema = new Schema<IContentDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['poster', 'testimonial', 'team_member', 'achievement', 'service'],
      required: [true, 'Content type is required'],
    },
    status: {
      type: String,
      enum: ['draft', 'pending_review', 'published', 'archived'],
      default: 'draft',
      required: true,
    },
    content: {
      type: Schema.Types.Mixed,
      required: [true, 'Content is required'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
ContentSchema.index({ type: 1, status: 1 });
ContentSchema.index({ createdBy: 1 });
ContentSchema.index({ status: 1 });
ContentSchema.index({ createdAt: -1 });

const Content: Model<IContentDocument> = mongoose.models.Content || mongoose.model<IContentDocument>('Content', ContentSchema);

export default Content;
