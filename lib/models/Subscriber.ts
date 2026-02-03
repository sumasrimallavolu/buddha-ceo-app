import mongoose, { Document, Model, Schema } from 'mongoose';

export type SubscriberStatus = 'active' | 'unsubscribed';

export interface ISubscriber {
  email: string;
  status: SubscriberStatus;
  subscribedAt: Date;
}

export interface ISubscriberDocument extends ISubscriber, Document {}

const SubscriberSchema = new Schema<ISubscriberDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'unsubscribed'],
      default: 'active',
      required: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
SubscriberSchema.index({ email: 1 });
SubscriberSchema.index({ status: 1 });

const Subscriber: Model<ISubscriberDocument> = mongoose.models.Subscriber || mongoose.model<ISubscriberDocument>('Subscriber', SubscriberSchema);

export default Subscriber;
