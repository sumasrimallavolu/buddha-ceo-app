import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'content_manager' | 'content_reviewer';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['admin', 'content_manager', 'content_reviewer'],
      default: 'content_manager',
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

const User: Model<IUserDocument> = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);

export default User;
