# Troubleshooting Guide

## Issue: Redirecting to Error Page

### Fixed Issues

1. ✅ **Admin Layout Location**
   - **Problem:** Layout was at `app/(admin)/layout.tsx` but pages were in `app/admin/`
   - **Fix:** Moved layout to `app/admin/layout.tsx`
   - **Status:** RESOLVED

### Please Provide Details

To help troubleshoot further, please let me know:

1. **What page are you trying to access?**
   - Admin dashboard: `/admin`
   - User management: `/admin/users`
   - Create user: `/admin/users/new`
   - Content management: `/admin/content`
   - Create content: `/admin/content/new`
   - Login page: `/login`
   - Public pages: `/`, `/about`, `/events`, etc.

2. **What error message do you see?**
   - Screenshot of the error
   - Error text displayed

3. **When does the redirect happen?**
   - Immediately after login
   - When clicking a specific link
   - When trying to access admin pages
   - On all pages

4. **What is your login status?**
   - Are you logged in?
   - What role are you using (admin/manager/reviewer)?

### Quick Checks

#### 1. Check if Database is Running
```bash
# Check MongoDB
mongod

# Or check if MongoDB Atlas is accessible
```

#### 2. Check if Database is Seeded
```bash
npm run db:seed
```

#### 3. Check Environment Variables
Verify `.env.local` exists and has:
```
MONGODB_URI=mongodb://localhost:27017/meditation-institute
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
```

#### 4. Clear Browser Data
- Clear cookies
- Clear local storage
- Try incognito/private mode

#### 5. Check Server Logs
```bash
npm run dev
```
Look for error messages in the console

### Common Issues & Solutions

#### Issue: "Not Authorized" or Redirect to Login
**Cause:** Not logged in or session expired
**Solution:**
- Login at `/login` using credentials:
  - Admin: `admin@meditation.org` / `admin123`
  - Manager: `manager@meditation.org` / `manager123`
  - Reviewer: `reviewer@meditation.org` / `reviewer123`

#### Issue: Access Denied to Admin Pages
**Cause:** Insufficient role permissions
**Solution:**
- Admins can access all pages
- Content Managers cannot access User Management
- Content Reviewers can review but not create content

#### Issue: Cannot Find Page (404)
**Cause:** Page doesn't exist or wrong URL
**Solution:**
- Check the URL spelling
- Verify the page file exists in `app/` directory

#### Issue: Database Connection Error
**Cause:** MongoDB not running or wrong connection string
**Solution:**
- Start MongoDB: `mongod`
- Or update MONGODB_URI in `.env.local`

### Test URLs to Verify

After starting the dev server (`npm run dev`), test these URLs:

#### Public Pages (No Login Required)
- http://localhost:3000/ (Home)
- http://localhost:3000/about (About)
- http://localhost:3000/project-excellence (Project Excellence)
- http://localhost:3000/events (Events)
- http://localhost:3000/register (Register)
- http://localhost:3000/teach (Teach)
- http://localhost:3000/resources (Resources)
- http://localhost:3000/contact (Contact)

#### Authentication
- http://localhost:3000/login (Login page)

#### Admin Pages (Login Required)
- http://localhost:3000/admin (Dashboard)
- http://localhost:3000/admin/users (User Management - Admin only)
- http://localhost:3000/admin/users/new (Create User - Admin only)
- http://localhost:3000/admin/content (Content Management)
- http://localhost:3000/admin/content/new (Create Content)
- http://localhost:3000/admin/events (Events)
- http://localhost:3000/admin/resources (Resources)
- http://localhost:3000/admin/contact-messages (Messages)
- http://localhost:3000/admin/subscribers (Subscribers)

### Current File Structure

```
app/
├── admin/
│   ├── layout.tsx ✅ (Recently moved)
│   ├── page.tsx ✅
│   ├── users/
│   │   ├── page.tsx ✅
│   │   └── new/
│   │       └── page.tsx ✅
│   ├── content/
│   │   ├── page.tsx ✅
│   │   └── new/
│   │       └── page.tsx ✅
│   ├── events/page.tsx ✅
│   └── resources/page.tsx ✅
├── (auth)/
│   └── login/
│       └── page.tsx ✅
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts ✅
├── about/page.tsx ✅
├── contact/page.tsx ✅
├── events/page.tsx ✅
├── project-excellence/page.tsx ✅
├── register/page.tsx ✅
├── teach/page.tsx ✅
├── resources/page.tsx ✅
└── page.tsx ✅
```

### Next Steps

Please provide:
1. The exact URL you're trying to access
2. The error message you're seeing
3. Your login status and role

This will help me identify and fix the specific issue you're experiencing.
