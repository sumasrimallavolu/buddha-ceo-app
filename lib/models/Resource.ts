import mongoose, { Document, Model, Schema } from 'mongoose';

export type ResourceType = 'book' | 'video' | 'magazine' | 'link';
export type ResourceStatus = 'draft' | 'published';

export interface IResource {
  title: string;
  type: ResourceType;
  description: string;
  thumbnailUrl?: string;
  downloadUrl?: string; // for books, magazines
  videoUrl?: string; // for YouTube videos
  linkUrl?: string; // for external links
  category: string;
  order: number;
  status?: ResourceStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IResourceDocument extends IResource, Document {}

const ResourceSchema = new Schema<IResourceDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['book', 'video', 'magazine', 'link'],
      required: [true, 'Resource type is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    thumbnailUrl: {
      type: String,
      default: null,
    },
    downloadUrl: {
      type: String,
      default: null,
    },
    videoUrl: {
      type: String,
      default: null,
    },
    linkUrl: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
ResourceSchema.index({ type: 1, category: 1 });
ResourceSchema.index({ order: 1 });
ResourceSchema.index({ createdAt: -1 });

const Resource: Model<IResourceDocument> = mongoose.models.Resource || mongoose.model<IResourceDocument>('Resource', ResourceSchema);

export default Resource;
