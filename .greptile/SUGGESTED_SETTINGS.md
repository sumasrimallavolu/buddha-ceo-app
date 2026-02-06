# Greptile Configuration for Buddha CEO App

## Recommended Settings

### Review Triggers

**✅ Enable:**
- [x] Review on PR creation (immediate)
- [x] Review on new commits (automatic)
- [x] Review when PR is marked "Ready for review"

**❌ Disable:**
- [ ] Review on draft PRs (wait until ready)
- [ ] Review on every single push (can be noisy - consider batching)

### Review Depth

**Medium** (recommended)
- Full review of changed files
- Checks all must-enforce rules
- ~1-2 minutes for typical PRs

**Options:**
- **Quick**: Only critical rules (admin permissions, security)
- **Medium**: Critical + styling + code quality (RECOMMENDED)
- **Thorough**: Everything including performance, organization suggestions

### Notification Settings

**✅ Enable:**
- [x] Comment on PR when review complete
- [x] Post review summary with "Request Changes" if issues found
- [x] Approve if no issues found

**❌ Optional:**
- [ ] Slack/Discord notifications (if team uses these)
- [ ] Email notifications (can be noisy)

### Comment Style

**Recommended: Constructive with examples**

Example format:
```
❌ ISSUE: Admin role should not have edit permissions

The admin role is view-only for content, events, and resources.

**Current code:**
```typescript
if (session?.user?.role === 'admin' || session?.user?.role === 'content_manager') {
  return <EditButton />;
}
```

**Suggested fix:**
```typescript
if (session?.user?.role === 'content_manager') {
  return <EditButton />;
}
```

See: .greptile/REVIEW_GUIDELINES.md section 1
```

### File Patterns to Review

**Include** (all TypeScript/TSX files):
```
**/*.ts
**/*.tsx
**/api/**/*.ts
**/app/**/*.tsx
**/components/**/*.tsx
**/lib/**/*.ts
```

**Exclude** (reduce noise):
```
**/node_modules/**
**/.next/**
**/dist/**
**/*.config.js
**/*.config.ts
**/package.json
**/yarn.lock
**/*.md
```

### Review Approval Behavior

**Require Greptile Approval** (Optional):
- [ ] Block merge if Greptile finds issues
- [x] Allow merge with Greptile suggestions (team can override)

**Recommended**: Don't block merge - let human reviewers decide

### Priority Rules

Greptile will enforce these in order:

**1. CRITICAL** (Must fix):
- Admin with edit/delete permissions
- Missing authentication on API routes
- Admin pages in analytics
- Security vulnerabilities

**2. HIGH** (Should fix):
- Dark theme violations
- Next.js 15 compatibility issues
- TypeScript errors
- Hook order violations

**3. MEDIUM** (Consider fixing):
- Missing error handling
- No database indexes
- Inconsistent styling

**4. LOW** (Nice to have):
- Code organization
- Performance optimizations
- Naming conventions

### Team Workflow

**Developer Flow:**
1. Create feature branch
2. Make changes
3. Push to GitHub
4. Greptile auto-reviews within 1-2 minutes
5. Fix any critical/high issues
6. Mark PR as "Ready for review"
7. Human reviewer reviews
8. Merge after approval

**Reviewer Flow:**
1. Wait for Greptile review to complete
2. Check Greptile comments
3. Verify critical issues are addressed
4. Do human review (logic, UX, business rules)
5. Approve or request changes

### Batch Review Mode

For active development periods:

**Enable batch mode** when:
- Multiple commits pushed in quick succession
- Developer is actively working on PR
- Want to reduce review noise

**Settings:**
- Wait 5-10 minutes after last push
- Review all commits together
- Single review comment at the end

### Draft PR Behavior

**Recommended:**
- **Don't** review draft PRs
- Wait until PR marked "Ready for review"
- Reduces noise for work-in-progress

**Rationale:**
- Drafts are often incomplete
- Developers may be experimenting
- Reviews on drafts can be frustrating

### Weekend/After-Hours

**Option: Delay reviews**

If team works across time zones:
- Delay reviews until working hours
- Batch multiple PRs together
- Reduce notification noise

### Label-Based Triggers

**Configure label-based reviews:**

| PR Label | Behavior |
|----------|----------|
| `greptile:skip` | Don't review (rare, for emergencies) |
| `greptile:quick` | Quick review only (critical rules) |
| `greptile:thorough` | Full detailed review |
| (no label) | Standard medium review (default) |

---

## Example Timeline

### Typical PR Workflow:

```
[2:00 PM]  Developer pushes commit 1
           → Greptile starts reviewing

[2:02 PM]  Greptile review complete
           → Comments: "Found 3 issues"

[2:05 PM]  Developer pushes commit 2 (fixes)
           → Greptile reviews new changes

[2:07 PM]  Greptile review complete
           → Comments: "No issues found ✅"

[2:10 PM]  Developer marks PR "Ready for review"
           → Human reviewer notified

[2:15 PM]  Human reviewer reviews
           → Approves PR

[2:20 PM]  PR merged
```

### With Draft Mode:

```
[Day 1]    Developer creates draft PR
           → Greptile waits (no review)

[Day 2]    Developer pushes to draft
           → Greptile still waits

[Day 3]    Developer marks "Ready for review"
           → Greptile reviews immediately

[Day 3]    Review complete in 2 minutes
           → Comments posted
```

---

## Troubleshooting Timing Issues

### Greptile takes too long (> 5 minutes)

**Possible causes:**
1. PR is very large (1000+ files)
2. Custom context is too large
3. Greptile service is busy

**Solutions:**
- Break large PR into smaller PRs
- Simplify custom context
- Check Greptile status page

### Greptile doesn't trigger

**Check:**
1. GitHub webhook is active
2. Repository is linked in Greptile
3. Auto-review is enabled
4. PR isn't being filtered by label

### Greptile reviews outdated commit

**Cause:** Race condition - new commit pushed before review complete

**Solution:**
- Greptile will review the latest commit automatically
- Old review comments will be outdated
- Developer can dismiss stale comments

---

## Monitoring

### Metrics to Track:

- **Average review time**: Should be < 2 minutes
- **False positive rate**: Should be < 10%
- **Issues found per PR**: Varies by project
- **Team satisfaction**: Regular feedback

### Adjust Settings Based on Metrics:

**If reviews take too long:**
- Reduce review depth to "Quick"
- Enable batch mode
- Simplify custom context

**If too many false positives:**
- Refine guidelines (be more specific)
- Move some rules to LOW priority
- Whitelist common patterns

**If team finds it useful:**
- Keep current settings
- Add more rules over time
- Expand to more repositories

---

## Summary

**Recommended Configuration:**
- ✅ Auto-review on PR creation
- ✅ Auto-review on new commits
- ❌ Skip draft PRs
- ✅ Medium review depth
- ✅ Post comments with examples
- ❌ Don't block merge on Greptile findings
- ✅ All TypeScript/TSX files

**Expected Timing:**
- Small PRs: ~30-60 seconds
- Medium PRs: ~1-2 minutes
- Large PRs: ~3-5 minutes

**Trigger Points:**
- PR creation
- New commits
- Ready for review transition
