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
      ref: 'VolunteerOpportunity'
    },
    opportunityTitle: {
      type: String,
      default: null
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, sparse: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    age: { type: Number, required: true },
    profession: { type: String, required: true },
    interestArea: {
      type: String,
      enum: ['Community Support', 'Content Creation', 'Event Coordination', 'Outreach & Partnerships', 'Other'],
      required: true
    },
    experience: { type: String, required: true },
    availability: { type: String, required: true },
    whyVolunteer: { type: String, required: true },
    skills: { type: String, required: true },
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

const VolunteerApplication: Model<IVolunteerApplicationDocument> =
  mongoose.models.VolunteerApplication ||
  mongoose.model<IVolunteerApplicationDocument>('VolunteerApplication', VolunteerApplicationSchema);

export default VolunteerApplication;
