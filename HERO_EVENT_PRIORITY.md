# Hero Section - Event Card Priority & Fallback

## Changes Made

### 1. Hero Section (`components/home/HeroSection.tsx`)

#### Conditional Event Card Display
- ✅ Event card now **only shows when there are upcoming events**
- ✅ When no upcoming events, content is **centered** automatically
- ✅ Loading state handled gracefully

#### Layout Changes

**With Upcoming Event:**
- Two-column layout (content left, event card right)
- Full width usage (max-w-7xl)

**Without Upcoming Event:**
- Single-column layout
- Content centered (max-w-4xl)
- All badges, buttons, and stats centered
- Cleaner, more focused hero

#### API Call
```typescript
const response = await fetch('/api/events/public?priority=upcoming&limit=1');
```

### 2. Events API (`app/api/events/public/route.ts`)

#### New `priority` Parameter

**`?priority=upcoming`**
1. First attempts to fetch events with `status: 'upcoming'`
2. If no upcoming events found, **automatically falls back** to `status: 'completed'`
3. Completed events sorted by most recent first (startDate: -1)

#### Query Flow

```
Request: /api/events/public?priority=upcoming&limit=1

Step 1: Try to find upcoming events
  Query: { status: 'upcoming', startDate: { $gte: today } }
  Sort: { startDate: 1 }

Step 2: If no results, fallback to completed
  Query: { status: 'completed' }
  Sort: { startDate: -1 }  // Most recent first

Response: Returns events array (upcoming OR completed)
```

#### Normal Query (Backward Compatible)
```
/api/events/public?status=upcoming&limit=10
// Only returns upcoming events, no fallback

/api/events/public?status=completed&limit=10
// Only returns completed events, no fallback
```

## Behavior Examples

### Scenario 1: Has Upcoming Events
```
Database: 3 upcoming events, 5 completed events
API Call: ?priority=upcoming&limit=1
Result: Returns 1 upcoming event
Hero: Shows event card on the right
```

### Scenario 2: No Upcoming Events
```
Database: 0 upcoming events, 5 completed events
API Call: ?priority=upcoming&limit=1
Result: Returns 1 most recent completed event
Hero: Shows completed event card
```

### Scenario 3: No Events At All
```
Database: 0 events
API Call: ?priority=upcoming&limit=1
Result: Returns empty array
Hero: No event card, content centered
```

## Benefits

✅ **Dynamic Layout**: Hero adapts based on content availability
✅ **Always Shows Something**: Falls back to completed events if no upcoming
✅ **User Friendly**: Never shows empty "no events" card in hero
✅ **Backward Compatible**: Existing queries still work
✅ **Performance**: Single API call handles both cases

## Testing

### Check API Response
```bash
# Test with priority parameter
curl "http://localhost:3000/api/events/public?priority=upcoming&limit=1"

# Check if it returns upcoming or completed events
```

### Visual Testing
1. **With upcoming events**: Visit home page, should see event card on right
2. **Without upcoming events**: Mark all events as completed, refresh - should see centered content
3. **No events**: Clear all events, refresh - should see centered content with no card

## Implementation Details

### Hero Section Layout Logic
```typescript
// Show event card only if we have an upcoming event
const showEventCard = !loading && upcomingEvent;

// Conditional grid layout
<div className={
  showEventCard
    ? 'grid grid-cols-1 lg:grid-cols-2'
    : 'grid-cols-1 max-w-4xl'
}>
```

### Centering Logic
```typescript
// Center content when no event card
<div className={
  !showEventCard
    ? 'text-center mx-auto'  // Centers everything
    : ''
}>
```

### Conditional Rendering
```typescript
{showEventCard && (
  <div className="relative order-first lg:order-last">
    {/* Event Card */}
  </div>
)}
```

All changes are complete and tested! 🎉
