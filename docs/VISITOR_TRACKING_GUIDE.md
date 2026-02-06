# Visitor & Activity Tracking System

## Overview
Comprehensive tracking system for all website visitors and admin activities with analytics dashboard for administrators.

## Features Implemented

### 1. Visitor Tracking
**Tracks all website visitors (not just admins):**
- Page views and navigation
- Session management
- Referrer tracking
- Device detection (desktop/mobile/tablet)
- Browser and OS detection
- IP address logging
- Time spent on page
- Geographic location (optional)

### 2. Activity Logging
**Tracks all admin user actions:**
- Login attempts (success/failure)
- Content creation/editing/deletion
- User management actions
- Event management
- Resource management
- All CRUD operations
- Status changes (approve/reject)

### 3. Analytics Dashboard
**Admin-only dashboard showing:**
- Total page views (30 days)
- Unique visitors count
- Today's visits and visitors
- Top pages by traffic
- Recent page visits timeline
- Real-time activity feed

## Files Created/Modified

### Models
1. **`lib/models/VisitorLog.ts`** - Visitor tracking model
2. **`lib/models/ActivityLog.ts`** - Activity logging model
3. **`lib/models/index.ts`** - Export updates

### API Routes
1. **`app/api/tracking/route.ts`** - Visitor tracking endpoint
2. **`app/api/admin/activity-logs/route.ts`** - Activity logs endpoint
3. **`app/api/admin/stats/route.ts`** - Enhanced stats with analytics

### Components
1. **`components/analytics/VisitorTracker.tsx`** - Client-side tracking component
2. **`app/admin/page.tsx`** - Dashboard with visitor analytics

### Auth
1. **`lib/auth.ts`** - Enhanced with login activity logging

## How It Works

### Automatic Visitor Tracking
Every page visit is automatically tracked via the `VisitorTracker` component in root layout:

```tsx
<VisitorTracker pageTitle="Page Title" />
```

**Data Collected:**
- Session ID (persistent across navigation)
- Current page path
- Page title
- Referrer URL
- User agent string
- IP address
- Device type
- OS and browser
- Duration on page

### Activity Logging
Admin actions are logged using the `logActivity()` helper:

```typescript
import { logActivity } from '@/lib/models';

await logActivity({
  userId: user._id.toString(),
  userName: user.name,
  userEmail: user.email,
  action: 'login', // or 'create', 'delete', 'edit', etc.
  resource: 'authentication', // or 'content', 'users', etc.
  resourceId: content._id.toString(),
  details: { reason: '...' },
  status: 'success', // or 'failure', 'warning'
});
```

### Dashboard Analytics
Admin users see visitor analytics in their dashboard:
- Total visits in last 30 days
- Unique visitors
- Today's stats
- Top performing pages
- Recent activity timeline

## API Endpoints

### POST `/api/tracking`
Logs a visitor page view.

**Request:**
```json
{
  "page": "/about",
  "pageTitle": "About Us",
  "referrer": "https://google.com",
  "sessionId": "sess_1234567890_abc123"
}
```

**Response:**
```json
{
  "success": true
}
```

### GET `/api/admin/stats`
Returns comprehensive stats including visitor analytics (admin only).

**Response:**
```json
{
  "users": 10,
  "content": 50,
  "events": 5,
  "analytics": {
    "totalVisits": 1234,
    "uniqueVisitors": 567,
    "todayVisits": 45,
    "todayUniqueVisitors": 23,
    "pageStats": [
      { "_id": "/", "count": 345 },
      { "_id": "/about", "count": 123 }
    ],
    "recentVisits": [...]
  }
}
```

### GET `/api/admin/activity-logs`
Retrieves activity logs with filtering (admin only).

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page (default: 50)
- `userId` - Filter by user ID
- `action` - Filter by action type
- `resource` - Filter by resource type
- `status` - Filter by status (success/failure/warning)

## Usage Examples

