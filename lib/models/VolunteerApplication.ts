import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVolunteerApplication {
  opportunityId?: mongoose.Types.ObjectId;
  opportunityTitle?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  age: number;
  profession: string;
  interestArea: string;
  experience: string;
  availability: string;
  whyVolunteer: string;
  skills: string;
  customAnswers?: Map<string, string>;
  status: 'pending' | 'approved' | 'rejected' | 'contacted';
  createdAt: Date;
  updatedAt: Date;
}

export interface IVolunteerApplicationDocument extends IVolunteerApplication, Document {}

const VolunteerApplicationSchema = new Schema<IVolunteerApplicationDocument>(
  {
    opportunityId: {
      type: Schema.Types.ObjectId,
      ref: 'VolunteerOpportunity',
      index: true
    },
    opportunityTitle: {
      type: String,
      default: null,
      trim: true
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, sparse: true, trim: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    profession: { type: String, required: true, trim: true },
    interestArea: {
      type: String,
      enum: ['Community Support', 'Content Creation', 'Event Coordination', 'Outreach & Partnerships', 'Other'],
      required: true
    },
    experience: { type: String, required: true, trim: true },
    availability: { type: String, required: true, trim: true },
    whyVolunteer: { type: String, required: true, trim: true },
    skills: { type: String, required: true, trim: true },
    customAnswers: {
      type: Map,
      of: String,
      default: new Map<string, string>()
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'contacted'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

// Indexes for common queries
VolunteerApplicationSchema.index({ opportunityId: 1, createdAt: -1 });
VolunteerApplicationSchema.index({ status: 1 });
VolunteerApplicationSchema.index({ email: 1 });

const VolunteerApplication: Model<IVolunteerApplicationDocument> =
  mongoose.models.VolunteerApplication ||
  mongoose.model<IVolunteerApplicationDocument>('VolunteerApplication', VolunteerApplicationSchema);

export default VolunteerApplication;
