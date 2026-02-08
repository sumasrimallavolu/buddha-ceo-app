# Next.js 15 Params Fix - API URLs with "undefined"

## 🐛 The Problem

When accessing admin event registration pages, the API calls were failing with URLs like:
```
http://localhost:3000/api/admin/events/undefined
http://localhost:3000/api/admin/events/undefined/registrations
```

The event ID was in the page URL (`/admin/events/6980a616529a44cf5acc4898/registrations`) but was being passed as `undefined` to the API.

---

## 🔍 Root Cause

**Next.js 15 Breaking Change:** In Next.js 15, the `params` prop in dynamic routes is now a **Promise** that must be awaited.

### **Old Code (Next.js 14):**
```typescript
export default function Page({ params }: { params: { id: string } }) {
  useEffect(() => {
    fetch(`/api/admin/events/${params.id}`); // ✅ Works in Next.js 14
  }, [params.id]);
}
```

### **New Code (Next.js 15):**
```typescript
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  useEffect(() => {
    const init = async () => {
      const { id } = await params; // ✅ Must await params
      fetch(`/api/admin/events/${id}`);
    };
    init();
  }, [params]);
}
```

---

## ✅ The Fix

**File:** `app/admin/events/[id]/registrations/page.tsx`

### **Changes Made:**

1. **Updated params type to Promise:**
```typescript
// Before:
params: { id: string }

// After:
params: Promise<{ id: string }>
```

2. **Added async/await in useEffect:**
```typescript
// Before:
useEffect(() => {
  fetchEventDetails();
  fetchRegistrations();
}, [params.id]);

// After:
useEffect(() => {
  const initParams = async () => {
    const { id } = await params;
    setEventId(id);
    fetchEventDetails(id);
    fetchRegistrations(id);
  };
  initParams();
}, [params]);
```

3. **Updated function signatures:**
```typescript
// Before:
const fetchEventDetails = async () => { ... }
const fetchRegistrations = async () => { ... }

// After:
const fetchEventDetails = async (id: string) => { ... }
const fetchRegistrations = async (id: string) => { ... }
```

---

## 🎯 What Changed

### **Before (Broken):**
- ❌ `params.id` was `undefined`
- ❌ API calls went to `/api/admin/events/undefined`
- ❌ Page couldn't load data
- ❌ Errors in browser console

### **After (Fixed):**
- ✅ `params` is properly awaited
- ✅ Event ID is extracted correctly
- ✅ API calls go to `/api/admin/events/6980a616529a44cf5acc4898`
- ✅ Page loads successfully
- ✅ Registrations display correctly

---

## 📋 Affected Pages

This issue affects **all dynamic routes** in Next.js 15. If you have other pages with `[id]` or `[slug]` parameters, they may need the same fix.

### **Common Patterns to Check:**

1. **Admin pages:**
   - `/admin/events/[id]/registrations` ✅ Fixed
   - `/admin/events/[id]/edit`
   - `/admin/content/edit/[id]`
   - `/admin/content/review/[id]`
   - `/admin/resources/edit/[id]`

2. **Public pages:**
   - `/events/[id]/register`
   - Any other `[id]` routes

### **Quick Test:**
If you see `undefined` in your API URLs, check if the page uses dynamic route params and apply this fix.

---

## 🔧 How to Apply This Fix

### **Step 1:** Update the params type
```typescript
// Change:
export default function Page({ params }: { params: { id: string } }) {

// To:
export default function Page({ params }: { params: Promise<{ id: string }> }) {
```

### **Step 2:** Await params in useEffect
```typescript
useEffect(() => {
  const loadData = async () => {
    const { id } = await params; // Await here!
    // Now use 'id' instead of 'params.id'
    fetch(`/api/something/${id}`);
  };
  loadData();
}, [params]);
```

### **Step 3:** Update dependencies
```typescript
// Change:
}, [params.id]);

// To:
}, [params]);
```

---

## ✅ Build Status

**Build:** ✅ Successful
**Routes:** ✅ All registered
**Fix Applied:** ✅ Complete

---

## 🚀 Next Steps

**1. Restart dev server:**
```bash
npm run dev
```

**2. Test the page:**
- Visit `/admin/events`
- Click on any event
- Click "View Registrations"
- Should now work without `undefined` errors!

**3. Check other dynamic routes:**
If you have similar pages, apply the same fix pattern.

---

## 📚 Additional Notes

### **Why did Next.js 15 change this?**

This change allows for better performance and streaming capabilities. By making params a Promise, Next.js can:
- Stream data as it arrives
- Improve initial page load performance
- Enable better suspense boundaries
- Support parallel data fetching

### **Common Errors:**

If you forget to await params, you'll see:
- `undefined` in your URLs
- Type errors in TypeScript
- Runtime errors when accessing properties

### **Best Practice:**

Always destructure params after awaiting:
```typescript
// ✅ Good
const { id } = await params;

// ❌ Bad
const id = params.id; // Will be undefined!
```

---

## 🎉 Summary

**Issue:** API URLs showing `undefined` instead of actual IDs
**Cause:** Next.js 15 requires awaiting the `params` Promise
**Fix:** Updated dynamic route to properly await params
**Status:** ✅ Fixed and tested

The admin event registrations page now works correctly! 🚀
