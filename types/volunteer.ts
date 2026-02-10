export type QuestionType = 'text' | 'textarea' | 'select' | 'checkbox';

export interface CustomQuestion {
  id: string;
  title: string;
  type: QuestionType;
  options?: string[]; // For select/checkbox types
  required: boolean;
}

export interface VolunteerOpportunity {
  _id: string;
  title: string;
  description: string;
  location: string;
  type: 'Remote' | 'On-site' | 'Hybrid';
  timeCommitment: string;
  requiredSkills: string[];
  startDate: string;
  endDate: string;
  maxVolunteers: number;
  currentApplications: number;
  status: 'open' | 'closed' | 'draft';
  customQuestions: CustomQuestion[];
  createdBy: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface VolunteerApplication {
  _id: string;
  userId?: string; // Optional link to user account
  opportunityId?: string; // ObjectId stored as string
  opportunityTitle?: string;
  opportunity?: {
    _id: string;
    title: string;
    description: string;
    location: string;
    type: 'Remote' | 'On-site' | 'Hybrid';
    timeCommitment: string;
    requiredSkills: string[];
    startDate: string;
    endDate: string;
  };
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
  statusHistory?: {
    status: string;
    changedAt: string;
    changedBy?: string;
    notes?: string;
  }[];
  createdAt: string;
  updatedAt?: string;
}
