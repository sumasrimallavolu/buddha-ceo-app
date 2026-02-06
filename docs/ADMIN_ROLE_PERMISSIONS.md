# Admin Role-Based Access Control (RBAC)

## Overview
The admin panel uses a role-based access control system with three distinct roles, each having specific permissions to manage different aspects of the meditation institute platform.

## Roles

### 1. Administrator (admin)
**Highest level of access** - Full control over the platform.

**Permissions:**
- ✅ View dashboard and all statistics
- ✅ Manage all users (create, edit, delete)
- ✅ Full content management (create, edit, delete, publish)
- ✅ Review and approve/reject content
- ✅ Full event management
- ✅ Full resource management
- ✅ View and delete contact messages
- ✅ Manage subscribers
- ✅ Access all settings
- ✅ Can edit/delete ANY content (not just their own)

### 2. Content Manager (content_manager)
**Mid-level access** - Focus on content creation and management.

**Permissions:**
- ✅ View dashboard and statistics
- ✅ Create content (blogs, articles, etc.)
- ✅ Edit OWN content only
- ✅ Delete OWN content only
- ✅ Submit content for review
- ✅ Create and manage events
- ✅ Edit OWN events only
- ✅ Delete OWN events only
- ✅ Create and manage resources
- ✅ Edit OWN resources only
- ✅ Delete OWN resources only
- ✅ View contact messages
- ✅ View subscribers
- ❌ Cannot publish content directly (requires approval)
- ❌ Cannot manage users
- ❌ Cannot edit others' content

### 3. Content Reviewer (content_reviewer)
**Review-focused access** - Focus on content moderation.

**Permissions:**
- ✅ View dashboard and statistics
- ✅ View all content
- ✅ Review submitted content
- ✅ Approve or reject content
- ✅ View events and resources
- ✅ View contact messages
- ✅ View subscribers
- ❌ Cannot create content
- ❌ Cannot edit content
- ❌ Cannot delete content
- ❌ Cannot manage users
- ❌ Cannot manage events

## Permission System

### Using in Server Components

```typescript
import { requirePermission, requireRole } from '@/lib/permissions';

// Require specific permission
export default async function AdminPage() {
  const session = await requirePermission('delete:content');

  // Your page code
}

// Require specific role level
export default async function UsersPage() {
  const session = await requireRole('admin');

  // Your page code
}
```

### Using in API Routes

```typescript
import { apiRequirePermission } from '@/lib/permissions';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  const session = await apiRequirePermission('delete:content')(request);

  // Your API logic
}
```

### Using in Client Components

```typescript
import { useSession } from 'next-auth/react';
import { hasPermission } from '@/lib/permissions';

export function DeleteButton({ contentId }) {
  const { data: session } = useSession();

  const canDelete = hasPermission(
    session?.user?.role,
    'delete:content'
  );

  if (!canDelete) return null;

  return <button>Delete</button>;
}
```

## Content Workflow

### For Content Managers:
1. **Create** content → Status: `draft`
2. **Submit** for review → Status: `pending_review`
3. Wait for **Reviewer/Admin** approval
4. Once approved → Status: `published`

### For Content Reviewers:
1. View all `pending_review` content
2. **Approve** → Status: `published`
3. **Reject** → Status: `draft` (with feedback)

### For Admins:
- Can skip review process and **directly publish**
- Can edit/delete ANY content
- Can perform all reviewer actions

## Permission Cheatsheet

| Action | Admin | Content Manager | Content Reviewer |
|--------|-------|-----------------|------------------|
| View Dashboard | ✅ | ✅ | ✅ |
| Create Users | ✅ | ❌ | ❌ |
| Edit Users | ✅ | ❌ | ❌ |
| Delete Users | ✅ | ❌ | ❌ |
| Create Content | ✅ | ✅ | ❌ |
| Edit Own Content | ✅ | ✅ | ❌ |
| Edit Any Content | ✅ | ❌ | ❌ |
| Delete Own Content | ✅ | ✅ | ❌ |
| Delete Any Content | ✅ | ❌ | ❌ |
| Publish Content | ✅ | ❌ | ❌ |
| Review Content | ✅ | ❌ | ✅ |
| Approve Content | ✅ | ❌ | ✅ |
| Reject Content | ✅ | ❌ | ✅ |
| Create Events | ✅ | ✅ | ❌ |
| Edit Events | ✅ | Own only | ❌ |
| Delete Events | ✅ | Own only | ❌ |
| Create Resources | ✅ | ✅ | ❌ |
| Edit Resources | ✅ | Own only | ❌ |
| Delete Resources | ✅ | Own only | ❌ |
| View Messages | ✅ | ✅ | ✅ |
| Delete Messages | ✅ | ❌ | ❌ |
| View Subscribers | ✅ | ✅ | ✅ |
| Delete Subscribers | ✅ | ❌ | ❌ |
| Manage Settings | ✅ | ❌ | ❌ |

## Security Best Practices

1. **Always check permissions on both client AND server**
   - Client: For UI visibility (can be bypassed)
   - Server: For actual enforcement (cannot be bypassed)

2. **Use specific permissions over generic role checks**
   ```typescript
   // Bad
   if (session.user.role === 'admin') { }

   // Good
   if (hasPermission(session.user.role, 'delete:user')) { }
   ```

3. **Never rely solely on client-side checks**
   - Always validate on server-side API routes
   - Use permission middleware in API routes

4. **Log permission-denied actions**
   - Help detect unauthorized access attempts
   - Useful for security auditing

## Adding New Permissions

Edit `lib/permissions.ts`:

```typescript
// Add to ROLE_PERMISSIONS
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    // ... existing permissions
    'new:permission', // Add here
  ],
  // ...
};

// Add helper function if needed
export function canDoNewThing(userRole: UserRole): boolean {
  return userRole === 'admin';
}
```

## Common Permission Patterns

### Check if user can edit content
```typescript
import { canEditContent } from '@/lib/permissions';

const canEdit = canEditContent(session.user.role, content.userId);
```

### Check if user can delete content
```typescript
import { canDeleteContent } from '@/lib/permissions';

const canDelete = canDeleteContent(session.user.role);
```

### Check if user can review content
```typescript
import { canReviewContent } from '@/lib/permissions';

const canReview = canReviewContent(session.user.role);
```

## Error Handling

When permission check fails, the system will:
1. **Server Components**: Redirect to `/admin?error=insufficient_permissions`
2. **API Routes**: Return 403 Forbidden
3. **Client Components**: Return null or show error message

Example error handling:
```typescript
'use client';

import { useSession } from 'next-auth/react';
import { hasPermission } from '@/lib/permissions';

export function ProtectedAction() {
  const { data: session } = useSession();

  if (!session) {
    return <div>Please log in</div>;
  }

  if (!hasPermission(session.user.role, 'delete:content')) {
    return <div>You don't have permission to delete content</div>;
  }

  return <button>Delete</button>;
}
```
