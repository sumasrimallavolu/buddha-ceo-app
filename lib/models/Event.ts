import mongoose, { Document, Model, Schema } from 'mongoose';

export type EventType = 'beginner_online' | 'beginner_physical' | 'advanced_online' | 'advanced_physical' | 'conference';
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface IEvent {
  title: string;
  description: string;
  type: EventType;
  startDate: Date;
  endDate: Date;
  timings: string;
  imageUrl: string;
  registrationLink?: string;
  maxParticipants?: number;
  currentRegistrations: number;
  status: EventStatus;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    venue?: string;
    latitude?: number;
    longitude?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IEventDocument extends IEvent, Document {}

const EventSchema = new Schema<IEventDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    type: {
      type: String,
      enum: ['beginner_online', 'beginner_physical', 'advanced_online', 'advanced_physical', 'conference'],
      required: [true, 'Event type is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    timings: {
      type: String,
      required: [true, 'Timings are required'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Image is required'],
    },
    registrationLink: {
      type: String,
      default: null,
    },
    maxParticipants: {
      type: Number,
      default: null,
    },
    currentRegistrations: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
      required: true,
    },
    location: {
      address: { type: String, default: null },
      city: { type: String, default: null },
      state: { type: String, default: null },
      country: { type: String, default: null },
      venue: { type: String, default: null },
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
EventSchema.index({ startDate: -1 });
EventSchema.index({ status: 1 });
EventSchema.index({ type: 1 });
EventSchema.index({ 'location.city': 1 });
EventSchema.index({ 'location.country': 1 });
// Geospatial index for nearby events queries
EventSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });

const Event: Model<IEventDocument> = mongoose.models.Event || mongoose.model<IEventDocument>('Event', EventSchema);

export default Event;
