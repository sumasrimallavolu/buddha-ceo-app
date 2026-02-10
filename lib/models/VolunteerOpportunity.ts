import mongoose, { Document, Model, Schema } from 'mongoose';

export type VolunteerType = 'Remote' | 'On-site' | 'Hybrid';
export type VolunteerStatus = 'open' | 'closed' | 'draft';

export interface ICustomQuestion {
  id: string;
  title: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox';
  options?: string[];
  required: boolean;
}

export interface IVolunteerOpportunity {
  title: string;
  description: string;
  location: string;
  type: VolunteerType;
  timeCommitment: string;
  requiredSkills: string[];
  startDate: Date;
  endDate: Date;
  maxVolunteers: number;
  currentApplications: number;
  status: VolunteerStatus;
  customQuestions: ICustomQuestion[];
  createdBy: {
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IVolunteerOpportunityDocument extends IVolunteerOpportunity, Document {}

const CustomQuestionSchema = new Schema<ICustomQuestion>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['text', 'textarea', 'select', 'checkbox'], required: true },
    options: [String], // For select/checkbox
    required: { type: Boolean, default: false }
  },
  { _id: false }
);

const VolunteerOpportunitySchema = new Schema<IVolunteerOpportunityDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    location: {
      type: String,
      required: [true, 'Location is required']
    },
    type: {
      type: String,
      enum: ['Remote', 'On-site', 'Hybrid'],
      required: [true, 'Type is required']
    },
    timeCommitment: {
      type: String,
      required: [true, 'Time commitment is required']
    },
    requiredSkills: {
      type: [String],
      default: []
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    maxVolunteers: {
      type: Number,
      required: [true, 'Maximum volunteers is required']
    },
    currentApplications: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'draft'],
      default: 'draft'
    },
    customQuestions: {
      type: [CustomQuestionSchema],
      default: []
    },
    createdBy: {
      name: { type: String, required: true },
      email: { type: String, required: true }
    }
  },
  {
    timestamps: true
  }
);

// Indexes for faster queries
VolunteerOpportunitySchema.index({ startDate: -1 });
VolunteerOpportunitySchema.index({ status: 1 });
VolunteerOpportunitySchema.index({ type: 1 });

const VolunteerOpportunity: Model<IVolunteerOpportunityDocument> =
  mongoose.models.VolunteerOpportunity ||
  mongoose.model<IVolunteerOpportunityDocument>('VolunteerOpportunity', VolunteerOpportunitySchema);

export default VolunteerOpportunity;
