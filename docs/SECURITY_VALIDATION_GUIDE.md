# Security Validation System

Complete security validation framework for the Buddha CEO App with automated checks, CI/CD integration, and local development tools.

---

## 📁 Components

### 1. **Bash Script** - `scripts/security-validation.sh`
Fast bash-based security scanner for quick checks.

**Features:**
- Hardcoded secrets detection
- SQL/NoSQL injection checks
- XSS vulnerability scanning
- Authentication/authorization validation
- Environment variable exposure
- CORS configuration
- Password security
- Session security
- Dependency vulnerabilities (npm audit)

**Usage:**
```bash
npm run security:check
# or
bash scripts/security-validation.sh
```

### 2. **TypeScript Validator** - `scripts/security-validator.ts`
Advanced TypeScript-based validator with detailed reporting.

**Features:**
- All bash script features
- Structured issue reporting
- Categorized findings
- Recommendations for fixes
- JSON output support
- CI/CD integration ready

**Usage:**
```bash
npx tsx scripts/security-validator.ts
```

### 3. **GitHub Actions Workflow** - `.github/workflows/security-validation.yml`
Automated security scanning on every PR and push.

**Triggers:**
- Pull requests (opened, updated, reopened)
- Push to main/develop
- Daily scheduled scan (2 AM UTC)
- Manual trigger

**Jobs:**
- `security-scan` - Main security checks
- `dependency-check` - Dependency vulnerability scanning
- `code-quality-check` - Code quality security checks

### 4. **PR Validation Integration**
Security checks integrated into `.github/workflows/pr-validation.yml`.

**Checks on every PR:**
- Quick security validation
- Hardcoded secrets detection
- eval() usage detection
- dangerouslySetInnerHTML checks

---

## 🔒 Security Checks

### Critical Issues (❌)

These will **block deployment**:

1. **Hardcoded Secrets**
   - API keys, tokens, passwords
   - Database connection strings
   - Private keys

2. **Injection Vulnerabilities**
   - MongoDB injection ($where, $ne with user input)
   - Unsanitized user input in queries
   - eval() or Function() usage

3. **XSS Vulnerabilities**
   - dangerouslySetInnerHTML without sanitization
   - User input in HTML attributes

4. **Authentication Issues**
   - Missing authentication on API routes
   - Passwords stored without hashing

### Warnings (⚠️)

These should be reviewed:

1. **Environment Variables**
   - Sensitive data in NEXT_PUBLIC_ vars
   - Console logging sensitive data

2. **Code Quality**
   - ESLint disabled
   - User-provided image URLs
   - Weak password requirements

3. **Session Security**
   - Missing session expiration
   - Insecure cookie settings

4. **CORS**
   - No CORS configuration

---

## 🚀 Quick Start

### Local Development

Run security checks before committing:

```bash
# Quick bash script
npm run security:check

# Full TypeScript validator
npx tsx scripts/security-validator.ts

# Dependency audit
npm run security:audit

# Fix vulnerabilities
npm run security:fix
```

### CI/CD Integration

Automatic on:
- Every pull request
- Push to main/develop
- Daily schedule

See results in:
- GitHub Actions tab
- PR comments
- Security artifacts (30-day retention)

---

## 📊 Security Report

### Example Output

```
🔒 Security Validation for Buddha CEO App
==================================================

[1/10] Checking for hardcoded secrets...
[2/10] Checking for injection vulnerabilities...
[3/10] Checking for XSS vulnerabilities...
[4/10] Checking authentication and authorization...
[5/10] Checking for environment variable exposure...
[6/10] Checking Next.js security...
[7/10] Checking password security...
[8/10] Checking session security...
[9/10] Checking CORS configuration...
[10/10] Checking for known vulnerabilities...

════════════════════════════════════════
📊 Security Scan Summary
════════════════════════════════════════
❌ Critical Issues: 2
⚠️  Warnings: 3

════════════════════════════════════════
🔍 Detailed Issues
════════════════════════════════════════
❌ [1] CRITICAL: Hardcoded API key detected
   Category: Secrets
   File: lib/api.ts:45
   💡 Use environment variables: process.env.API_KEY

❌ [2] CRITICAL: Unsanitized user input in database query
   Category: Injection
   File: app/api/users/route.ts:23
   💡 Validate and sanitize req.body before use

⚠️  [3] WARNING: User input directly in HTML attribute
   Category: XSS
   File: components/Card.tsx:12
   💡 Validate and sanitize user input
```

---

## 🛠️ Configuration

### Exclude Files/Paths

Edit `scripts/security-validator.ts`:

```typescript
private isExcluded(file: string): boolean {
  const excludedPaths = [
    'node_modules',
    '.next',
    'dist',
    'build',
    '.vercel',
    'tests/',  // Add your exclusions
  ];
  return excludedPaths.some(path => file.includes(path));
}
```

### Customize Checks

Add custom checks in the validator:

```typescript
checkCustomVulnerability() {
  console.log(`${COLORS.BLUE}[Custom]${COLORS.RESET} Checking...`);

  const issues = this.grep('your-pattern', '**/*.ts');
  issues.forEach(result => {
    const [file, line] = result.split(':');
    this.addIssue({
      type: 'CRITICAL',
      category: 'Custom',
      file,
      line: parseInt(line),
      message: 'Custom security issue',
      recommendation: 'Fix this issue',
    });
  });
}
```

### Schedule Adjustments

