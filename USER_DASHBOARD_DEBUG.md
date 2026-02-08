# User Dashboard Error - Debugging Guide

## Error: "Failed to fetch registrations"

This error occurs when the `/api/user/registrations` endpoint fails. Here's how to debug and fix it:

---

## 🔍 Common Causes & Solutions

### **1. Not Logged In**
**Symptom:** Error when accessing `/dashboard`

**Solution:**
- Make sure you're logged in
- Visit `/login` and sign in
- Check if you see your name in the header

### **2. Wrong User Role**
**Symptom:** You're logged in but getting 403 Forbidden

**The Issue:**
The `/api/user/registrations` endpoint **ONLY** allows users with `'user'` role.
If you're an admin, content_manager, or content_reviewer, you'll get rejected.

**Quick Fix - Update the API to allow all authenticated users:**

The current code:
```typescript
// Check if user has 'user' role
if (session.user.role !== 'user') {
  return NextResponse.json(
    { error: 'Forbidden - User access only' },
    { status: 403 }
  );
}
```

**Should be changed to:**
```typescript
// Allow any authenticated user to access
if (!session || !session.user) {
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  );
}
```

This will allow admins, content managers, and reviewers to also see their registrations.

### **3. Next.js Cache Issue**
**Symptom:** Routes not working after code changes

**Solution:**
```bash
# Stop the dev server (Ctrl+C)

# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev
```

### **4. Database Connection Issue**
**Symptom:** API returns 500 error

**Solution:**
- Check MongoDB is running
- Verify `MONGODB_URI` in `.env.local`
- Check database connection string format

---

## 🛠️ Quick Fix - Allow All Authenticated Users

If you want admins/managers to also see their registrations, update the API:

**File:** `app/api/user/registrations/route.ts`

**Change line 21-27 from:**
```typescript
// Check if user has 'user' role
if (session.user.role !== 'user') {
  return NextResponse.json(
    { error: 'Forbidden - User access only' },
    { status: 403 }
  );
}
```

**To:**
```typescript
// Allow any authenticated user
// No role check needed - all authenticated users can see their registrations
```

---

## 🧪 Testing the API

### **Test 1: Check if you're logged in**

Open browser console (F12) and run:
```javascript
fetch('/api/auth/session').then(r => r.json()).then(console.log)
```

**Expected output:**
```json
{
  "user": {
    "id": "...",
    "name": "Your Name",
    "email": "your@email.com",
    "role": "user" // or "admin", "content_manager", etc.
  },
  "expires": "..."
}
```

**If you see `{"user": null}`**: You're not logged in. Go to `/login`.

### **Test 2: Check the API directly**

```javascript
fetch('/api/user/registrations').then(r => r.json()).then(console.log)
```

**Possible responses:**

✅ **Success:**
```json
{
  "success": true,
  "registrations": [...],
  "total": 3
}
```

❌ **401 Unauthorized:**
```json
{
  "error": "Unauthorized"
}
```
→ You're not logged in

❌ **403 Forbidden:**
```json
{
  "error": "Forbidden - User access only"
}
```
→ Your role is not 'user'

❌ **500 Error:**
```json
{
  "error": "Failed to fetch registrations"
}
```
→ Database or server error

---

## 📋 Recommended Solution

### **Option 1: Remove Role Restriction (Recommended)**

Allow all authenticated users (admin, content_manager, content_reviewer, user) to see their registrations.

**File:** `app/api/user/registrations/route.ts`

**Remove these lines (21-27):**
```typescript
// Check if user has 'user' role
if (session.user.role !== 'user') {
  return NextResponse.json(
    { error: 'Forbidden - User access only' },
    { status: 403 }
  );
}
```

**Benefit:** Everyone can see their registered events, regardless of role.

### **Option 2: Create Separate Dashboard for Admins**

Keep the restriction but redirect admins to `/admin` instead.

**Already implemented in** `app/dashboard/page.tsx` (lines 72-75):
```typescript
// Check if user has 'user' role, if not redirect to admin
if (session?.user?.role && session.user.role !== 'user') {
  router.push('/admin');
  return;
}
```

---

## 🎯 What Should Happen

### **For 'user' role:**
1. Login at `/login` or `/signup`
2. Get redirected to `/dashboard`
3. See all registered events
4. See "Leave Feedback" button on ended events

### **For 'admin', 'content_manager', 'content_reviewer' roles:**
1. Login at `/login`
2. Get redirected to `/admin`
3. See admin panel
4. **Cannot** access `/dashboard` (currently restricted)

---

## ✅ Quick Fix Steps

**To fix immediately:**

1. **Clear cache and restart:**
   ```bash
   rm -rf .next
   npm run dev
   ```

2. **Test as a 'user' role:**
   - Go to `/signup` (create a new account)
   - New accounts get 'user' role by default
   - Visit `/dashboard`
   - Should work!

3. **If you want admin access too:**
   - Update the API to remove role restriction (see Option 1 above)
   - Or use a 'user' account for testing

---

## 🔧 Current Build Status

✅ Build successful
✅ All routes registered including `/api/user/registrations`
✅ Import issue fixed

---

## 💡 Recommendation

**Remove the role restriction** from the API. This allows all authenticated users to see their registrations, which makes more sense:

- Admins can register for events
- Content managers can register for events
- All users should see what they've registered for

**Just delete lines 21-27** in `app/api/user/registrations/route.ts` to fix this!

---

## 📞 Still Having Issues?

1. Check browser console (F12) for errors
2. Check terminal where `npm run dev` is running for server errors
3. Verify MongoDB is connected
4. Try logging out and logging back in
5. Clear browser cookies and localStorage

---

## 🎉 Expected Result

After fixing, you should see:
- Your name and email at top of dashboard
- Number of events registered
- List of all events you've registered for
- "Leave Feedback" button on events that have ended
- "Browse Events" button if no registrations
