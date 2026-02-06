# Greptile Setup Checklist for Buddha CEO App

Follow these steps to set up Greptile for your repository.

---

## Phase 1: Install Greptile GitHub App

### Step 1: Go to Greptile Website

1. Open your browser
2. Navigate to: **https://greptile.com/**
3. Click **"Sign in with GitHub"**

### Step 2: Authorize GitHub

1. GitHub will ask for authorization
2. Click **"Authorize Greptile"**
3. Grant necessary permissions (read repo, pull requests, etc.)

### Step 3: Install GitHub App

1. After signing in, you'll see the installation page
2. Click **"Install GitHub App"**
3. Choose installation scope:
   - ✅ **"All repositories"** OR
   - ✅ **"Only select repositories"** → choose `sumasrimallavolu/Buddha-ceo-app`

4. Click **"Install"**

**✅ Checkpoint:** You should see "Greptile installed successfully" message

---

## Phase 2: Link Repository to Greptile

### Step 4: Configure Repository

1. In Greptile dashboard, navigate to **"Repositories"**
2. Find and click on: **`sumasrimallavolu/Buddha-ceo-app`**
3. If not visible, click **"Add Repository"** and search for it

### Step 5: Enable Auto-Review

1. In repository settings, find **"Auto-Review"** section
2. Enable: **"Review pull requests automatically"**
3. Select trigger events:
   - ✅ On PR creation
   - ✅ On new commits
   - ✅ When marked ready for review
4. Select review depth: **"Medium"** (recommended)

**✅ Checkpoint:** Auto-review is now enabled for your repository

---

## Phase 3: Add Custom Context

### Step 6: Navigate to Custom Context

1. In repository settings, go to **"Custom Context"** tab
2. Click **"Add Context"** or **"New Context"**

### Step 7: Add Review Guidelines

1. **Name**: `Code Review Guidelines`
2. **Type**: Custom Instruction
3. **Scope**: All files (or specific to `**/*.ts`, `**/*.tsx`)

4. **Content**: Copy the entire contents of:
   ```
   .greptile/REVIEW_GUIDELINES.md
   ```

5. **Status**: Active

6. Click **"Save Context"**

### Step 8: Add Codebase Patterns (Optional but Recommended)

1. Click **"Add Context"** again
2. **Name**: `Codebase Architecture & Patterns`
3. **Type**: Custom Instruction
4. **Scope**: All files

5. **Content**: Copy the entire contents of:
   ```
   .greptile/CODEBASE_PATTERNS.md
   ```

6. **Status**: Active

7. Click **"Save Context"**

**✅ Checkpoint:** Custom context is now configured

---

## Phase 4: Configure Review Settings

### Step 9: Set Review Behavior

In repository **"Settings"** → **"Reviews"**:

1. **Comment Style**: ✅ "Detailed with examples"
2. **Approval**:
   - ✅ "Approve if no issues found"
   - ❌ "Don't block merge on issues"
3. **Notifications**:
   - ✅ "Comment on PR"
   - ❌ "Email notifications" (optional)

### Step 10: Configure File Patterns

1. **Include patterns**:
   ```
   **/*.ts
   **/*.tsx
   app/**/*.tsx
   components/**/*.tsx
   lib/**/*.ts
   ```

2. **Exclude patterns**:
   ```
   node_modules/**
   .next/**
   **/*.config.js
   **/*.md
   ```

**✅ Checkpoint:** Review settings configured

---

## Phase 5: Test the Integration

### Step 11: Create Test PR

Open your terminal and run:

```bash
# Create a test branch
git checkout main
git pull origin main
git checkout -b test/greptile-integration

# Create a test file with deliberate issues
cat > test-greptile.ts << 'EOF'
// This file tests Greptile's ability to catch issues

import { requireRole } from '@/lib/permissions';

// ISSUE 1: Admin should not have edit permissions
export function canEditContent(role: string) {
  // WRONG: Admin should not be able to edit
  return role === 'admin' || role === 'content_manager';
}

// ISSUE 2: Missing permission check in API route
export async function DELETE(request: Request) {
  // WRONG: No authentication or permission check
  const id = await request.json();
  return Response.json({ deleted: true });
}
EOF

# Commit and push
git add test-greptile.ts
git commit -m "test: verify Greptile catches admin permission issues"
git push origin test/greptile-integration
```

### Step 12: Create Pull Request

1. Go to GitHub: **https://github.com/sumasrimallavolu/Buddha-ceo-app**
2. You should see a banner: "test/greptile-integration recent pushes"
3. Click **"Compare & pull request"**
4. Title: `test: Verify Greptile integration`
5. Description: `Testing Greptile's ability to catch permission issues`
6. Click **"Create pull request"**

### Step 13: Wait for Greptile Review

1. Within 1-2 minutes, Greptile will post a review comment
2. Look for comments like:
   - ❌ "Admin role should not have edit permissions"
   - ❌ "Missing authentication check"

3. If you see these comments: **✅ SUCCESS!** Greptile is working!

