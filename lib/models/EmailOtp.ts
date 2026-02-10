import mongoose, { Document, Model, Schema } from 'mongoose';

export type OtpPurpose =
  | 'signup'
  | 'event_registration'
  | 'volunteer_application'
  | 'teacher_application'
  | 'teacher_enrollment';

export interface IEmailOtp {
  email: string;
  code: string;
  purpose: OtpPurpose;
  expiresAt: Date;
  consumedAt?: Date | null;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEmailOtpDocument extends IEmailOtp, Document {}

const EmailOtpSchema = new Schema<IEmailOtpDocument>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
      enum: ['signup', 'event_registration', 'volunteer_application', 'teacher_application', 'teacher_enrollment'],
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    consumedAt: {
      type: Date,
      default: null,
      index: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

EmailOtpSchema.index({ email: 1, purpose: 1, createdAt: -1 });

const EmailOtp: Model<IEmailOtpDocument> =
  mongoose.models.EmailOtp || mongoose.model<IEmailOtpDocument>('EmailOtp', EmailOtpSchema);

export default EmailOtp;

