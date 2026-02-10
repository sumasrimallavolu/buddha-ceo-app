# Volunteer Opportunities System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a complete volunteer opportunities management system with dynamic application forms similar to the events system

**Architecture:**
- New MongoDB collection for volunteer opportunities with custom question builder
- Separate admin pages for opportunities and application management
- Public volunteer opportunities listing and detail pages
- Dynamic forms that render custom questions per opportunity
- Update existing volunteer section on home page to be simpler

**Tech Stack:**
- Next.js 14 App Router
- MongoDB with Mongoose
- TypeScript
- Tailwind CSS + shadcn/ui components
- NextAuth.js for role-based access control

---

## Task 1: Create MongoDB Schema and Model

**Files:**
- Create: `models/VolunteerOpportunity.ts`
- Create: `types/volunteer.ts`

**Step 1: Create type definitions**

Create `types/volunteer.ts`:

```typescript
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
  opportunityId: string;
  opportunityTitle: string;
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
  customAnswers?: Record<string, string>; // { questionId: answer }
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}
```

**Step 2: Create Mongoose model**

Create `models/VolunteerOpportunity.ts`:

```typescript
import mongoose, { Schema, Model } from 'mongoose';

const CustomQuestionSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['text', 'textarea', 'select', 'checkbox'], required: true },
  options: [String], // For select/checkbox
  required: { type: Boolean, default: false }
}, { _id: false });

const VolunteerOpportunitySchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ['Remote', 'On-site', 'Hybrid'], required: true },
  timeCommitment: { type: String, required: true },
  requiredSkills: [{ type: String }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  maxVolunteers: { type: Number, required: true },
  currentApplications: { type: Number, default: 0 },
  status: { type: String, enum: ['open', 'closed', 'draft'], default: 'draft' },
  customQuestions: [CustomQuestionSchema],
  createdBy: {
    name: { type: String, required: true },
    email: { type: String, required: true }
  }
}, {
  timestamps: true
});

// Prevent model recompilation in development
const VolunteerOpportunity: Model<any> = mongoose.models.VolunteerOpportunity ||
  mongoose.model('VolunteerOpportunity', VolunteerOpportunitySchema);

export default VolunteerOpportunity;
```

**Step 3: Update existing VolunteerApplication model to support custom answers**

Modify existing model (likely in `models/VolunteerApplication.ts` or similar):

Add field:
```typescript
customAnswers: { type: Map, of: String }, // { questionId: answer }
opportunityId: { type: Schema.Types.ObjectId, ref: 'VolunteerOpportunity' },
```

**Step 4: Commit**

```bash
git add models/ types/
git commit -m "feat: add volunteer opportunity schema and types"
```

---

## Task 2: Create Admin API Routes for Opportunities

**Files:**
- Create: `app/api/admin/volunteer-opportunities/route.ts`
- Create: `app/api/admin/volunteer-opportunities/[id]/route.ts`

**Step 1: Create main opportunities route**

Create `app/api/admin/volunteer-opportunities/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import VolunteerOpportunity from '@/models/VolunteerOpportunity';
import dbConnect from '@/lib/db/mongodb';

// GET - List all opportunities
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const filter: any = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    const opportunities = await VolunteerOpportunity
      .find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(opportunities);
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunities' },
      { status: 500 }
    );
  }
}

// POST - Create new opportunity
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || !['admin', 'content_manager'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const data = await req.json();

    const opportunity = await VolunteerOpportunity.create({
      ...data,
      createdBy: {
        name: session.user.name,
        email: session.user.email
      }
    });

    return NextResponse.json(opportunity, { status: 201 });
  } catch (error) {
    console.error('Error creating opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to create opportunity' },
      { status: 500 }
    );
  }
}
```

**Step 2: Create individual opportunity route**

Create `app/api/admin/volunteer-opportunities/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import VolunteerOpportunity from '@/models/VolunteerOpportunity';
import dbConnect from '@/lib/db/mongodb';

// GET - Single opportunity
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const opportunity = await VolunteerOpportunity.findById(params.id);

    if (!opportunity) {
      return NextResponse.json(
        { error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(opportunity);
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunity' },
      { status: 500 }
    );
  }
}

// PATCH - Update opportunity
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session || !['admin', 'content_manager'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const data = await req.json();

    const opportunity = await VolunteerOpportunity.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true }
    );

    if (!opportunity) {
      return NextResponse.json(
        { error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(opportunity);
  } catch (error) {
    console.error('Error updating opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to update opportunity' },
      { status: 500 }
    );
  }
}

// DELETE - Delete opportunity
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const opportunity = await VolunteerOpportunity.findByIdAndDelete(params.id);

    if (!opportunity) {
      return NextResponse.json(
        { error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to delete opportunity' },
      { status: 500 }
    );
  }
}
```

**Step 3: Test the API routes**

Run:
```bash
curl http://localhost:3000/api/admin/volunteer-opportunities
```

Expected: Empty array `[]`

**Step 4: Commit**

```bash
git add app/api/admin/volunteer-opportunities/
git commit -m "feat: add admin API routes for volunteer opportunities"
```

---

## Task 3: Create Public API Routes for Opportunities

**Files:**
- Create: `app/api/volunteer-opportunities/route.ts`
- Create: `app/api/volunteer-opportunities/[id]/route.ts`
- Create: `app/api/volunteer-opportunities/[id]/apply/route.ts`

**Step 1: Create public opportunities list route**

