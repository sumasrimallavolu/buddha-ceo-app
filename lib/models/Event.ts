import mongoose, { Document, Model, Schema } from 'mongoose';

export type EventType = 'beginner_online' | 'beginner_physical' | 'advanced_online' | 'advanced_physical' | 'conference';
export type EventStatus = 'draft' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'published';

export interface IEvent {
  title: string;
  description?: string;
  type: EventType;
  startDate: Date;
  endDate: Date;
  timings?: string;
  imageUrl?: string;
  registrationLink?: string;
  maxParticipants?: number;
  currentRegistrations: number;
  status: EventStatus;
  location?: {
    online?: boolean;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    venue?: string;
    latitude?: number;
    longitude?: number;
  };
  // Enhanced fields
  benefits?: string[]; // List of benefits
  teacherId?: string; // Reference to teacher/organizer
  teacherName?: string; // Display name for teacher
  galleryImages?: string[]; // Multiple event photos
  requirements?: string[]; // Prerequisites or requirements
  whatToBring?: string[]; // Items participants should bring
  targetAudience?: string; // Who should attend
  curriculum?: string; // Course outline/curriculum
  price?: number; // Event price (0 for free)
  currency?: string; // Currency code (default: INR)
  dateSlots?: {
    date: string;
    startTime: string;
    endTime: string;
    title?: string;
  }[]; // Multiple date/time slots for sessions
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
      default: '',
      trim: true,
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
      default: '',
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
      trim: true,
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
      enum: ['draft', 'upcoming', 'ongoing', 'completed', 'cancelled', 'published'],
      default: 'draft',
      required: true,
    },
    location: {
      online: { type: Boolean, default: true },
      address: { type: String, default: null },
      city: { type: String, default: null },
      state: { type: String, default: null },
      country: { type: String, default: null },
      venue: { type: String, default: null },
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
    },
    // Enhanced event fields
    benefits: {
      type: [String],
      default: [],
    },
    teacherId: {
      type: String,
      default: null,
    },
    teacherName: {
      type: String,
      default: null,
    },
    galleryImages: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    whatToBring: {
      type: [String],
      default: [],
    },
    targetAudience: {
      type: String,
      default: null,
    },
    curriculum: {
      type: String,
      default: null,
    },
    price: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    dateSlots: [{
      date: {
        type: String,
        default: '',
      },
      startTime: {
        type: String,
        default: '',
      },
      endTime: {
        type: String,
        default: '',
      },
      title: {
        type: String,
        default: '',
      },
    }],
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
