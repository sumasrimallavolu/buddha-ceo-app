import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITeacherApplication {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  profession: string;
  meditationExperience: string;
  teachingExperience?: string;
  whyTeach: string;
  availability: string;
  age: number;
  education: string;
  status: 'pending' | 'approved' | 'rejected' | 'contacted';
  createdAt: Date;
  updatedAt: Date;
}

export interface ITeacherApplicationDocument extends ITeacherApplication, Document {}

const TeacherApplicationSchema = new Schema<ITeacherApplicationDocument>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, sparse: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    profession: { type: String, required: true },
    meditationExperience: { type: String, required: true },
    teachingExperience: { type: String },
    whyTeach: { type: String, required: true },
    availability: { type: String, required: true },
    age: { type: Number, required: true },
    education: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'contacted'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

const TeacherApplication: Model<ITeacherApplicationDocument> =
  mongoose.models.TeacherApplication ||
  mongoose.model<ITeacherApplicationDocument>('TeacherApplication', TeacherApplicationSchema);

export default TeacherApplication;
