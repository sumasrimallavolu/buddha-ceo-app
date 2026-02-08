# User Role & Sign Up Implementation

## Overview
Implemented a complete user role system with sign-up functionality and a personalized dashboard for users to track their event registrations.

## Changes Made

### 1. User Model Update (`lib/models/User.ts`)
- Added 'user' role to the existing role enum
- Roles: 'admin' | 'content_manager' | 'content_reviewer' | 'user'
- Default role changed from 'content_manager' to 'user'

```typescript
role: {
  type: String,
  enum: ['admin', 'content_manager', 'content_reviewer', 'user'],
  default: 'user',
  required: true,
}
```

### 2. Sign Up API (`app/api/auth/signup/route.ts`)
**Purpose**: Allow new users to create accounts with 'user' role

**Features**:
- Validates name, email (format), password (min 6 chars)
- Checks for duplicate emails
- Hashes passwords with bcrypt
- Creates user with 'user' role automatically
- Logs signup activity
- Returns user data on successful creation

**Endpoint**: `POST /api/auth/signup`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "message": "Account created successfully",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### 3. User Registrations API (`app/api/user/registrations/route.ts`)
**Purpose**: Fetch all event registrations for the logged-in user

**Features**:
- Requires authentication with 'user' role
- Fetches registrations by user's email
- Joins with Event collection to get full event details
- Returns registrations with event data in structured format
- Sorted by registration date (newest first)

**Endpoint**: `GET /api/user/registrations`

**Authentication**: Bearer token (session)

**Response**:
```json
{
  "success": true,
  "registrations": [
    {
      "registration": {
        "id": "...",
        "status": "confirmed",
        "paymentStatus": "free",
        "phone": "+91 98765 43210",
        "city": "Mumbai",
        "profession": "Engineer",
        "registeredAt": "2026-02-08T10:30:00.000Z"
      },
      "event": {
        "id": "...",
        "title": "Meditation Workshop",
        "description": "...",
        "type": "beginner_online",
        "startDate": "2026-03-01T09:00:00.000Z",
        "endDate": "2026-03-01T10:00:00.000Z",
        "imageUrl": "...",
        "location": {...},
        "teacherName": "...",
        "benefits": [...]
      }
    }
  ],
  "total": 1
}
```

### 4. Sign Up Page (`app/signup/page.tsx`)
**Purpose**: Public sign-up page for new users

**Features**:
- Modern dark theme matching site design
- Glassmorphism card design
- Real-time validation:
  - Required fields
  - Password min 6 characters
  - Password confirmation matching
  - Email format validation
- Auto-login after successful signup
- Redirects to /dashboard after signup
- Links to login page for existing users

**Form Fields**:
- Full Name
- Email Address
- Password (min 6 chars)
- Confirm Password

**Flow**:
1. User fills form
2. Validates on client-side
3. Calls `/api/auth/signup`
4. On success, shows "Account Created!" message
5. Auto-signs in with credentials
6. Redirects to `/dashboard`

### 5. User Dashboard (`app/dashboard/page.tsx`)
**Purpose**: Personalized dashboard for users to view their registered events

**Features**:
- Shows user info card (name, email, registration count)
- Lists all registered events with full details
- Event cards display:
  - Event image
  - Title and description
  - Date, time, location
  - Registration status badges (Confirmed, Pending, Cancelled)
  - Registration date
  - Link to event details
- Empty state with CTA to browse events
- Navigation to home, events, and logout
- Role-based redirect (non-users redirected to /admin)

**Empty State**:
When user has no registrations:
- Friendly message
- Calendar icon
- "Browse Events" button

**Registered Events Display**:
- Grid layout (1 column mobile, 2 columns desktop)
- Each event card shows:
  - Event image
  - Status badge
  - Event details
  - "View Event Details" button

### 6. Login Page Updates (`app/(auth)/login/page.tsx`)
**Changes**:
- Updated title: "Sign in to your account"
- Added "Sign up" link for new users
- Updated messaging: "Admins: Sign in to manage your website data"
- Role-based redirect after login:
  - 'user' role → `/dashboard`
  - Other roles → `/admin`

