import mongoose, { Document, Model, Schema } from 'mongoose';

// Vision & Mission
export interface IVisionMission {
  vision: string;
  mission: string;
}

// Founder/Team Member
export interface ITeamMember {
  name: string;
  title: string;
  role: 'founder' | 'co_founder' | 'trustee' | 'mentor' | 'steering_committee';
  description?: string;
  imageUrl: string;
  order?: number;
}

// Core Value
export interface ICoreValue {
  category: 'personal' | 'business' | 'motto';
  title: string;
  description: string;
  icon?: string;
  order: number;
}

// Service (What We Do)
export interface IService {
  title: string;
  description: string;
  imageUrl: string;
  order: number;
}

// Partner Organization
export interface IPartner {
  name: string;
  logoUrl: string;
  website?: string;
  order: number;
}

// Inspiration
export interface IInspiration {
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
}

// Main About Page Content
export interface IAboutPage {
  // Who We Are section
  whoWeAre: {
    title: string;
    description: string;
  };

  // Vision & Mission
  visionMission: IVisionMission;

  // Team members (founders, mentors, etc.)
  teamMembers: ITeamMember[];

  // Core Values
  coreValues: ICoreValue[];

  // Services/What We Do
  services: IService[];

  // Partners
  partners: IPartner[];

  // Inspiration (Patriji)
  inspiration: IInspiration;

  // Global Reach
  globalReach: {
    title: string;
    description: string;
    countries: string[];
    registration: {
      india: string;
      usa: string;
    };
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface IAboutPageDocument extends IAboutPage, Document {}

const TeamMemberSchema = new Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  role: {
    type: String,
    enum: ['founder', 'co_founder', 'trustee', 'mentor', 'steering_committee'],
    required: true,
  },
  description: { type: String },
  imageUrl: { type: String, required: true },
  order: { type: Number, default: 0 },
});

const CoreValueSchema = new Schema({
  category: {
    type: String,
    enum: ['personal', 'business', 'motto'],
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String },
  order: { type: Number, required: true },
});

const ServiceSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  order: { type: Number, required: true },
});

const PartnerSchema = new Schema({
  name: { type: String, required: true },
  logoUrl: { type: String, required: true },
  website: { type: String },
  order: { type: Number, required: true },
});

const InspirationSchema = new Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  order: { type: Number, default: 0 },
});

const VisionMissionSchema = new Schema({
  vision: { type: String, required: true },
  mission: { type: String, required: true },
});

const WhoWeAreSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const GlobalReachSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  countries: { type: [String], required: true },
  registration: {
    india: { type: String, required: true },
    usa: { type: String, required: true },
  },
});

const AboutPageSchema = new Schema<IAboutPageDocument>(
  {
    whoWeAre: {
      type: WhoWeAreSchema,
      required: true,
    },
    visionMission: {
      type: VisionMissionSchema,
      required: true,
    },
    teamMembers: [TeamMemberSchema],
    coreValues: [CoreValueSchema],
    services: [ServiceSchema],
    partners: [PartnerSchema],
    inspiration: {
      type: InspirationSchema,
      required: true,
    },
    globalReach: {
      type: GlobalReachSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Only one document should exist
AboutPageSchema.statics.getAboutContent = async function () {
  let about = await this.findOne();
  if (!about) {
    about = await this.create({});
  }
  return about;
};

const AboutPage: Model<IAboutPageDocument> =
  mongoose.models.AboutPage || mongoose.model<IAboutPageDocument>('AboutPage', AboutPageSchema);

export default AboutPage;
