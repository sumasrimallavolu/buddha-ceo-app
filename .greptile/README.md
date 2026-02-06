# Greptile Integration for Buddha CEO App

## What is Greptile?

Greptile is an AI-powered code review tool that integrates with GitHub to provide automated PR reviews. It learns your codebase patterns and provides intelligent feedback on pull requests.

## Files Created

I've created three configuration files in the `.greptile/` directory:

### 1. `CODEBASE_PATTERNS.md`
Comprehensive documentation of all code patterns, conventions, and architecture used in this project. This is the complete reference guide.

### 2. `REVIEW_GUIDELINES.md`
Concise review guidelines for Greptile to use when reviewing PRs. Contains:
- Must-enforce rules (admin restrictions, dark theme, etc.)
- Code quality standards
- Common issues to flag
- Review priorities

### 3. `README.md` (this file)
Instructions for setting up and using Greptile with this project.

---

## How to Set Up Greptile

### Option 1: Web Dashboard (Recommended)

1. **Go to https://greptile.com/**
   - Sign in with your GitHub account

2. **Install Greptile GitHub App**
   - Click "Install GitHub App"
   - Select your repository: `sumasrimallavolu/Buddha-ceo-app`
   - Choose "All repositories" or select just this one

3. **Configure Custom Context**
   - Navigate to your repository in Greptile dashboard
   - Go to "Custom Context" or "Settings"
   - Add the contents of `.greptile/REVIEW_GUIDELINES.md` as custom context
   - Optionally add `.greptile/CODEBASE_PATTERNS.md` for more detailed context

4. **Configure Review Settings**
   - Enable automatic PR reviews
   - Set review criteria based on the guidelines in `REVIEW_GUIDELINES.md`
   - Configure notification preferences

5. **Test the Integration**
   - Create a test branch: `git checkout -b test/greptile-review`
   - Make a small change
   - Push and create a PR
   - Greptile should automatically review the PR

### Option 2: Greptile CLI

```bash
# Install Greptile CLI
npm install -g @greptile/cli

# Authenticate
greptile login

# Link repository
greptile link --repo sumasrimallavolu/Buddha-ceo-app

# Add custom context
greptile context add --file .greptile/REVIEW_GUIDELINES.md

# Trigger manual review (if not auto-enabled)
greptile review --pr <pr-number>
```

---

## Key Patterns Greptile Will Enforce

### 1. Admin Role Permissions (CRITICAL)
- ✅ Admin can **view** content, events, resources
- ❌ Admin **cannot** create, edit, or delete content/events/resources
- ✅ Admin can delete subscribers and messages
- ✅ Admin can review and publish content

### 2. Dark Theme Styling
- All form components use `bg-white/5`, `border-white/10`
- Focus states use `border-blue-500/50`, `ring-blue-500/20`
- Text uses `text-white`, `text-slate-300`, `text-slate-500`

### 3. Analytics Exclusions
- Visitor analytics **must** exclude admin pages
- Use `page: { $not: /^\/admin/ }` filter

### 4. API Route Security
- All routes check permissions with `requireRole()` or `requirePermission()`
- DELETE/PUT use query parameters (Next.js 15+ pattern)
- Error handling checks for `NEXT_REDIRECT`

---

## Testing Greptile Integration

### Create a Test PR

```bash
# Create a test branch
git checkout -b test/greptile-integration

# Make a deliberate mistake (e.g., add edit button for admin)
# In a component, add:
if (session?.user?.role === 'admin' || session?.user?.role === 'content_manager') {
  return <EditButton />;
}

# Commit and push
git add .
git commit -m "test: add edit permissions for admin (should be flagged)"
git push origin test/greptile-integration

# Create PR on GitHub
# Greptile should flag this as an issue
```

### Expected Greptile Feedback

Greptile should comment:
```
❌ ISSUE: Admin role should not have edit permissions

The admin role is view-only for content, events, and resources.
Please change this to:

if (session?.user?.role === 'content_manager') {
  return <EditButton />;
}

See .greptile/REVIEW_GUIDELINES.md section 1 for details.
```

---

## Custom Context Updates

When you add new patterns or conventions to the codebase:

1. Update `.greptile/CODEBASE_PATTERNS.md` with the new pattern
2. Update `.greptile/REVIEW_GUIDELINES.md` if it's a must-enforce rule
3. Re-sync custom context in Greptile dashboard:
   - Go to repository settings
   - Update the custom context with new file contents
   - Greptile will use updated context for future reviews

---

## Monitoring Greptile Reviews

### View Review Comments
```bash
# Using gh CLI (if installed)
gh pr view <pr-number> --comments
```

### Review Analytics
- Check Greptile dashboard for review statistics
- Track common issues being flagged
- Update guidelines based on team feedback

---

## Troubleshooting

### Greptile Not Reviewing PRs

1. **Check GitHub App Installation**
   - Go to GitHub Settings → Integrations → Greptile
   - Ensure repository is selected

2. **Check Webhooks**
   - Repository Settings → Webhooks
   - Greptile webhook should be active

3. **Check Greptile Dashboard**
   - Ensure repository is linked
   - Check if auto-review is enabled

### Reviews Not Following Guidelines

1. **Verify Custom Context**
   - Check that guidelines are uploaded
   - Ensure context is active (not disabled)

2. **Clear Context Cache**
   - In Greptile dashboard, force context refresh
   - Re-upload guidelines if needed

### Too Many False Positives

1. **Refine Guidelines**
   - Update `REVIEW_GUIDELINES.md` to be more specific
   - Move some rules from "Must-Enforce" to "Suggestions"

2. **Adjust Greptile Settings**
   - Lower review sensitivity
   - Whitelist certain file patterns

---

## Example Workflows

### Workflow 1: Developer Creates PR

1. Developer creates feature branch
2. Makes changes following patterns in `CODEBASE_PATTERNS.md`
3. Pushes and creates PR
4. Greptile automatically reviews
5. If issues found, developer fixes and pushes
6. Once Greptile approves, human reviewer reviews
7. Merge after approval

### Workflow 2: Manual Review Trigger

```bash
# After creating PR, manually trigger Greptile
greptile review --pr 123

# Or wait for automatic review (if enabled)
```

---

## Best Practices

1. **Keep Guidelines Updated**
   - Review and update monthly
   - Add new patterns as they emerge
   - Remove outdated rules

2. **Team Alignment**
   - Share guidelines with team
   - Discuss any pattern changes
   - Get consensus on rules

3. **Gradual Rollout**
   - Start with high-priority rules only
   - Add more rules over time
   - Monitor feedback and adjust

4. **Human Review Still Required**
   - Greptile is a helper, not a replacement
   - Human reviewers should still check:
     - Business logic correctness
     - UX/UI quality
     - Performance considerations
     - Security beyond permissions

---

## Resources

- **Greptile Website**: https://greptile.com/
- **GitHub Repository**: https://github.com/sumasrimallavolu/Buddha-ceo-app
- **Documentation**: `.greptile/CODEBASE_PATTERNS.md`
- **Review Guidelines**: `.greptile/REVIEW_GUIDELINES.md`

---

## Questions?

If you have issues with Greptile integration:

1. Check Greptile documentation: https://docs.greptile.com/
2. Review GitHub App settings
3. Verify custom context is properly uploaded
4. Check webhooks are active in repository settings