**Login Flow**:
1. User enters credentials
2. On successful authentication
3. Fetches session to check role
4. Redirects based on role

### 7. Header Component Updates (`components/layout/Header.tsx`)
**Desktop Navigation**:
- Added "Sign Up" button next to "Login" (when not authenticated)
- Updated Dashboard link:
  - 'user' role → `/dashboard`
  - Other roles → `/admin`

**Mobile Menu**:
- Same updates as desktop
- Sign Up and Login buttons stacked vertically

### 8. Event Registration Page Updates (`app/events/[id]/register/page.tsx`)
**Enhancements for Logged-in Users**:
- Pre-fills name and email from session
- Makes name/email fields read-only for users
- Shows helper text: "Using your account name/email"
- After registration, shows button to "View Your Registrations" (for users) instead of "View All Events"

**Benefits**:
- Faster registration for users
- Prevents data entry errors
- Links registration to user account automatically
- Seamless navigation to dashboard

## User Flow

### New User Flow:
1. Lands on homepage → Clicks "Sign Up"
2. Fills sign-up form → Creates account
3. Auto-logged in → Redirected to `/dashboard`
4. Sees empty state → Clicks "Browse Events"
5. Finds event → Clicks "Register Now"
6. Form pre-filled → Submits registration
7. Sees success → Clicks "View Your Registrations"
8. Returns to dashboard → Sees registered event

### Existing User Flow:
1. Lands on homepage → Clicks "Login"
2. Enters credentials → Logged in
3. Redirected to `/dashboard` (if user role)
4. Views all registered events
5. Can browse more events and register

### Admin Flow:
1. Logs in with admin credentials
2. Redirected to `/admin` (unchanged)
3. Access to all admin features

## Database Schema

### User Collection:
```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  role: String (enum: ['admin', 'content_manager', 'content_reviewer', 'user'], default: 'user'),
  avatar: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Registration Collection:
Already exists, now queries by email to link to user accounts.

## Security Features

1. **Password Hashing**: All passwords hashed with bcrypt (salt rounds: 10)
2. **Email Validation**: Server-side validation for format and duplicates
3. **Session Management**: NextAuth.js with JWT strategy, 30-day expiration
4. **Role-based Access**:
   - `/api/user/registrations` only accessible to 'user' role
   - `/dashboard` only accessible to authenticated users
   - Admin routes protected with existing middleware
5. **Activity Logging**: All signups logged to ActivityLog collection

## Files Created/Modified

### New Files:
1. `app/api/auth/signup/route.ts` - Sign up API endpoint
2. `app/api/user/registrations/route.ts` - User registrations API
3. `app/signup/page.tsx` - Sign up page
4. `app/dashboard/page.tsx` - User dashboard

### Modified Files:
1. `lib/models/User.ts` - Added 'user' role
2. `app/(auth)/login/page.tsx` - Role-based redirects, Sign Up link
3. `components/layout/Header.tsx` - Sign Up link, role-based dashboard links
4. `app/events/[id]/register/page.tsx` - Pre-fill for logged-in users

## Testing Checklist

- [ ] Sign up with valid credentials
- [ ] Sign up with duplicate email (should fail)
- [ ] Sign up with short password (should fail)
- [ ] Sign up with invalid email (should fail)
- [ ] Login as new user (should redirect to /dashboard)
- [ ] View empty dashboard (should show browse CTA)
- [ ] Register for event (should pre-fill form)
- [ ] View dashboard after registration (should show event)
- [ ] Login as admin (should redirect to /admin)
- [ ] Logout from dashboard
- [ ] Test mobile navigation (Sign Up/Login buttons)

## Future Enhancements

1. Email verification after signup
2. Password reset flow
3. User profile editing
4. Event reminders/notifications
5. Certificate generation after event completion
6. Social login (Google, Facebook)
7. User settings page
8. Export registrations to calendar (ICS)
9. Email notifications for event updates
10. Waitlist feature for fully booked events

## Build Status

✅ Build successful - No errors
✅ All TypeScript types resolved
✅ All routes registered correctly