Create `app/api/volunteer-opportunities/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import VolunteerOpportunity from '@/models/VolunteerOpportunity';
import dbConnect from '@/lib/db/mongodb';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const location = searchParams.get('location');

    const filter: any = { status: 'open' };
    if (type) filter.type = type;
    if (location) filter.location = new RegExp(location, 'i');

    const opportunities = await VolunteerOpportunity
      .find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(opportunities);
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunities' },
      { status: 500 }
    );
  }
}
```

**Step 2: Create single opportunity route**

Create `app/api/volunteer-opportunities/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import VolunteerOpportunity from '@/models/VolunteerOpportunity';
import dbConnect from '@/lib/db/mongodb';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const opportunity = await VolunteerOpportunity.findById(params.id);

    if (!opportunity || opportunity.status !== 'open') {
      return NextResponse.json(
        { error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(opportunity);
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunity' },
      { status: 500 }
    );
  }
}
```

**Step 3: Create application submission route**

Create `app/api/volunteer-opportunities/[id]/apply/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import VolunteerOpportunity from '@/models/VolunteerOpportunity';
import VolunteerApplication from '@/models/VolunteerApplication';
import dbConnect from '@/lib/db/mongodb';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const opportunity = await VolunteerOpportunity.findById(params.id);

    if (!opportunity || opportunity.status !== 'open') {
      return NextResponse.json(
        { error: 'Opportunity not found or closed' },
        { status: 404 }
      );
    }

    if (opportunity.maxVolunteers > 0 &&
        opportunity.currentApplications >= opportunity.maxVolunteers) {
      return NextResponse.json(
        { error: 'This opportunity is full' },
        { status: 400 }
      );
    }

    const data = await req.json();

    // Check if already applied
    const existing = await VolunteerApplication.findOne({
      email: data.email,
      opportunityId: params.id
    });

    if (existing) {
      return NextResponse.json(
        { error: 'You have already applied for this opportunity' },
        { status: 400 }
      );
    }

    const application = await VolunteerApplication.create({
      ...data,
      opportunityId: params.id,
      opportunityTitle: opportunity.title,
      status: 'pending'
    });

    // Increment application count
    await VolunteerOpportunity.findByIdAndUpdate(params.id, {
      $inc: { currentApplications: 1 }
    });

    return NextResponse.json(
      { success: true, applicationId: application._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}
```

**Step 4: Commit**

```bash
git add app/api/volunteer-opportunities/
git commit -m "feat: add public API routes for volunteer opportunities"
```

---

## Task 4: Create Admin API Routes for Applications

**Files:**
- Create: `app/api/admin/volunteer-applications/route.ts`
- Create: `app/api/admin/volunteer-applications/[id]/route.ts`

**Step 1: Create applications list route**

Create `app/api/admin/volunteer-applications/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import VolunteerApplication from '@/models/VolunteerApplication';
import dbConnect from '@/lib/db/mongodb';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const opportunityId = searchParams.get('opportunityId');
    const status = searchParams.get('status');

    const filter: any = {};
    if (opportunityId) filter.opportunityId = opportunityId;
    if (status && status !== 'all') filter.status = status;

    const applications = await VolunteerApplication
      .find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
```

**Step 2: Create application detail/update/delete route**

Create `app/api/admin/volunteer-applications/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import VolunteerApplication from '@/models/VolunteerApplication';
import dbConnect from '@/lib/db/mongodb';

// GET - Single application
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const application = await VolunteerApplication.findById(params.id);

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    );
  }
}

// PATCH - Update application status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session || !['admin', 'content_manager', 'content_reviewer'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { status } = await req.json();

    const application = await VolunteerApplication.findByIdAndUpdate(
      params.id,
      { $set: { status } },
      { new: true }
    );

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}

// DELETE - Delete application
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const application = await VolunteerApplication.findByIdAndDelete(params.id);

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    );
  }
}
```

**Step 5: Commit**

```bash
git add app/api/admin/volunteer-applications/
git commit -m "feat: add admin API routes for volunteer applications"
```

---

## Task 5: Create Admin Components - Custom Question Builder

**Files:**
- Create: `components/admin/volunteer-opportunities/CustomQuestionBuilder.tsx`

**Step 1: Create custom question builder component**

