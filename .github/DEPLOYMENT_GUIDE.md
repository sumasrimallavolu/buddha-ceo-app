# CI/CD Deployment Guide for Buddha CEO App

## Overview

This repository now includes **GitHub Actions workflows** that automatically validate, test, and deploy your code in a single session.

---

## 📁 Workflow Files

### 1. `.github/workflows/ci-cd.yml` - Main Pipeline
**Triggers:**
- Push to `main` branch
- Pull requests to `main` or `develop`
- Manual trigger (workflow_dispatch)

**Jobs:**
```
validate → theme-check → build → security → deploy
    ↓          ↓            ↓         ↓
 test ───────────────────────────────┘
```

### 2. `.github/workflows/pr-validation.yml` - Quick PR Check
**Triggers:**
- Pull request opened/synchronized/reopened

**Jobs:**
- ⚡ Quick validation (TypeScript, ESLint, custom checks)
- 📝 Comments results on PR

---

## 🚀 Setup Instructions

### Step 1: Configure GitHub Secrets

Go to: **Repository Settings** → **Secrets and variables** → **Actions**

Add the following secrets:

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `VERCEL_TOKEN` | Vercel authentication token | See below |
| `VERCEL_ORG_ID` | Vercel organization ID | See below |
| `VERCEL_PROJECT_ID` | Vercel project ID | See below |

#### Getting Vercel Credentials

