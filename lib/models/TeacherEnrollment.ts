import mongoose, { Document, Model, Schema } from 'mongoose';

export type ApplicationStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'enrolled';

export interface ITeacherEnrollment {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  city: string;
  state: string;
  country: string;
  profession: string;
  education: string;
  meditationExperience: string;
  teachingExperience?: string;
  whyTeach: string;
  availability: string;
  status: ApplicationStatus;
  reviewerNotes?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
}

export interface ITeacherEnrollmentDocument extends ITeacherEnrollment, Document {}

const TeacherEnrollmentSchema = new Schema<ITeacherEnrollmentDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [18, 'Must be at least 18 years old'],
      max: [100, 'Invalid age'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    profession: {
      type: String,
      required: [true, 'Profession is required'],
      trim: true,
    },
    education: {
      type: String,
      required: [true, 'Education is required'],
      trim: true,
    },
    meditationExperience: {
      type: String,
      required: [true, 'Meditation experience is required'],
    },
    teachingExperience: {
      type: String,
      default: null,
    },
    whyTeach: {
      type: String,
      required: [true, 'Motivation is required'],
    },
    availability: {
      type: String,
      required: [true, 'Availability is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'rejected', 'enrolled'],
      default: 'pending',
      required: true,
    },
    reviewerNotes: {
      type: String,
      default: null,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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
TeacherEnrollmentSchema.index({ email: 1, status: 1 });
TeacherEnrollmentSchema.index({ status: 1 });
TeacherEnrollmentSchema.index({ createdAt: -1 });

const TeacherEnrollment: Model<ITeacherEnrollmentDocument> =
  mongoose.models.TeacherEnrollment ||
  mongoose.model<ITeacherEnrollmentDocument>('TeacherEnrollment', TeacherEnrollmentSchema);

export default TeacherEnrollment;