Create `components/admin/volunteer-opportunities/CustomQuestionBuilder.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { CustomQuestion } from '@/types/volunteer';

interface CustomQuestionBuilderProps {
  questions: CustomQuestion[];
  onChange: (questions: CustomQuestion[]) => void;
}

export function CustomQuestionBuilder({
  questions,
  onChange
}: CustomQuestionBuilderProps) {
  const [newQuestion, setNewQuestion] = useState<Partial<CustomQuestion>>({
    title: '',
    type: 'text',
    required: false,
    options: []
  });

  const addQuestion = () => {
    if (!newQuestion.title?.trim()) return;

    const question: CustomQuestion = {
      id: `q_${Date.now()}`,
      title: newQuestion.title,
      type: newQuestion.type || 'text',
      required: newQuestion.required || false,
      options: newQuestion.options
    };

    onChange([...questions, question]);
    setNewQuestion({ title: '', type: 'text', required: false, options: [] });
  };

  const removeQuestion = (id: string) => {
    onChange(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, field: keyof CustomQuestion, value: any) => {
    onChange(questions.map(q =>
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const addOption = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    const options = question.options || [];
    updateQuestion(questionId, 'options', [...options, `Option ${options.length + 1}`]);
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    const options = [...(question.options || [])];
    options[optionIndex] = value;
    updateQuestion(questionId, 'options', options);
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    const options = (question.options || []).filter((_, i) => i !== optionIndex);
    updateQuestion(questionId, 'options', options);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3"
          >
            <div className="flex items-start gap-3">
              <GripVertical className="w-5 h-5 text-slate-500 mt-1" />
              <div className="flex-1 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <Label>Question {index + 1}</Label>
                    <Input
                      value={question.title}
                      onChange={(e) => updateQuestion(question.id, 'title', e.target.value)}
                      placeholder="Enter question"
                      className="mt-1"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQuestion(question.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <Label>Type</Label>
                    <Select
                      value={question.type}
                      onValueChange={(value) => updateQuestion(question.id, 'type', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text Input</SelectItem>
                        <SelectItem value="textarea">Text Area</SelectItem>
                        <SelectItem value="select">Dropdown</SelectItem>
                        <SelectItem value="checkbox">Checkboxes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2 mt-6">
                    <input
                      type="checkbox"
                      id={`required-${question.id}`}
                      checked={question.required}
                      onChange={(e) => updateQuestion(question.id, 'required', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor={`required-${question.id}`} className="text-slate-300">
                      Required
                    </Label>
                  </div>
                </div>

                {(question.type === 'select' || question.type === 'checkbox') && (
                  <div className="space-y-2">
                    <Label>Options</Label>
                    {(question.options || []).map((option, optIndex) => (
                      <div key={optIndex} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                          placeholder={`Option ${optIndex + 1}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOption(question.id, optIndex)}
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addOption(question.id)}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
        <h4 className="font-semibold text-white">Add New Question</h4>
        <div className="space-y-3">
          <div>
            <Label>Question</Label>
            <Input
              value={newQuestion.title}
              onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
              placeholder="Enter question"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <Label>Type</Label>
              <Select
                value={newQuestion.type}
                onValueChange={(value) => setNewQuestion({ ...newQuestion, type: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Input</SelectItem>
                  <SelectItem value="textarea">Text Area</SelectItem>
                  <SelectItem value="select">Dropdown</SelectItem>
                  <SelectItem value="checkbox">Checkboxes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                id="new-required"
                checked={newQuestion.required}
                onChange={(e) => setNewQuestion({ ...newQuestion, required: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="new-required" className="text-slate-300">
                Required
              </Label>
            </div>
          </div>

          <Button
            type="button"
            onClick={addQuestion}
            disabled={!newQuestion.title?.trim()}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/admin/volunteer-opportunities/
git commit -m "feat: add custom question builder component"
```

---

## Task 6: Create Admin Opportunity Form Component

**Files:**
- Create: `components/admin/volunteer-opportunities/OpportunityForm.tsx`

**Step 1: Create opportunity form component**

Create `components/admin/volunteer-opportunities/OpportunityForm.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, X } from 'lucide-react';
import { CustomQuestionBuilder } from './CustomQuestionBuilder';
import { VolunteerOpportunity, CustomQuestion } from '@/types/volunteer';

interface OpportunityFormProps {
  initialData?: Partial<VolunteerOpportunity>;
  onSubmit: (data: any) => Promise<void>;
  submitLabel?: string;
}

export function OpportunityForm({
  initialData,
  onSubmit,
  submitLabel = 'Create Opportunity'
}: OpportunityFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>(initialData?.requiredSkills || []);
  const [skillInput, setSkillInput] = useState('');
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>(
    initialData?.customQuestions || []
  );

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    location: initialData?.location || '',
    type: initialData?.type || 'Remote',
    timeCommitment: initialData?.timeCommitment || '',
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
    maxVolunteers: initialData?.maxVolunteers || 0,
    status: initialData?.status || 'draft'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        ...formData,
        requiredSkills: skills,
        customQuestions
      });
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Basic Information</h3>

        <div>
          <Label htmlFor="title">Opportunity Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Community Support Volunteer"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the volunteer role and responsibilities..."
            required
            rows={4}
            className="mt-1"
          />
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Details</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Bangalore, India"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="type">Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as any })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="On-site">On-site</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="timeCommitment">Time Commitment *</Label>
            <Input
              id="timeCommitment"
              value={formData.timeCommitment}
              onChange={(e) => setFormData({ ...formData, timeCommitment: e.target.value })}
              placeholder="e.g., 5-10 hours/week"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="maxVolunteers">Max Volunteers (0 for unlimited)</Label>
            <Input
              id="maxVolunteers"
              type="number"
              value={formData.maxVolunteers}
              onChange={(e) => setFormData({ ...formData, maxVolunteers: parseInt(e.target.value) || 0 })}
              min="0"
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Start Date *</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="endDate">End Date *</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="status">Status *</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Required Skills</h3>

        <div className="flex gap-2">
          <Input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            placeholder="Add a skill"
            className="flex-1"
          />
          <Button type="button" onClick={addSkill} variant="outline">
            Add
          </Button>
        </div>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="hover:text-blue-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Custom Questions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Application Questions</h3>
        <CustomQuestionBuilder
          questions={customQuestions}
          onChange={setCustomQuestions}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-white/10">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}
```

**Step 2: Commit**

```bash
git add components/admin/volunteer-opportunities/
git commit -m "feat: add opportunity form component"
```

---

## Task 7: Create Admin Opportunities Page

**Files:**
- Create: `app/admin/volunteer-opportunities/page.tsx`

**Step 1: Create opportunities list page**

Create `app/admin/volunteer-opportunities/page.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MoreVertical, Edit, Trash, Plus, Users, Calendar, Loader2, Globe, MapPin } from 'lucide-react';
import { VolunteerOpportunity } from '@/types/volunteer';

export default function VolunteerOpportunitiesPage() {
  const { data: session } = useSession();
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const canEdit = session?.user?.role === 'content_manager' || session?.user?.role === 'admin';

  useEffect(() => {
    fetchOpportunities();
  }, [statusFilter]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const response = await fetch(`/api/admin/volunteer-opportunities${params}`);
      if (response.ok) {
        const data = await response.json();
        setOpportunities(data);
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;

    try {
      const response = await fetch(`/api/admin/volunteer-opportunities/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setOpportunities(opportunities.filter(o => o._id !== id));
      }
    } catch (error) {
      console.error('Error deleting opportunity:', error);
    }
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      'Remote': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'On-site': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'Hybrid': 'bg-violet-500/20 text-violet-400 border-violet-500/30'
    };
    return badges[type as keyof typeof badges] || 'bg-slate-500/20 text-slate-400';
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      'open': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'closed': 'bg-red-500/20 text-red-400 border-red-500/30',
      'draft': 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    };
    return badges[status as keyof typeof badges] || '';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Volunteer Opportunities</h1>
          <p className="text-slate-400">Manage volunteer opportunities and roles</p>
        </div>
        {canEdit && (
          <Link href="/admin/volunteer-opportunities/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Opportunity
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 max-w-xs">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-slate-400">Title</TableHead>
                <TableHead className="text-slate-400">Type</TableHead>
                <TableHead className="text-slate-400">Location</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400">Applications</TableHead>
                <TableHead className="text-slate-400">Dates</TableHead>
                <TableHead className="text-slate-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
                  </TableCell>
                </TableRow>
              ) : opportunities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-400 py-8">
                    No opportunities found
                  </TableCell>
                </TableRow>
              ) : (
                opportunities.map((opportunity) => (
                  <TableRow key={opportunity._id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="text-white font-medium">{opportunity.title}</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeBadge(opportunity.type)}`}>
                        {opportunity.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-300">{opportunity.location}</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(opportunity.status)}`}>
                        {opportunity.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Users className="h-4 w-4" />
                        {opportunity.currentApplications || 0}
                        {opportunity.maxVolunteers > 0 && ` / ${opportunity.maxVolunteers}`}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300 text-sm">
                      {new Date(opportunity.startDate).toLocaleDateString()} - {new Date(opportunity.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-slate-400">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
                          {canEdit && (
                            <DropdownMenuItem asChild className="text-slate-300 hover:bg-white/10">
                              <Link href={`/admin/volunteer-opportunities/${opportunity._id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDelete(opportunity._id)}
                            className="text-red-400 hover:bg-red-500/10"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add app/admin/volunteer-opportunities/
git commit -m "feat: add admin opportunities list page"
```

---

## Task 8: Create Admin New/Edit Opportunity Pages

**Files:**
- Create: `app/admin/volunteer-opportunities/new/page.tsx`
- Create: `app/admin/volunteer-opportunities/[id]/edit/page.tsx`

**Step 1: Create new opportunity page**

Create `app/admin/volunteer-opportunities/new/page.tsx`:

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { OpportunityForm } from '@/components/admin/volunteer-opportunities/OpportunityForm';
import { Loader2 } from 'lucide-react';

export default function NewOpportunityPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    const response = await fetch('/api/admin/volunteer-opportunities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      router.push('/admin/volunteer-opportunities');
    } else {
      alert('Failed to create opportunity');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create Volunteer Opportunity</h1>
        <p className="text-slate-400">Add a new volunteer opportunity to the platform</p>
      </div>

      <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
        <OpportunityForm onSubmit={handleSubmit} submitLabel="Create Opportunity" />
      </div>
    </div>
  );
}
```

**Step 2: Create edit opportunity page**

Create `app/admin/volunteer-opportunities/[id]/edit/page.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { OpportunityForm } from '@/components/admin/volunteer-opportunities/OpportunityForm';
import { Loader2 } from 'lucide-react';
import { VolunteerOpportunity } from '@/types/volunteer';

export default function EditOpportunityPage() {
  const router = useRouter();
  const params = useParams();
  const [opportunity, setOpportunity] = useState<VolunteerOpportunity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpportunity();
  }, [params.id]);

  const fetchOpportunity = async () => {
    try {
      const response = await fetch(`/api/admin/volunteer-opportunities/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setOpportunity(data);
      }
    } catch (error) {
      console.error('Error fetching opportunity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    const response = await fetch(`/api/admin/volunteer-opportunities/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      router.push('/admin/volunteer-opportunities');
    } else {
      alert('Failed to update opportunity');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400">Opportunity not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Edit Volunteer Opportunity</h1>
        <p className="text-slate-400">Update volunteer opportunity details</p>
      </div>

      <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
        <OpportunityForm
          initialData={opportunity}
          onSubmit={handleSubmit}
          submitLabel="Update Opportunity"
        />
      </div>
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add app/admin/volunteer-opportunities/
git commit -m "feat: add create/edit opportunity pages"
```

---

## Task 9: Create Admin Applications Page

**Files:**
- Create: `app/admin/volunteer-applications/page.tsx`

**Step 1: Create applications list page**

Create `app/admin/volunteer-applications/page.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, CheckCircle, XCircle, Clock, Loader2, Mail } from 'lucide-react';
import { VolunteerApplication } from '@/types/volunteer';

export default function VolunteerApplicationsPage() {
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState([]);
  const [opportunityFilter, setOpportunityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
    fetchOpportunities();
  }, [opportunityFilter, statusFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (opportunityFilter !== 'all') params.append('opportunityId', opportunityFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(`/api/admin/volunteer-applications?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOpportunities = async () => {
    try {
      const response = await fetch('/api/admin/volunteer-opportunities');
      if (response.ok) {
        const data = await response.json();
        setOpportunities(data);
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/volunteer-applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setApplications(applications.map(app =>
          app._id === id ? { ...app, status } : app
        ));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'approved':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Volunteer Applications</h1>
        <p className="text-slate-400">Review and manage volunteer applications</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 max-w-xs">
          <Select value={opportunityFilter} onValueChange={setOpportunityFilter}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="All Opportunities" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              <SelectItem value="all">All Opportunities</SelectItem>
              {opportunities.map((opp: any) => (
                <SelectItem key={opp._id} value={opp._id}>
                  {opp.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 max-w-xs">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-slate-400">Name</TableHead>
                <TableHead className="text-slate-400">Opportunity</TableHead>
                <TableHead className="text-slate-400">Email</TableHead>
                <TableHead className="text-slate-400">Phone</TableHead>
                <TableHead className="text-slate-400">Applied</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
                  </TableCell>
                </TableRow>
              ) : applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-400 py-8">
                    No applications found
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((application) => (
                  <TableRow key={application._id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="text-white font-medium">
                      {application.firstName} {application.lastName}
                    </TableCell>
                    <TableCell className="text-slate-300">{application.opportunityTitle}</TableCell>
                    <TableCell className="text-slate-300">{application.email}</TableCell>
                    <TableCell className="text-slate-300">{application.phone}</TableCell>
                    <TableCell className="text-slate-300 text-sm">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(application.status)}`}>
                        {application.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-slate-400">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(application._id, 'approved')}
                            className="text-emerald-400 hover:bg-emerald-500/10"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(application._id, 'rejected')}
                            className="text-red-400 hover:bg-red-500/10"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add app/admin/volunteer-applications/
git commit -m "feat: add volunteer applications management page"
```

---

## Task 10: Update Admin Navigation

**Files:**
- Modify: `app/admin/layout.tsx`

**Step 1: Add navigation links**

Modify `app/admin/layout.tsx`:

Add to the navigation array:
```typescript
{ name: 'Volunteer Opps', href: '/admin/volunteer-opportunities', icon: Users, roles: ['admin', 'content_manager'] },
```

After the Events line.

**Step 2: Commit**

```bash
git add app/admin/layout.tsx
git commit -m "feat: add volunteer opportunities to admin navigation"
```

---

## Task 11: Create Public Volunteer Opportunities Page

**Files:**
- Create: `components/volunteer/OpportunityCard.tsx`
- Create: `app/volunteer-opportunities/page.tsx`

**Step 1: Create opportunity card component**

Create `components/volunteer/OpportunityCard.tsx`:

```typescript
'use client';

import Link from 'next/link';
import { MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import { VolunteerOpportunity } from '@/types/volunteer';

interface OpportunityCardProps {
  opportunity: VolunteerOpportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const getTypeBadge = (type: string) => {
    const badges = {
      'Remote': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'On-site': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'Hybrid': 'bg-violet-500/20 text-violet-400 border-violet-500/30'
    };
    return badges[type as keyof typeof badges] || 'bg-slate-500/20 text-slate-400';
  };

  return (
    <Link
      href={`/volunteer-opportunities/${opportunity._id}`}
      className="group bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
            {opportunity.title}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeBadge(opportunity.type)}`}>
            {opportunity.type}
          </span>
        </div>

        {/* Description */}
        <p className="text-slate-400 line-clamp-2">
          {opportunity.description}
        </p>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="h-4 w-4" />
            {opportunity.location}
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="h-4 w-4" />
            {opportunity.timeCommitment}
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Users className="h-4 w-4" />
            {opportunity.currentApplications || 0} applied
            {opportunity.maxVolunteers > 0 && ` • ${opportunity.maxVolunteers} spots`}
          </div>
        </div>

        {/* Skills */}
        {opportunity.requiredSkills && opportunity.requiredSkills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {opportunity.requiredSkills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full bg-blue-600/10 text-blue-400 text-xs"
              >
                {skill}
              </span>
            ))}
            {opportunity.requiredSkills.length > 3 && (
              <span className="px-3 py-1 rounded-full bg-slate-600/10 text-slate-400 text-xs">
                +{opportunity.requiredSkills.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center gap-2 text-blue-400 font-medium">
          View Details & Apply
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
```

**Step 2: Create opportunities list page**

Create `app/volunteer-opportunities/page.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { OpportunityCard } from '@/components/volunteer/OpportunityCard';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VolunteerOpportunity } from '@/types/volunteer';

export default function VolunteerOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    fetchOpportunities();
  }, [typeFilter, locationFilter]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter !== 'all') params.append('type', typeFilter);
      if (locationFilter) params.append('location', locationFilter);

      const response = await fetch(`/api/volunteer-opportunities?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setOpportunities(data);
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOpportunities = opportunities.filter(opp =>
    opp.title.toLowerCase().includes(search.toLowerCase()) ||
    opp.description.toLowerCase().includes(search.toLowerCase()) ||
    opp.requiredSkills?.some(skill => skill.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Volunteer Opportunities
          </h1>
          <p className="text-xl text-slate-400">
            Join our community and make a difference. Browse open opportunities below.
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, description, or skills..."
                className="flex-1 bg-slate-900 border-slate-700 text-white"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                  <SelectItem value="On-site">On-site</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>

              <Input
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="Filter by location..."
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>
          </div>
        </div>

        {/* Opportunities Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">
              {search || typeFilter !== 'all' || locationFilter
                ? 'No opportunities match your filters'
                : 'No opportunities available at the moment. Check back soon!'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredOpportunities.map((opportunity) => (
              <OpportunityCard key={opportunity._id} opportunity={opportunity} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add components/volunteer/ app/volunteer-opportunities/
git commit -m "feat: add public volunteer opportunities listing page"
```

---

## Task 12: Create Volunteer Opportunity Detail Page with Application Form

**Files:**
- Create: `components/volunteer/VolunteerApplicationForm.tsx`
- Create: `app/volunteer-opportunities/[id]/page.tsx`

**Step 1: Create updated application form with custom questions**

Create `components/volunteer/VolunteerApplicationForm.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Loader2, User, Mail, Phone, Heart } from 'lucide-react';
import { CustomQuestion } from '@/types/volunteer';

interface VolunteerApplicationFormProps {
  opportunityId: string;
  opportunityTitle: string;
  customQuestions: CustomQuestion[];
}

export function VolunteerApplicationForm({
  opportunityId,
  opportunityTitle,
  customQuestions
}: VolunteerApplicationFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    country: 'India',
    age: '',
    profession: '',
    interestArea: opportunityTitle,
    experience: '',
    availability: '',
    whyVolunteer: '',
    skills: '',
    customAnswers: {} as Record<string, string>
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.experience.trim() || formData.experience.length < 10) {
      newErrors.experience = 'Please describe your experience (min 10 characters)';
    }
    if (!formData.whyVolunteer.trim() || formData.whyVolunteer.length < 20) {
      newErrors.whyVolunteer = 'Please tell us why you want to volunteer (min 20 characters)';
    }
    if (!formData.availability.trim()) newErrors.availability = 'Please describe your availability';
    if (!formData.skills.trim()) newErrors.skills = 'Please describe your skills';

    // Validate custom questions
    customQuestions.forEach(question => {
      if (question.required) {
        const answer = formData.customAnswers[question.id];
        if (!answer || !answer.trim()) {
          newErrors[question.id] = `${question.title} is required`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/volunteer-opportunities/${opportunityId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age)
        })
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        alert(data.error || 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCustomQuestion = (question: CustomQuestion) => {
    const error = errors[question.id];

    switch (question.type) {
      case 'text':
        return (
          <div key={question.id}>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              {question.title}
              {question.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            <input
              type="text"
              value={formData.customAnswers[question.id] || ''}
              onChange={(e) => setFormData({
                ...formData,
                customAnswers: { ...formData.customAnswers, [question.id]: e.target.value }
              })}
              className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
                error ? 'border-red-500' : 'border-slate-700'
              } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all text-white`}
              placeholder={question.title}
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>
        );

      case 'textarea':
        return (
          <div key={question.id}>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              {question.title}
              {question.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            <textarea
              rows={3}
              value={formData.customAnswers[question.id] || ''}
              onChange={(e) => setFormData({
                ...formData,
                customAnswers: { ...formData.customAnswers, [question.id]: e.target.value }
              })}
              className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
                error ? 'border-red-500' : 'border-slate-700'
              } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all resize-none text-white`}
              placeholder={question.title}
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={question.id}>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              {question.title}
              {question.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            <select
              value={formData.customAnswers[question.id] || ''}
              onChange={(e) => setFormData({
                ...formData,
                customAnswers: { ...formData.customAnswers, [question.id]: e.target.value }
              })}
              className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
                error ? 'border-red-500' : 'border-slate-700'
              } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all text-white`}
            >
              <option value="">Select an option</option>
              {question.options?.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={question.id}>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              {question.title}
              {question.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {question.options?.map((option) => (
                <label key={option} className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(formData.customAnswers[question.id] || '').split(',').includes(option)}
                    onChange={(e) => {
                      const current = (formData.customAnswers[question.id] || '').split(',').filter(Boolean);
                      if (e.target.checked) {
                        current.push(option);
                      } else {
                        const idx = current.indexOf(option);
                        if (idx > -1) current.splice(idx, 1);
                      }
                      setFormData({
                        ...formData,
                        customAnswers: { ...formData.customAnswers, [question.id]: current.join(',') }
                      });
                    }}
                    className="w-4 h-4"
                  />
                  {option}
                </label>
              ))}
            </div>
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 rounded-full bg-emerald-600 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Application Submitted!</h3>
        <p className="text-slate-400">
          Thank you for applying to volunteer with us. We'll review your application and get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Base form fields - same as before but condensed */}
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">First Name *</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border ${
                errors.firstName ? 'border-red-500' : 'border-slate-700'
              } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none text-white`}
              placeholder="John"
            />
          </div>
          {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Last Name *</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
              errors.lastName ? 'border-red-500' : 'border-slate-700'
            } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none text-white`}
            placeholder="Doe"
          />
          {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
        </div>
      </div>

      {/* Rest of the base form fields (email, phone, location, age, profession) */}
      {/* [Condensed for brevity - include all fields from existing form] */}
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Email *</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border ${
                errors.email ? 'border-red-500' : 'border-slate-700'
              } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none text-white`}
              placeholder="john@example.com"
            />
          </div>
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Phone *</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border ${
                errors.phone ? 'border-red-500' : 'border-slate-700'
              } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none text-white`}
              placeholder="+91 98765 43210"
            />
          </div>
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">City *</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none text-white"
            placeholder="Bangalore"
          />
          {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">State *</label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none text-white"
            placeholder="Karnataka"
          />
          {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Country *</label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none text-white"
            placeholder="India"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Age *</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none text-white"
            placeholder="25"
          />
          {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Profession *</label>
          <input
            type="text"
            value={formData.profession}
            onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none text-white"
            placeholder="Software Engineer"
          />
          {errors.profession && <p className="text-red-400 text-xs mt-1">{errors.profession}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">Relevant Experience * (min 10 characters)</label>
        <textarea
          rows={3}
          value={formData.experience}
          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
            errors.experience ? 'border-red-500' : 'border-slate-700'
          } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none resize-none text-white`}
          placeholder="Describe any relevant experience, skills, or background..."
        />
        {errors.experience && <p className="text-red-400 text-xs mt-1">{errors.experience}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">Why do you want to volunteer? * (min 20 characters)</label>
        <textarea
          rows={4}
          value={formData.whyVolunteer}
          onChange={(e) => setFormData({ ...formData, whyVolunteer: e.target.value })}
          className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
            errors.whyVolunteer ? 'border-red-500' : 'border-slate-700'
          } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none resize-none text-white`}
          placeholder="Share your motivation for volunteering..."
        />
        {errors.whyVolunteer && <p className="text-red-400 text-xs mt-1">{errors.whyVolunteer}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">Availability *</label>
        <textarea
          rows={2}
          value={formData.availability}
          onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none resize-none text-white"
          placeholder="Weekends, 5-10 hours/week, etc."
        />
        {errors.availability && <p className="text-red-400 text-xs mt-1">{errors.availability}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">Skills & Talents *</label>
        <textarea
          rows={3}
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          className={`w-full px-4 py-3 rounded-xl bg-slate-900 border ${
            errors.skills ? 'border-red-500' : 'border-slate-700'
          } focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none resize-none text-white`}
          placeholder="Design, Writing, Event Management, Social Media, etc."
        />
        {errors.skills && <p className="text-red-400 text-xs mt-1">{errors.skills}</p>}
      </div>

      {/* Custom Questions */}
      {customQuestions.length > 0 && (
        <div className="space-y-5 pt-6 border-t border-white/10">
          <h3 className="text-lg font-semibold text-white">Additional Questions</h3>
          {customQuestions.map(renderCustomQuestion)}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Heart className="w-5 h-5" />
            Submit Application
          </>
        )}
      </button>
    </form>
  );
}
```

**Step 2: Create opportunity detail page**

Create `app/volunteer-opportunities/[id]/page.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Clock, Users, Calendar, Globe, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { VolunteerApplicationForm } from '@/components/volunteer/VolunteerApplicationForm';
import { VolunteerOpportunity } from '@/types/volunteer';

export default function OpportunityDetailPage({
  params
}: {
  params: { id: string }
}) {
  const router = useRouter();
  const [opportunity, setOpportunity] = useState<VolunteerOpportunity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpportunity();
  }, [params.id]);

  const fetchOpportunity = async () => {
    try {
      const response = await fetch(`/api/volunteer-opportunities/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setOpportunity(data);
      } else {
        router.push('/volunteer-opportunities');
      }
    } catch (error) {
      console.error('Error fetching opportunity:', error);
      router.push('/volunteer-opportunities');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!opportunity) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/volunteer-opportunities"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Opportunities
          </Link>

          {/* Opportunity Details */}
          <div className="bg-white/5 rounded-2xl p-8 md:p-12 border border-white/10 mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">{opportunity.title}</h1>

            <div className="flex flex-wrap gap-4 mb-6">
              <span className={`px-4 py-2 rounded-full text-sm font-medium border ${
                opportunity.type === 'Remote' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                opportunity.type === 'On-site' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                'bg-violet-500/20 text-violet-400 border-violet-500/30'
              }`}>
                {opportunity.type}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-medium border ${
                opportunity.status === 'open' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                'bg-red-500/20 text-red-400 border-red-500/30'
              }`}>
                {opportunity.status === 'open' ? 'Accepting Applications' : 'Closed'}
              </span>
            </div>

            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              {opportunity.description}
            </p>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <MapPin className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-slate-500">Location</p>
                  <p className="text-white font-medium">{opportunity.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-slate-500">Time Commitment</p>
                  <p className="text-white font-medium">{opportunity.timeCommitment}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-6 w-6 text-violet-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-slate-500">Duration</p>
                  <p className="text-white font-medium">
                    {new Date(opportunity.startDate).toLocaleDateString()} - {new Date(opportunity.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-6 w-6 text-pink-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-slate-500">Vacancies</p>
                  <p className="text-white font-medium">
                    {opportunity.maxVolunteers > 0
                      ? `${opportunity.maxVolunteers - (opportunity.currentApplications || 0)} of ${opportunity.maxVolunteers} spots`
                      : 'Unlimited'}
                  </p>
                </div>
              </div>
            </div>

            {/* Required Skills */}
            {opportunity.requiredSkills && opportunity.requiredSkills.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {opportunity.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 rounded-full bg-blue-600/10 text-blue-400 text-sm font-medium border border-blue-600/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Questions Preview */}
            {opportunity.customQuestions && opportunity.customQuestions.length > 0 && (
              <div className="bg-blue-600/10 rounded-xl p-6 border border-blue-600/20">
                <h3 className="text-lg font-semibold text-white mb-3">Application Questions</h3>
                <p className="text-slate-400 mb-4">This opportunity includes the following additional questions:</p>
                <ul className="space-y-2">
                  {opportunity.customQuestions.map((question) => (
                    <li key={question.id} className="flex items-center gap-2 text-slate-300">
                      <span className="text-blue-400">•</span>
                      {question.title}
                      {question.required && <span className="text-xs text-red-400 ml-1">(required)</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Application Form */}
          <div className="bg-slate-900 rounded-2xl p-8 md:p-12 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Apply for This Opportunity</h2>
            <VolunteerApplicationForm
              opportunityId={opportunity._id}
              opportunityTitle={opportunity.title}
              customQuestions={opportunity.customQuestions || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add components/volunteer/ app/volunteer-opportunities/
git commit -m "feat: add opportunity detail page with application form"
```

---

## Task 13: Update Home Page Volunteer Section

**Files:**
- Modify: `components/home/VolunteerSection.tsx`

**Step 1: Simplify the volunteer section**

Replace `components/home/VolunteerSection.tsx` with:

```typescript
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, Users, Clock, Award, Heart, ArrowRight } from 'lucide-react';

const benefits = [
  {
    icon: Users,
    title: 'Global Community',
    description: 'Join 200+ volunteers across 20+ locations'
  },
  {
    icon: Clock,
    title: 'Flexible Hours',
    description: 'Choose opportunities that fit your schedule'
  },
  {
    icon: Award,
    title: 'Make Impact',
    description: 'Contribute to meaningful community service'
  },
  {
    icon: Heart,
    title: 'Personal Growth',
    description: 'Develop new skills and gain experience'
  }
];

export function VolunteerSection() {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-6"
          >
            <span className="px-4 py-2 rounded-full bg-blue-600/20 text-blue-400 text-sm font-semibold">
              🤝 Join Our Community
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Make a Difference Through
            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent"> Service</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto"
          >
            Join our community of volunteers dedicated to spreading peace and transformation.
            Your time and skills can impact thousands of lives.
          </motion.p>

          {/* Impact Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-6 mb-16"
          >
            <div className="text-center p-6 rounded-2xl bg-blue-600 text-white shadow-lg">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-80" />
              <div className="text-4xl font-bold mb-1">200+</div>
              <div className="text-sm opacity-80">Volunteers</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-slate-800 text-white shadow-lg border border-slate-700">
              <Clock className="w-10 h-10 mx-auto mb-3 opacity-80" />
              <div className="text-4xl font-bold mb-1">5K+</div>
              <div className="text-sm opacity-80">Hours Given</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-slate-800 text-white shadow-lg border border-slate-700">
              <Award className="w-10 h-10 mx-auto mb-3 opacity-80" />
              <div className="text-4xl font-bold mb-1">50K+</div>
              <div className="text-sm opacity-80">Lives Impacted</div>
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-2 gap-6 mb-12"
          >
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10"
                >
                  <div className="p-3 rounded-xl bg-blue-600/20">
                    <Icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-white mb-1">{benefit.title}</h3>
                    <p className="text-slate-400 text-sm">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/volunteer-opportunities">
              <Button
                size="lg"
                className="px-8 py-6 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold text-lg"
              >
                View Opportunities
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Test the changes**

Run:
```bash
npm run dev
```

Navigate to the home page and verify the simplified volunteer section displays correctly.

**Step 3: Commit**

```bash
git add components/home/VolunteerSection.tsx
git commit -m "feat: simplify home page volunteer section"
```

---

## Task 14: Final Testing and Verification

**Files:**
- Test all routes
- Verify database operations
- Check role-based access control

**Step 1: Build and test the application**

Run:
```bash
npm run build
```

Verify no build errors.

**Step 2: Test all user flows**

Test the following flows:
1. Navigate to `/volunteer-opportunities` - should show list of opportunities
2. Click on an opportunity - should show detail page
3. Submit application - should work and redirect
4. Admin: `/admin/volunteer-opportunities` - should show management page
5. Admin: Create new opportunity - should work
6. Admin: Edit opportunity - should work
7. Admin: `/admin/volunteer-applications` - should show applications
8. Admin: Approve/reject application - should work

**Step 3: Verify role-based access**

- Check that only content_manager/admin can create/edit opportunities
- Check that only admin can delete opportunities
- Check that content_reviewer can view and approve/reject applications

**Step 4: Final commit**

```bash
git add .
git commit -m "feat: complete volunteer opportunities system implementation"
```

---

## Summary

This implementation plan creates a complete volunteer opportunities management system with:

1. **Database**: MongoDB schemas for opportunities and applications with custom question support
2. **Admin**: Separate pages for managing opportunities and applications
3. **Public**: Dedicated listing and detail pages for opportunities
4. **Forms**: Dynamic application forms that adapt to custom questions
5. **Home Page**: Simplified volunteer section focused on benefits

**Total estimated implementation time**: 4-6 hours for all tasks.

**Key features implemented**:
- Opportunity creation with custom questions
- Application submission with opportunity-specific questions
- Role-based access control
- Filterable/searchable listings
- Status management (pending/approved/rejected)
- Application limits (max volunteers)
- Email notifications ready (API structure in place)
