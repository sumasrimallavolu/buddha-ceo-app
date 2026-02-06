# GitHub Actions CI/CD Workflows

This directory contains automated workflows for validating, testing, and deploying the Buddha CEO App.

## 📁 Workflow Files

| File | Purpose | Trigger |
|------|---------|---------|
| `ci-cd.yml` | Full CI/CD pipeline with deployment | Push to main, PRs, manual |
| `pr-validation.yml` | Quick PR validation checks | PR opened/updated |

---

## 🚀 Quick Start

```bash
# Run the setup helper
bash scripts/setup-ci-cd.sh
```

This will:
1. Install Vercel CLI (if needed)
2. Link your Vercel project
3. Display credentials to add to GitHub
4. Open browser to create Vercel token

---

## 📖 Documentation

See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for:
- Complete setup instructions
- Workflow stages explained
- Customization options
- Troubleshooting guide

---

## 🔄 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     TRIGGER: Push/PR                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  JOB 1: validate (30-60 sec)                                │
│  ✅ TypeScript check                                        │
│  ✅ ESLint check                                            │
│  ✅ Custom permission checks                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  JOB 2: theme-check (10 sec)                                │
│  ✅ Dark theme consistency                                  │
│  ✅ No light theme classes                                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  JOB 3: build (1-2 min)                                     │
│  ✅ Production build                                        │
│  ✅ Upload artifacts                                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                    ┌────┴────┐
                    │         │
                    ▼         ▼
         ┌──────────────┐  ┌──────────────┐
         │ JOB 4: test  │  │ JOB 5:       │
         │ (1-3 min)    │  │ security     │
         │ ✅ E2E tests │  │ ✅ npm audit │
         │ ✅ Playwright│  │ ✅ TruffleHog│
         └──────┬───────┘  └──────┬───────┘
                │                 │
                └────────┬────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │ JOB 6: deploy (1-2 min)       │
         │                               │
         │  PR?  → Preview deployment 🔮 │
         │  Main? → Production deploy 🚀 │
         └───────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │ JOB 7: notify                 │
         │ ✅ Comment on PR              │
         │ ✅ Deployment URL             │
         └───────────────────────────────┘

Total Time: 3-5 minutes
```

---

## 🎯 What Gets Validated

### Permission Checks ✅
- ❌ Admin cannot edit/create/delete content, events, resources
- ✅ Admin can view, review, delete subscribers/messages
- ✅ Permission checks on all API routes

### Code Quality ✅
- TypeScript strict mode
- ESLint rules
- No console.logs in production code

### Theme Consistency ✅
- Dark theme classes only
- No light theme (bg-white, border-gray)
- Proper focus states
- Status badge colors

### Security ✅
- npm audit for vulnerabilities
- Secret scanning
- Admin pages excluded from analytics

### Best Practices ✅
- Next.js 15 API patterns
- React hooks order
- Error handling
- MongoDB indexes

---

## 📊 Workflow Status Badges

Add these to your README.md:

```markdown
![CI/CD Pipeline](https://github.com/sumasrimallavolu/Buddha-ceo-app/workflows/CI%2FCD%20Pipeline/badge.svg)
![PR Validation](https://github.com/sumasrimallavolu/Buddha-ceo-app/workflows/PR%20Validation/badge.svg)
```

---

## 🔧 Required GitHub Secrets

These must be configured in repository settings:

| Secret | Description | Required For |
|--------|-------------|--------------|
| `VERCEL_TOKEN` | Vercel authentication token | Deployment |
| `VERCEL_ORG_ID` | Vercel organization ID | Deployment |
| `VERCEL_PROJECT_ID` | Vercel project ID | Deployment |

Run `bash scripts/setup-ci-cd.sh` to get these values.

---

## 🚦 Deployment Environments

| Environment | Trigger | URL | Protection |
|-------------|---------|-----|------------|
| **Production** 🚀 | Push to `main` | Your Vercel URL | All checks must pass |
| **Preview** 🔮 | Pull requests | Unique per PR | All checks must pass |

---

## 📝 Example Workflow Output

### Successful PR Validation

```
⚡ Quick Validation
✅ TypeScript check
✅ ESLint check
✅ Permissions check
✅ Theme check
✅ Analytics check
✅ API patterns

🔮 **Preview Deployment Ready**

📍 Preview URL: https://buddha-ceo-app-abc123.vercel.app

✅ All checks passed!
```

### Failed Validation

```
❌ Validation Failed

- TypeScript: ❌ Found 3 errors
- ESLint: ✅ Passed
- Permissions: ❌ Admin has edit permissions (components/admin/ContentEditModal.tsx:45)
- Theme: ⚠️ Light theme detected (components/home/Testimonials.tsx:12)
```

---

## 🛠️ Customization

### Add Custom Validation

Edit `.github/workflows/pr-validation.yml`:

```yaml
- name: Check for something custom
  run: |
    if git grep "your-pattern"; then
      echo "❌ Custom check failed"
      exit 1
    fi
```

### Change Node Version

Edit workflow files:

```yaml
env:
  NODE_VERSION: '20'  # Change this
```

### Skip Deploy for Testing

Comment out deploy jobs:

```yaml
# - name: Deploy to Vercel
#   run: vercel deploy...
```

---

## 🐛 Troubleshooting

### Workflow Not Triggering

1. Check file is in `.github/workflows/`
2. Verify GitHub Actions is enabled
3. Check branch name matches trigger

### Deploy Fails

1. Verify GitHub secrets are set
2. Check Vercel token is valid
3. Run `bash scripts/setup-ci-cd.sh` again

### Permission Check False Positives

Edit regex in `pr-validation.yml` to be more specific.

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Vercel Deployment Guide](https://vercel.com/docs/deployments/overview)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## 🎓 Next Steps

1. ✅ Run `bash scripts/setup-ci-cd.sh`
2. ✅ Add secrets to GitHub
3. ✅ Create test PR to validate
4. ✅ Merge to main to deploy
5. ✅ Monitor Actions tab

**Estimated time from code to production: 3-5 minutes** ⚡