Edit `.github/workflows/security-validation.yml`:

```yaml
schedule:
  # Run daily at specific time (UTC)
  - cron: '0 2 * * *'  # 2 AM UTC
  # Or run every 6 hours
  # - cron: '0 */6 * * *'
```

---

## 🔧 Integration with PR Validation

Security checks are automatically run on every PR:

```
PR Opened → PR Validation Workflow → Security Check → Result Comment
```

### PR Comment Example

```
✅ **PR Validation Complete**

- TypeScript: ✅ Passed
- ESLint: ✅ Passed
- Permissions check: ✅ Passed
- Theme check: ✅ Passed
- Analytics check: ✅ Passed
- API patterns: ✅ Passed
- Security check: ✅ Passed

See workflow run for details.
```

---

## 📈 Workflow Status

### Success ✅

```
✅ security-scan
✅ dependency-check
✅ code-quality-check
```

### Failure ❌

```
❌ security-scan → PR blocked
├── ❌ Hardcoded secrets found
├── ❌ XSS vulnerability
└── ⚠️  Missing session expiration

✅ dependency-check
✅ code-quality-check
```

---

## 🎯 Best Practices

### Before Committing

1. **Run security check locally**
   ```bash
   npm run security:check
   ```

2. **Review and fix issues**
   - Address critical issues
   - Review warnings
   - Document exceptions

3. **Commit and push**
   ```bash
   git add .
   git commit -m "fix: address security issues"
   git push
   ```

4. **Monitor CI/CD**
   - Check GitHub Actions
   - Review PR comments
   - Fix any new issues

### Regular Maintenance

- **Weekly**: Review security scan results
- **Monthly**: Update dependencies (`npm audit fix`)
- **Quarterly**: Full security review
- **Annually**: Penetration testing

---

## 🔍 Troubleshooting

### False Positives

If you get false positives:

1. **Add to exclusions** in validator
2. **Document the exception** with a comment
3. **Review periodically** if still relevant

### High Vulnerability Count

If npm audit shows many vulnerabilities:

```bash
# Automatic fix (safe updates)
npm audit fix

# Force fix (including breaking changes)
npm audit fix --force

# Manual review
npm audit
# Review each package individually
```

### CI/CD Failures

If security checks fail in CI/CD:

1. **Check the logs** in GitHub Actions
2. **Run locally** to reproduce
3. **Fix the issue**
4. **Push** the fix

---

## 📚 Additional Resources

### Security Tools

- **npm audit** - Dependency vulnerability scanner
- **Snyk** - Advanced dependency security (requires token)
- **TruffleHog** - Secret scanner
- **ESLint** - Code quality (security rules)
- **TypeScript** - Type safety prevents many vulnerabilities

### Documentation

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [MongoDB Security](https://www.mongodb.com/docs/manual/security/)
- [Node.js Security](https://nodejs.org/en/docs/guides/security/)

---

## 🎓 Training

### Common Vulnerabilities

1. **Injection Attacks**
   - SQL/NoSQL injection
   - Command injection
   - LDAP injection

2. **XSS (Cross-Site Scripting)**
   - Reflected XSS
   - Stored XSS
   - DOM-based XSS

3. **Authentication**
   - Weak passwords
   - Session fixation
   - Missing authentication

4. **Authorization**
   - IDOR (Insecure Direct Object Reference)
   - Privilege escalation
   - Missing access controls

### Prevention Strategies

1. **Validate Input**
   - Type checking
   - Length limits
   - Allowlist approach

2. **Sanitize Output**
   - HTML encoding
   - Context-aware encoding
   - Content Security Policy

3. **Use Libraries**
   - bcrypt for passwords
   - DOMPurify for HTML
   - Joi/Zod for validation

4. **Security Headers**
   - Helmet.js
   - CORS configuration
   - CSP headers

---

## 📊 Metrics & Reporting

### Security Score

Track your security posture:

```
Current Score: 85/100

Categories:
- Secrets: 100/100 ✅
- Injection: 90/100 ⚠️
- XSS: 100/100 ✅
- Authentication: 80/100 ⚠️
- Session: 75/100 ⚠️
- Dependencies: 85/100 ⚠️
```

### Trend Analysis

Monitor security over time:

```
Week 1: 12 critical, 24 warnings
Week 2: 8 critical, 20 warnings
Week 3: 5 critical, 18 warnings
Week 4: 2 critical, 15 warnings ✅
```

---

## 🚦 Deployment Gates

Security checks enforce quality gates:

### Must Pass Before Merge:
- ✅ No critical issues
- ✅ TypeScript passes
- ✅ ESLint passes
- ✅ npm audit passes (or documented)

### Should Pass Before Merge:
- ⚠️ All warnings reviewed
- ⚠️ Dependencies updated

---

## 🎯 Next Steps

1. **Run local security check**
   ```bash
   npm run security:check
   ```

2. **Review findings**
   - Critical issues must be fixed
   - Warnings should be reviewed

3. **Update CI/CD secrets** (if needed)
   - Add `SNYK_TOKEN` for advanced scanning
   - Configure notification settings

4. **Schedule regular scans**
   - Daily automatic (already configured)
   - Weekly manual review

5. **Train team**
   - Share this document
   - Review common vulnerabilities
   - Establish security practices

---

**Remember**: Security is a continuous process, not a one-time setup! 🔒

---

**Last Updated**: 2026-02-06
**Version**: 1.0.0