### Step 14: Clean Up Test PR

```bash
# After confirming Greptile works:
# Close the test PR on GitHub (no need to merge)
git checkout main
git branch -D test/greptile-integration
```

---

## Phase 6: Verify Webhook (If Needed)

### Step 15: Check GitHub Webhooks

If Greptile doesn't trigger after 2-3 minutes:

1. Go to: **https://github.com/sumasrimallavolu/Buddha-ceo-app/settings/hooks**
2. Look for **Greptile** webhook
3. Check that it shows:
   - ✅ Active (green dot)
   - ✅ "Deliveries active"

4. If not active:
   - Click the webhook
   - Verify "Active" checkbox is checked
   - Check recent deliveries for errors

---

## Troubleshooting

### Issue: "Greptile not showing in GitHub Apps"

**Solution:**
- Go to https://github.com/settings/installations
- Check if Greptile is listed
- If not, reinstall from Step 1

### Issue: "Repository not found in Greptile dashboard"

**Solution:**
- Verify you installed the app for this repository
- Check GitHub repository settings → Integrations → Greptile
- Try removing and reinstalling the app

### Issue: "Greptile not reviewing PRs"

**Solution:**
1. Check if auto-review is enabled (Step 5)
2. Verify webhook is active (Step 15)
3. Check if repository is linked in Greptile dashboard (Step 4)
4. Try triggering manually: In PR, click "Request review" → select Greptile

### Issue: "Reviews not following custom context"

**Solution:**
1. Verify custom context is added (Steps 6-8)
2. Check context status is "Active"
3. Try re-saving the context
4. Contact Greptile support if issues persist

---

## Success Indicators

You'll know Greptile is set up correctly when:

- ✅ GitHub App is installed for this repository
- ✅ Repository appears in Greptile dashboard
- ✅ Auto-review is enabled
- ✅ Custom context is added and active
- ✅ Test PR receives Greptile review within 2 minutes
- ✅ Review comments reference your custom guidelines

---

## Next Steps After Setup

### 1. Monitor First Few Reviews

For the first week:
- Check each Greptile review
- Verify comments are helpful and accurate
- Note any false positives or missed issues

### 2. Refine Guidelines (After 1-2 Weeks)

Based on team feedback:
- Update `.greptile/REVIEW_GUIDELINES.md`
- Add patterns that were missed
- Remove rules causing false positives
- Re-upload to Greptile dashboard

### 3. Configure Labels (Optional)

Set up label-based review behavior:

| Label | Behavior |
|-------|----------|
| `greptile:skip` | Skip review (emergencies only) |
| `greptile:quick` | Quick review (critical rules only) |
| `greptile:thorough` | Full detailed review |

### 4. Team Onboarding

Share with your team:
- How Greptile works
- What it checks for
- How to interpret review comments
- How to update guidelines

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────┐
│  GREPTILE SETUP QUICK REFERENCE                 │
├─────────────────────────────────────────────────┤
│  1. Go to https://greptile.com/                 │
│  2. Sign in with GitHub                         │
│  3. Install GitHub App for your repo            │
│  4. Enable auto-review                          │
│  5. Add custom context from .greptile/ files    │
│  6. Test with a sample PR                       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  EXPECTED TIMING                                │
├─────────────────────────────────────────────────┤
│  PR Created    → 30-60 seconds                  │
│  New Commit    → 30-60 seconds                  │
│  Review Posted → Automatic comment on PR        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  IMPORTANT FILES                                │
├─────────────────────────────────────────────────┤
│  .greptile/REVIEW_GUIDELINES.md   → Upload to   │
│                                       Greptile   │
│  .greptile/CODEBASE_PATTERNS.md   → Upload to   │
│                                       Greptile   │
│  .greptile/SUGGESTED_SETTINGS.md   → Reference  │
└─────────────────────────────────────────────────┘
```

---

## Support & Resources

- **Greptile Docs**: https://docs.greptile.com/
- **GitHub Repo**: https://github.com/sumasrimallavolu/Buddha-ceo-app
- **Greptile Dashboard**: https://greptile.com/dashboard

---

## Checklist Summary

Copy and paste this progress tracker:

```
Greptile Setup Progress:

Phase 1: Install GitHub App
☐ Go to greptile.com
☐ Sign in with GitHub
☐ Install app for Buddha-ceo-app

Phase 2: Link Repository
☐ Find repo in Greptile dashboard
☐ Enable auto-review
☐ Configure review depth

Phase 3: Add Custom Context
☐ Add REVIEW_GUIDELINES.md
☐ Add CODEBASE_PATTERNS.md
☐ Verify contexts are active

Phase 4: Configure Settings
☐ Set review behavior
☐ Configure file patterns
☐ Set notification preferences

Phase 5: Test Integration
☐ Create test PR
☐ Verify Greptile reviews within 2 min
☐ Check comments are accurate

Phase 6: Success
☐ Greptile is working! 🎉
```

---

**Ready to start?** Begin with Phase 1, Step 1: Go to https://greptile.com/

Good luck! 🚀