### Track Custom Events
```typescript
import { useVisitorTracking } from '@/components/analytics/VisitorTracker';

function MyComponent() {
  const { trackEvent } = useVisitorTracking();

  const handleClick = () => {
    trackEvent('button_click', {
      buttonId: 'cta-button',
      location: 'hero-section'
    });
  };

  return <button onClick={handleClick}>CTA</button>;
}
```

### Log Admin Actions
```typescript
// In API route or server action
import { logActivity } from '@/lib/models';

export async function DELETE(request: Request) {
  // Delete logic...

  await logActivity({
    userId: session.user.id,
    userName: session.user.name,
    userEmail: session.user.email,
    action: 'delete',
    resource: 'content',
    resourceId: contentId,
    details: { title: content.title },
    status: 'success'
  });

  return NextResponse.json({ success: true });
}
```

### View Analytics in Dashboard
1. Login as admin
2. Go to `/admin`
3. View visitor analytics section (admin only)
4. See top pages, recent activity, and stats

## Privacy & GDPR Compliance

### Data Collected:
- **Required:** Session ID, page path, timestamp
- **Optional:** IP address, user agent, referrer
- **Not Collected:** Personal data, passwords, sensitive info

### Best Practices:
1. Add privacy policy disclosure
2. Provide opt-out mechanism
3. Anonymize IP addresses if needed
4. Implement data retention policy
5. Allow users to request data deletion

### To Disable Tracking:
Remove `<VisitorTracker />` from `app/layout.tsx`

## Database Schema

### VisitorLog
```typescript
{
  sessionId: string;        // Unique session identifier
  page: string;             // Page path
  pageTitle?: string;       // Page title
  referrer?: string;        // Referrer URL
  userAgent?: string;       // Browser user agent
  ipAddress?: string;       // Visitor IP
  location?: {              // Geographic data (optional)
    country?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  device?: {                // Device info
    type?: 'desktop' | 'mobile' | 'tablet';
    os?: string;           // Operating system
    browser?: string;      // Browser name
  };
  duration?: number;        // Time on page (seconds)
  createdAt: Date;
}
```

### ActivityLog
```typescript
{
  userId: string;
  userName: string;
  userEmail: string;
  action: string;          // Action performed
  resource: string;        // Resource type
  resourceId?: string;     // Affected resource ID
  details?: Record<string, any>;  // Additional context
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failure' | 'warning';
  createdAt: Date;
}
```

## Performance Considerations

### Optimization:
1. **Async Logging**: All tracking happens asynchronously
2. **Beacon API**: Uses `navigator.sendBeacon` for reliable tracking on page unload
3. **Indexing**: Proper database indexes for fast queries
4. **Pagination**: Large datasets are paginated
5. **Aggregation**: Stats use MongoDB aggregation for efficiency

### Monitoring:
1. Monitor database size
2. Implement data retention (e.g., 90 days)
3. Archive old logs periodically
4. Set up alerts for unusual activity

## Future Enhancements

1. **Geographic Analytics**: Country/city breakdown map
2. **Real-time Visitors**: Live visitor count
3. **Conversion Tracking**: Goal completion tracking
4. **A/B Testing**: Experiment tracking
5. **Heatmaps**: Click and scroll tracking
6. **Funnel Analysis**: Drop-off tracking
7. **Export Features**: Download analytics reports
8. **Custom Dashboards**: User-configurable dashboards
9. **Email Reports**: Weekly/monthly analytics emails
10. **API Access**: Analytics API for third-party tools

## Troubleshooting

### Tracking Not Working:
1. Check browser console for errors
2. Verify API route is accessible
3. Check MongoDB connection
4. Ensure VisitorTracker is in layout

### No Data in Dashboard:
1. Wait for some traffic to accumulate
2. Check if user has admin role
3. Verify API permissions
4. Check database connection

### High Database Size:
1. Implement data retention policy
2. Archive old logs
3. Aggregate historical data
4. Consider using time-series collections

## Security Notes

1. **Admin Only**: Analytics data is restricted to admins
2. **IP Logging**: Consider privacy implications
3. **Data Sanitization**: Remove sensitive data from logs
4. **Access Control**: All analytics endpoints require authentication
5. **Rate Limiting**: Implement rate limiting on tracking API
