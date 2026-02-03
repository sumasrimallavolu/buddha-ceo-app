import mongoose, { Document, Model, Schema } from 'mongoose';

export type MessageStatus = 'new' | 'read' | 'responded';

export interface IContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: Date;
}

export interface IContactMessageDocument extends IContactMessage, Document {}

const ContactMessageSchema = new Schema<IContactMessageDocument>(
  {
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
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    status: {
      type: String,
      enum: ['new', 'read', 'responded'],
      default: 'new',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
ContactMessageSchema.index({ status: 1, createdAt: -1 });
ContactMessageSchema.index({ email: 1 });

const ContactMessage: Model<IContactMessageDocument> = mongoose.models.ContactMessage || mongoose.model<IContactMessageDocument>('ContactMessage', ContactMessageSchema);

export default ContactMessage;
