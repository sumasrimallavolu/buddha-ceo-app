# Greptile Custom Context - Meditation Institute Codebase

This document defines the coding patterns, conventions, and architecture for the Buddha CEO App (meditation-institute) project. Use this to guide code reviews and ensure consistency across the codebase.

## Project Overview

**Tech Stack:**
- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript 5 (strict mode enabled)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js 4
- **UI**: React 19, Tailwind CSS 4, shadcn/ui components
- **Charts**: Recharts 3.7.0
- **Icons**: Lucide React

**Role-Based Access Control (RBAC):**
- `admin`: View-only access to most resources, can delete subscribers and messages
- `content_manager`: Full CRUD operations on content, events, resources
- `content_reviewer`: Can review, approve, and reject content submissions

---

## 1. Dark Theme Styling Patterns

### 1.1 Component Base Styles

All form components must use the dark theme with consistent styling:

**Input/Textarea Components:**
```tsx
className="border-input placeholder:text-slate-500 focus-visible:border-blue-500/50 focus-visible:ring-blue-500/20 aria-invalid:ring-red-500/20 aria-invalid:border-red-500/50 flex min-h-[80px] field-sizing-content w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white shadow-sm transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 resize-none md:text-sm"
```

**Key Dark Theme Classes:**
- Background: `bg-white/5` (semi-transparent white)
- Borders: `border-white/10` (default), `hover:border-white/20`
- Focus: `focus-visible:border-blue-500/50`, `focus-visible:ring-blue-500/20`
- Text: `text-white` (primary), `text-slate-300` (secondary), `text-slate-500` (placeholder)
- Error states: `aria-invalid:border-red-500/50`, `aria-invalid:ring-red-500/20`

### 1.2 Status Badge Colors

```tsx
const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'published':
      return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    case 'pending_review':
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'draft':
      return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
    case 'rejected':
      return 'bg-red-500/20 text-red-400 border border-red-500/30';
    default:
      return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
  }
};
```

### 1.3 Button Styles

**Primary Action (Blue):**
```tsx
className="bg-blue-600 hover:bg-blue-700 text-white"
```

**Destructive Action (Red):**
```tsx
className="bg-red-600 hover:bg-red-700 text-white"
```

**Secondary/Outline:**
```tsx
className="border border-white/20 hover:bg-white/10 text-slate-300"
```

---

## 2. Permission System Patterns

### 2.1 Import Permissions

Always import from `@/lib/permissions`:
```tsx
import { hasPermission, requireRole, requirePermission } from '@/lib/permissions';
```

### 2.2 Server-Side Permission Checks

**API Routes:**
```tsx
import { requireRole } from '@/lib/permissions';

export async function GET(request: NextRequest) {
  // Only admins can view analytics
  const session = await requireRole('admin');

  // ... rest of handler
}
```

**Server Components:**
```tsx
import { requirePermission } from '@/lib/permissions';

export default async function AdminPage() {
  const session = await requirePermission('view:dashboard');

  // ... rest of component
}
```

### 2.3 Client-Side Permission Checks

```tsx
import { hasPermission } from '@/lib/permissions';
import { useSession } from 'next-auth/react';

function EditButton({ content }) {
  const { data: session } = useSession();

  // Check permissions before showing edit button
  if (!hasPermission(session?.user?.role, 'edit:own_content')) {
    return null;
  }

  return <Button>Edit</Button>;
}
```

### 2.4 Role-Based UI Logic

```tsx
// Admin: View only, no edit/delete buttons
// Content Manager: Full CRUD on own content
// Content Reviewer: Review/approve/reject buttons only

const canEdit = session?.user?.role === 'content_manager';
const canReview = session?.user?.role === 'admin' || session?.user?.role === 'content_reviewer';
```

---

## 3. MongoDB Model Patterns

### 3.1 Model Structure

All models in `lib/models/` follow this pattern:

```typescript
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IExample {
  name: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface IExampleDocument extends IExample, Document {}

const ExampleSchema = new Schema<IExampleDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ExampleSchema.index({ status: 1 });

const Example: Model<IExampleDocument> = mongoose.models.Example || mongoose.model<IExampleDocument>('Example', ExampleSchema);

export default Example;
```

### 3.2 Required Indexes

Always add indexes for frequently queried fields:
```typescript
ExampleSchema.index({ field: 1 });
ExampleSchema.index({ createdAt: -1 }); // For sorting by date
```

---

## 4. API Route Patterns

### 4.1 Route Structure

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/permissions';
import connectDB from '@/lib/mongodb';
import Model from '@/lib/models/Model';

export async function GET(request: NextRequest) {
  try {
    // Authentication
    const session = await requireRole('admin');

    // Database connection
    await connectDB();

    // Query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    // Database query
    const items = await Model.find().limit(limit);

    return NextResponse.json({ items });
  } catch (error: any) {
    if (error?.digest === 'NEXT_REDIRECT') {
      throw error; // Next.js redirect
    }

    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}
```

### 4.2 Error Handling

Always include redirect check for Next.js:
```typescript
if (error?.digest === 'NEXT_REDIRECT') {
  throw error;
}
```

### 4.3 Next.js 15 Compatibility

For DELETE/PUT methods, use query parameters instead of params object:

**❌ Old Pattern (Next.js 14):**
```typescript
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  // ...
}
```

**✅ New Pattern (Next.js 15+):**
```typescript
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  // ...
}
```

---

## 5. TypeScript Conventions

### 5.1 Type Definitions

**Server Components:**
```typescript
interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  // ...
}
```

**Client Components:**
```typescript
'use client';

