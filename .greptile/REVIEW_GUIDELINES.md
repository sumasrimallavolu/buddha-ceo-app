# Code Review Guidelines for Greptile

## Must-Enforce Rules

### 1. Admin Role Restrictions (CRITICAL)
The `admin` role has **view-only** permissions for content, events, and resources. They **CANNOT** create, edit, or delete these entities.

**Required Pattern:**
```typescript
// ❌ WRONG - Admin should not see edit button
if (session?.user?.role === 'admin' || session?.user?.role === 'content_manager') {
  return <EditButton />;
}

// ✅ CORRECT - Only content_manager can edit
if (session?.user?.role === 'content_manager') {
  return <EditButton />;
}
```

**Admin CAN:**
- Delete subscribers and contact messages
- View all dashboard analytics
- Review and publish content
- Manage teacher/volunteer applications

**Admin CANNOT:**
- Create, edit, or delete content
- Create, edit, or delete events
- Create, edit, or delete resources

### 2. Dark Theme Compliance
All form components MUST use dark theme styling:

**Required classes for inputs:**
- Background: `bg-white/5`
- Border: `border-white/10` (default), `hover:border-white/20`
- Focus: `focus-visible:border-blue-500/50`, `focus-visible:ring-blue-500/20`
- Text: `text-white`, `placeholder:text-slate-500`

**Example:**
```tsx
<Input className="border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus-visible:border-blue-500/50" />
```

### 3. Admin Analytics Filtering
All visitor analytics MUST exclude admin pages:

```typescript
// ❌ WRONG - Includes admin pages
const visits = await VisitorLog.countDocuments({ createdAt: { $gte: startDate } });

// ✅ CORRECT - Excludes admin pages
const visits = await VisitorLog.countDocuments({
  createdAt: { $gte: startDate },
  page: { $not: /^\/admin/ }
});
```

### 4. Next.js 15 API Route Pattern
DELETE and PUT methods must use query parameters (NOT params object):

```typescript
// ❌ WRONG - Next.js 14 pattern
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
}

// ✅ CORRECT - Next.js 15 pattern
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
}
```

### 5. Permission Checks on All API Routes
Every API route must authenticate and check permissions:

```typescript
import { requireRole } from '@/lib/permissions';

export async function POST(request: NextRequest) {
  // REQUIRED: Authentication
  const session = await requireRole('content_manager');

  // ... rest of handler
}
```

### 6. React Hooks Order
Components must call hooks in the same order on every render:

```typescript
// ❌ WRONG - Early return breaks hooks order
if (pathname?.startsWith('/admin')) {
  return null;
}
useEffect(() => { ... }, []);

// ✅ CORRECT - Check inside useEffect
useEffect(() => {
  if (pathname?.startsWith('/admin')) {
    return;
  }
  // ... rest of effect
}, [pathname]);
```

## Code Quality Standards

### TypeScript
- Use `strict` mode (enabled in tsconfig.json)
- No `any` types - use proper interfaces
- Server component props must use `Promise` wrapper:
  ```typescript
  interface PageProps {
    params: Promise<{ id: string }>;
  }
  ```

### Error Handling
Always check for Next.js redirects:
```typescript
if (error?.digest === 'NEXT_REDIRECT') {
  throw error;
}
```

### Database Indexes
Add indexes for frequently queried fields:
```typescript
ModelSchema.index({ status: 1 });
ModelSchema.index({ createdAt: -1 });
```

## Common Issues to Flag

1. **Missing permission checks** on API routes
2. **Admin role with edit/delete permissions** for content/events/resources
3. **Light theme classes** (bg-white, border-gray-*) instead of dark theme
4. **Admin pages included** in visitor analytics
5. **Next.js 14 params pattern** in DELETE/PUT routes
6. **Hook order violations** (early returns before useEffect)
7. **Missing error logging** in API routes
8. **Hardcoded role strings** instead of using UserRole type

## Review Priority

**HIGH PRIORITY** (Block merge):
- Security vulnerabilities (missing auth, permission bypass)
- Admin role with edit/delete permissions
- Admin pages in analytics

**MEDIUM PRIORITY** (Request changes):
- Dark theme violations
- TypeScript errors
- Missing error handling

**LOW PRIORITY** (Suggestions):
- Code organization
- Performance optimizations
- Naming conventions
