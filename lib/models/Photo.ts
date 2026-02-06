import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPhoto {
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  likes?: number;
  views?: number;
  isActive: boolean;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPhotoDocument extends IPhoto, Document {}

const PhotoSchema = new Schema<IPhotoDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Sessions', 'Nature', 'Community', 'Practice', 'Wellness', 'Morning', 'Events', 'Retreats', 'Other']
    },
    likes: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Index for better query performance
PhotoSchema.index({ isActive: 1, order: 1 });
PhotoSchema.index({ category: 1 });

const Photo: Model<IPhotoDocument> = mongoose.models.Photo || mongoose.model<IPhotoDocument>('Photo', PhotoSchema);

export default Photo;
