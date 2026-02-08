# Fixing 404 Error for Feedback API

## Quick Fix Steps

### 1. Clear All Caches and Restart

```bash
# Stop the dev server (Ctrl+C)

# Clear Next.js cache
rm -rf .next

# Clear node_modules/.cache (optional)
rm -rf node_modules/.cache

# Restart dev server
npm run dev
```

### 2. Verify Routes Are Registered

After restarting, visit:
```
http://localhost:3000/api/test-db
```

This should show:
- Database connection status
- All available models (should include EventFeedback: true)
- All collections

### 3. Check if Event Exists

Before submitting feedback, make sure the event ID is valid:

```bash
# In MongoDB shell or Compass
db.events.findOne({_id: ObjectId("YOUR_EVENT_ID")})
```

Or visit: `http://localhost:3000/api/events/public/YOUR_EVENT_ID`

### 4. Test the Feedback Endpoint

**Correct URL format:**
```
POST http://localhost:3000/api/events/EVENT_ID/feedback
GET http://localhost:3000/api/events/EVENT_ID/feedback
```

**Common mistakes:**
- ❌ `/api/event/EVENT_ID/feedback` (wrong - missing 's')
- ❌ `/api/events/feedback/EVENT_ID` (wrong - wrong order)
- ✅ `/api/events/EVENT_ID/feedback` (correct!)

### 5. Check Browser Console

Open browser DevTools (F12):
1. Go to Network tab
2. Make request
3. Check:
   - Request URL
   - Status code
   - Response body

### 6. Check Server Logs

Look at terminal where `npm run dev` is running for errors.

## Common Issues & Solutions

### Issue 1: "EventFeedback model not found"
**Solution**: Clear .next cache and restart

### Issue 2: "Event not found"
**Solution**: Verify event ID exists in database

### Issue 3: Route not registered
**Solution**: Run `npm run build` and check for `/api/events/[id]/feedback` in route list

### Issue 4: Getting 404 on GET
**Solution**: Make sure you're using correct event ID and URL format

## Testing with curl

```bash
# Test GET (should work even without auth)
curl http://localhost:3000/api/events/PASTE_EVENT_ID_HERE/feedback

# Test POST (requires auth cookie - use browser)
curl -X POST http://localhost:3000/api/events/PASTE_EVENT_ID_HERE/feedback \
  -H "Content-Type: application/json" \
  -d '{"type":"comment","comment":"Test comment"}'
```

## Verify Model Works

Visit this test endpoint:
```
http://localhost:3000/api/test-db
```

Should return:
```json
{
  "database": {
    "state": 1,
    "stateName": "connected",
    "models": {
      "EventFeedback": true,
      "Event": true,
      "Registration": true
    }
  }
}
```

If EventFeedback is false, the model isn't loading. Clear cache and restart.
