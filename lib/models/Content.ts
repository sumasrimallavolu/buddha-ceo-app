import mongoose, { Document, Model, Schema } from 'mongoose';

export type ContentType = 'photos' | 'mentors' | 'founders' | 'steering_committee';
export type ContentStatus = 'draft' | 'pending_review' | 'published' | 'archived';
export type ContentLayout = 'grid' | 'masonry' | 'slider';

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
  thumbnailUrl?: string;
  order?: number;
  layout?: ContentLayout;
  mediaOrder?: string[];
  isFeatured?: boolean;
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
      enum: ['photos', 'mentors', 'founders', 'steering_committee'],
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
    thumbnailUrl: {
      type: String,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
    layout: {
      type: String,
      enum: ['grid', 'masonry', 'slider'],
      default: 'grid',
    },
    mediaOrder: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
ContentSchema.index({ type: 1, status: 1, order: 1 });
ContentSchema.index({ createdBy: 1 });
ContentSchema.index({ status: 1, isFeatured: 1 });
ContentSchema.index({ createdAt: -1 });
ContentSchema.index({ 'content.category': 1 });

const Content: Model<IContentDocument> = mongoose.models.Content || mongoose.model<IContentDocument>('Content', ContentSchema);

export default Content;
