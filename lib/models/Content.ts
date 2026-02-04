import mongoose, { Document, Model, Schema } from 'mongoose';

export type ContentType =
  | 'poster'
  | 'testimonial'
  | 'team_member'
  | 'achievement'
  | 'service'
  | 'photo_collage'      // Multiple photos in grid layouts
  | 'video_content'      // YouTube/embedded videos
  | 'book_publication'   // Books/publications
  | 'mixed_media';       // Text + images + videos

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
  thumbnailUrl?: string;        // For gallery previews
  layout?: ContentLayout;       // For photo collages
  mediaOrder?: string[];        // Order of media items
  isFeatured?: boolean;         // Highlight on homepage
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
      enum: ['poster', 'testimonial', 'team_member', 'achievement', 'service', 'photo_collage', 'video_content', 'book_publication', 'mixed_media'],
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
ContentSchema.index({ type: 1, status: 1 });
ContentSchema.index({ createdBy: 1 });
ContentSchema.index({ status: 1 });
ContentSchema.index({ createdAt: -1 });

const Content: Model<IContentDocument> = mongoose.models.Content || mongoose.model<IContentDocument>('Content', ContentSchema);

export default Content;
