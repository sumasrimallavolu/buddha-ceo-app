import mongoose, { Document, Model, Schema } from 'mongoose';

export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'free';

export interface IRegistration {
  eventId?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  city?: string;
  profession?: string;
  status: RegistrationStatus;
  paymentStatus?: PaymentStatus;
  createdAt: Date;
}

export interface IRegistrationDocument extends IRegistration, Document {}

const RegistrationSchema = new Schema<IRegistrationDocument>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
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
    city: {
      type: String,
      trim: true,
      default: null,
    },
    profession: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'confirmed',
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'free'],
      default: 'free',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
RegistrationSchema.index({ eventId: 1, createdAt: -1 });
RegistrationSchema.index({ email: 1 });
RegistrationSchema.index({ status: 1 });

const Registration: Model<IRegistrationDocument> = mongoose.models.Registration || mongoose.model<IRegistrationDocument>('Registration', RegistrationSchema);

export default Registration;