1. **Install Vercel CLI** (if not installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Link your project** (in project directory):
   ```bash
   vercel link
   ```

4. **Get credentials**:
   ```bash
   # Display all credentials
   cat .vercel/project.json

   # You'll see output like:
   # {
   #   "orgId": "team_xxxxxxxxxxxx",
   #   "projectId": "prj_xxxxxxxxxxxx"
   # }

   # Get token
   vercel token create
   ```

5. **Add to GitHub**:
   - `VERCEL_ORG_ID` = Copy `orgId` from above
   - `VERCEL_PROJECT_ID` = Copy `projectId` from above
   - `VERCEL_TOKEN` = Copy token from `vercel token create`

### Step 2: Enable GitHub Actions

1. Go to: **Repository Settings** → **Actions** → **General**
2. Under **Actions permissions**, select:
   - ✅ "Allow all actions and reusable workflows"
3. Click **Save**

### Step 3: Test the Workflow

**Option A: Test on main branch**
```bash
git checkout main
git pull
# Make a small change
echo "# Test" > test.md
git add test.md
git commit -m "test: trigger CI/CD"
git push origin main
```

**Option B: Create a test PR**
```bash
git checkout -b test/ci-cd
# Make changes
git add .
git commit -m "test: validate CI/CD"
git push origin test/ci-cd
# Create PR on GitHub
```

---

## 📊 Workflow Stages

### Stage 1: Validation 🔍

Runs on every commit/PR:

- **TypeScript Check**: Validates all types
- **ESLint**: Checks code quality
- **Custom Checks**:
  - ❌ Admin with edit/delete permissions
  - ❌ Light theme classes (bg-white, border-gray)
  - ⚠️ Analytics without admin filtering
  - ❌ Next.js 14 API patterns

**Time**: ~30-60 seconds

### Stage 2: Theme Check 🎨

- Runs theme consistency script
- Validates dark theme usage
- Checks for light theme violations

**Time**: ~10 seconds

### Stage 3: Build 🏗️

- Production build of Next.js app
- Uploads build artifacts
- Validates build output

**Time**: ~1-2 minutes

### Stage 4: Testing 🧪

- Runs Playwright E2E tests (if available)
- Uploads test reports and videos

**Time**: ~1-3 minutes

### Stage 5: Security Scan 🔒

- npm audit for vulnerabilities
- Secret scanning with TruffleHog

**Time**: ~30 seconds

### Stage 6: Deploy 🚀

**On main branch push:**
- Deploys to Vercel production
- Comments URL on PR

**On PR:**
- Deploys preview to Vercel
- Comments preview URL on PR

**Time**: ~1-2 minutes

---

## 📈 Workflow Status

### Success ✅

```
✅ validate
✅ theme-check
✅ build
✅ test
✅ security
✅ deploy → https://your-app.vercel.app
```

### Failure ❌

If any job fails:
- Workflow stops
- No deployment occurs
- PR gets comment with failure details
- Fix issues and push again

---

## 🎯 Deployment Environments

### Production 🚀

- **Trigger**: Push to `main` branch
- **URL**: Your production Vercel URL
- **Protection**: All checks must pass

### Preview 🔮

- **Trigger**: Pull requests
- **URL**: Unique preview URL for each PR
- **Auto-deleted**: After PR merge/close

---

## 🛠️ Customization

### Change Node Version

Edit `.github/workflows/ci-cd.yml`:

```yaml
env:
  NODE_VERSION: '20'  # Change to desired version
```

### Add More Tests

Add to the `test` job:

```yaml
- name: Run unit tests
  run: npm test
```

### Skip Certain Checks

Comment out jobs you don't need:

```yaml
# - name: Run Playwright tests
#   run: npx playwright test
```

### Add Notification

Add Slack/Discord notifications:

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Deployment complete!'
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 🔍 Monitoring Workflows

### View Workflow Runs

1. Go to repository on GitHub
2. Click **Actions** tab
3. See all workflow runs with status

### Download Artifacts

1. Click on a workflow run
2. Scroll to **Artifacts** section
3. Download:
   - `build-output` - Production build
   - `playwright-report` - Test results
   - `playwright-videos` - Test recordings

### View Logs

1. Click on workflow run
2. Click on job name
3. Expand steps to see logs

---

## 🐛 Troubleshooting

### Workflow Not Triggering

**Check:**
1. Workflow file is in `.github/workflows/`
2. Branch name matches trigger (`main`)
3. GitHub Actions is enabled

### Build Fails but Local Works

**Common causes:**
1. Environment variables not set
2. Node version mismatch
3. Missing dependencies

**Solution:**
```yaml
- name: Debug environment
  run: |
    echo "Node version: $(node --version)"
    echo "NPM version: $(npm --version)"
    env | sort
```

### Vercel Deploy Fails

**Check:**
1. `VERCEL_TOKEN` is valid
2. `VERCEL_ORG_ID` matches your team
3. `VERCEL_PROJECT_ID` is correct

**Re-link if needed:**
```bash
vercel link --yes
```

### Permission Check Failures

If you get false positives:

1. Check the regex patterns in `.github/workflows/pr-validation.yml`
2. Adjust patterns to be more specific
3. Comment out overly strict checks

---

## 📝 Best Practices

### 1. Branch Protection

Enable on `main` branch:

**Settings** → **Branches** → **Add rule**

- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ❌ Do not bypass (force push)

### 2. Required Checks

Select these as required:
- `validate`
- `theme-check`
- `build`
- `security`

### 3. Deployment Safety

- ✅ Only deploy from `main` branch
- ✅ All checks must pass first
- ✅ Preview URLs for PRs
- ✅ Rollback available in Vercel

### 4. Monitoring

- Check workflow runs regularly
- Address failing tests promptly
- Keep dependencies updated
- Review security scan results

---

## 🚦 Quick Reference

| Event | Workflow | Result |
|-------|----------|--------|
| Push to main | ci-cd.yml | Production deploy |
| Open PR | pr-validation.yml | Quick check |
| PR updated | pr-validation.yml | Re-validate |
| PR + main | ci-cd.yml | Preview deploy |
| Manual trigger | Either | On-demand |

---

## 🎓 Example Workflow Timeline

```
[2:00 PM]  Developer pushes to feature branch
           → PR validation starts

[2:01 PM]  Validation complete (45 seconds)
           → Comment: "✅ All checks passed"

[2:05 PM]  Developer creates PR
           → CI/CD pipeline starts

[2:06 PM]  Validate + Theme check + Build
           → All pass ✅

[2:08 PM]  Deploy preview to Vercel
           → Comment: "🔮 Preview URL: https://..."

[2:15 PM]  Developer approves PR
           → Merge to main

[2:16 PM]  CI/CD runs on main
           → Full pipeline + production deploy

[2:18 PM]  Deploy complete
           → Comment: "🚀 Deployed: https://your-app.vercel.app"
```

---

## 📚 Resources

- **GitHub Actions Docs**: https://docs.github.com/actions
- **Vercel CLI Docs**: https://vercel.com/docs/cli
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

## Summary

With these workflows, you now have:

✅ **Automated validation** on every PR
✅ **Theme consistency** checks
✅ **Permission enforcement** validation
✅ **Automated testing** (if tests exist)
✅ **Security scanning** on every build
✅ **Automated deployment** to production/preview
✅ **Status comments** on PRs

**Total time from push to deploy**: ~3-5 minutes

**Peace of mind**: Code is always validated before deployment 🚀