interface ComponentProps {
  title: string;
  onSuccess?: () => void;
}

export function Component({ title, onSuccess }: ComponentProps) {
  // ...
}
```

### 5.2 Role Types

Always use the UserRole type from permissions:
```typescript
import type { UserRole } from '@/lib/permissions';

function checkRole(role: UserRole): boolean {
  return role === 'admin' || role === 'content_manager';
}
```

---

## 6. Component Patterns

### 6.1 Client vs Server Components

**Use `'use client'` directive when:**
- Using React hooks (useState, useEffect, useSession)
- Handling form submissions
- Using browser APIs
- Interactive UI components

**Default to Server Components when:**
- Fetching data
- Rendering static content
- No user interaction needed

### 6.2 Modal/Dialog Pattern

```typescript
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId?: string;
  onSuccess?: () => void;
}

export function ItemModal({ open, onOpenChange, itemId, onSuccess }: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // ... submission logic
      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      setError('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-950 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
        </DialogHeader>
        {/* Form content */}
      </DialogContent>
    </Dialog>
  );
}
```

### 6.3 Form State Management

```typescript
const [formData, setFormData] = useState({
  title: '',
  description: '',
  status: 'draft',
});

const handleChange = (field: string, value: string) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};
```

---

## 7. Admin Analytics Patterns

### 7.1 Excluding Admin Pages

When tracking analytics, always exclude admin pages:

```typescript
// ❌ Wrong - includes admin pages
const allVisits = await VisitorLog.countDocuments({ createdAt: { $gte: startDate } });

// ✅ Correct - excludes admin pages
const visits = await VisitorLog.countDocuments({
  createdAt: { $gte: startDate },
  page: { $not: /^\/admin/ },
});
```

### 7.2 Daily Stats Generation

```typescript
const dailyStats = [];
for (let i = days - 1; i >= 0; i--) {
  const date = new Date();
  date.setDate(date.getDate() - i);
  date.setHours(0, 0, 0, 0);

  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);

  const visits = await VisitorLog.countDocuments({
    createdAt: { $gte: date, $lt: nextDate },
    page: { $not: /^\/admin/ },
  });

  dailyStats.push({
    date: date.toISOString().split('T')[0],
    visits,
  });
}
```

---

## 8. Code Review Checklist

When reviewing PRs, check for:

### 8.1 Security
- [ ] Permission checks on all API routes
- [ ] Admin pages excluded from analytics
- [ ] User inputs properly validated
- [ ] No hardcoded credentials
- [ ] Proper error handling (no sensitive data in errors)

### 8.2 Permissions
- [ ] Admin role has view-only access (no edit/create/delete for content, events, resources)
- [ ] Content manager has full CRUD on own content
- [ ] Content reviewer has review/approve/reject permissions
- [ ] Delete operations check role permissions

### 8.3 Styling
- [ ] Dark theme applied to all form components
- [ ] Consistent padding (px-4 py-3 for inputs/textarea)
- [ ] Status badges use correct colors
- [ ] Hover states defined for interactive elements

### 8.4 TypeScript
- [ ] All components properly typed
- [ ] No `any` types (use proper interfaces)
- [ ] Server component props use Promise wrapper for params/searchParams
- [ ] Client components have 'use client' directive

### 8.5 Database
- [ ] Mongoose models follow established patterns
- [ ] Indexes added for frequently queried fields
- [ ] Timestamps enabled
- [ ] Proper error handling for database operations

### 8.6 Next.js Best Practices
- [ ] API routes handle NEXT_REDIRECT errors
- [ ] DELETE/PUT methods use query parameters (Next.js 15+)
- [ ] Server components preferred when possible
- [ ] Client components only when necessary

---

## 9. Common Anti-Patterns to Avoid

### 9.1 Permission Checks
❌ **Don't** check permissions only on the frontend
✅ **Do** check permissions on both frontend and backend

### 9.2 Admin Page Tracking
❌ **Don't** include admin pages in visitor analytics
✅ **Do** filter with `page: { $not: /^\/admin/ }`

### 9.3 Role Checks
❌ **Don't** use hardcoded role strings
✅ **Do** import `UserRole` type and use `hasPermission()` helper

### 9.4 Styling
❌ **Don't** use light theme classes (bg-white, border-gray-200)
✅ **Do** use dark theme classes (bg-white/5, border-white/10)

### 9.5 Error Handling
❌ **Don't** return generic error messages without logging
✅ **Do** log errors to console and return user-friendly messages

---

## 10. File Structure Patterns

```
app/
├── (auth)/           # Authenticated routes group
│   └── login/
├── admin/            # Admin dashboard (all pages require auth)
│   ├── content/
│   ├── events/
│   ├── resources/
│   └── people/
├── api/              # API routes
│   └── admin/        # Protected admin API routes
└── [pages]/          # Public pages

components/
├── admin/            # Admin-specific components
├── analytics/        # Analytics components
├── forms/            # Form components
├── home/             # Home page sections
├── layout/           # Header, Footer, etc.
└── ui/               # shadcn/ui components

lib/
├── models/           # Mongoose models
├── auth.ts           # NextAuth configuration
└── permissions.ts    # RBAC helpers
```

---

## Summary

This codebase uses:
- **Dark theme** with slate-950 background and white/10 borders
- **Role-based permissions** with admin (view-only), content_manager (CRUD), content_reviewer (review)
- **MongoDB** with Mongoose ODM for data persistence
- **Next.js 16** App Router with TypeScript strict mode
- **Server components** by default, client components when needed
- **shadcn/ui** components with custom dark theme styling

All new code should follow these patterns to maintain consistency and security.
