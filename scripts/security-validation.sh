#!/bin/bash

echo "🔒 Security Validation for Buddha CEO App"
echo "========================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
blue='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ISSUES_FOUND=0
WARNINGS_FOUND=0

# Function to check for issues
check_issue() {
  local description=$1
  local file=$2
  local line=$3
  local severity=$4

  if [ "$severity" = "CRITICAL" ]; then
    echo -e "${RED}❌ CRITICAL${NC}: $description"
    echo "   File: $file${line:+:$line}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
  elif [ "$severity" = "WARNING" ]; then
    echo -e "${blue}⚠️  WARNING${NC}: $description"
    echo "   File: $file${line:+:$line}"
    WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
  fi
}

echo "🔍 Scanning for security vulnerabilities..."
echo ""

# ============================================
# 1. Check for hardcoded secrets
# ============================================
echo -e "${BLUE}[1/10]${NC} Checking for hardcoded secrets..."

# Check for API keys, tokens, passwords
if git grep -i "api[_-]key.*=" -- '*.ts' '*.tsx' '*.js' '*.jsx' '.env*' 2>/dev/null | grep -v "process.env" | grep -v "example"; then
  check_issue "Hardcoded API key found" "" "" "CRITICAL"
fi

if git grep -i "secret.*=" -- '*.ts' '*.tsx' '*.js' '*.jsx' 2>/dev/null | grep -v "process.env" | grep -v "NEXTAUTH_SECRET"; then
  check_issue "Hardcoded secret found" "" "" "CRITICAL"
fi

if git grep -i "password.*=" -- '*.ts' '*.tsx' '*.js' '*.jsx' 2>/dev/null | grep -v "process.env" | grep -v "user.password" | grep -v "bcrypt"; then
  check_issue "Hardcoded password found" "" "" "CRITICAL"
fi

# Check for common API/services
if git grep -E "(mongodb\.net|mongodb\+srv|postgres|mysql|redis|aws_access_key|aws_secret)" -- '*.ts' '*.tsx' '*.js' '*.jsx' '.env*' 2>/dev/null | grep -v "process.env" | grep -v "MONGODB_URI"; then
  check_issue "Hardcoded connection string or credentials found" "" "" "CRITICAL"
fi

# ============================================
# 2. Check for SQL/NoSQL injection
# ============================================
echo -e "${BLUE}[2/10]${NC} Checking for injection vulnerabilities..."

# Check for MongoDB injection (unsafe $where, $ne, etc.)
if git grep -E '\$where|\$ne.*req\.|\$ne.*params' -- 'app/api/**/*.ts' 'lib/**/*.ts' 2>/dev/null; then
  check_issue "Potential MongoDB injection vulnerability" "" "" "CRITICAL"
fi

# Check for direct use of req.body in queries
if git grep -E "find\(.*req\.body" -- 'app/api/**/*.ts' 2>/dev/null; then
  check_issue "Unsanitized user input in database query" "" "" "CRITICAL"
fi

# Check for eval or Function constructor
if git grep -E "eval\(|new Function\(" -- '*.ts' '*.tsx' '*.js' 2>/dev/null; then
  check_issue "Use of eval() or Function() - code injection risk" "" "" "CRITICAL"
fi

# ============================================
# 3. Check for XSS vulnerabilities
# ============================================
echo -e "${BLUE}[3/10]${NC} Checking for XSS vulnerabilities..."

# Check for dangerouslySetInnerHTML without sanitization
if git grep "dangerouslySetInnerHTML" -- 'components/**/*.tsx' 'app/**/*.tsx' 2>/dev/null | grep -v "DOMPurify"; then
  check_issue "dangerouslySetInnerHTML without sanitization (XSS risk)" "" "" "CRITICAL"
fi

# Check for user input directly in HTML
if git grep -E "href=.*user\.|src=.*user\.|innerHTML=.*user\." -- 'components/**/*.tsx' 2>/dev/null; then
  check_issue "User input directly used in HTML attributes (XSS risk)" "" "" "WARNING"
fi

# ============================================
# 4. Check authentication/authorization
# ============================================
echo -e "${BLUE}[4/10]${NC} Checking authentication and authorization..."

# Check for API routes without authentication
API_ROUTES=$(find app/api -name "route.ts" 2>/dev/null)
UNPROTECTED_ROUTES=""

for route in $API_ROUTES; do
  # Skip public routes
  if echo "$route" | grep -E "(public|tracking|photos|resources/public|about|teacher-application|volunteer-application)"; then
    continue
  fi

  # Check if route has authentication
  if ! grep -q "getServerSession\|requireRole\|requirePermission\|authOptions" "$route" 2>/dev/null; then
    UNPROTECTED_ROUTES="$UNPROTECTED_ROUTES\n$route"
  fi
done

if [ -n "$UNPROTECTED_ROUTES" ]; then
  echo -e "${blue}⚠️  WARNING${NC}: API routes may be missing authentication:"
  echo -e "$UNPROTECTED_ROUTES" | head -5
  WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
fi

# Check for admin permission checks
if git grep "session.*role.*===" 'app/admin/**/*.tsx' 'app/api/admin/**/*.ts' 2>/dev/null | grep -v "lib/permissions.ts" | grep -v "requireRole"; then
  check_issue "Manual role check instead of using requireRole() helper" "" "" "WARNING"
fi

# ============================================
# 5. Check for environment variable exposure
# ============================================
echo -e "${BLUE}[5/10]${NC} Checking for environment variable exposure..."

# Check if NEXT_PUBLIC_ vars contain sensitive data
if git grep "NEXT_PUBLIC_.*\(SECRET\|KEY\|PASSWORD\|TOKEN\)" -- '.env*' 'package.json' 2>/dev/null; then
  check_issue "Sensitive data in NEXT_PUBLIC_ env var (exposed to browser)" "" "" "CRITICAL"
fi

# Check for console.log with sensitive data
if git grep -E "console\.log\((user|password|token|secret|key)" -- 'app/**/*.tsx' 'components/**/*.tsx' 2>/dev/null; then
  check_issue "console.log with potentially sensitive data" "" "" "WARNING"
fi

# ============================================
# 6. Check for CORS issues
# ============================================
echo -e "${BLUE}[6/10]${NC} Checking CORS configuration..."

if ! grep -q "cors" app/api/**/*.ts 2>/dev/null; then
  echo -e "${blue}⚠️  WARNING${NC}: No CORS configuration found in API routes"
  WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
fi

# ============================================
# 7. Check for password security
# ============================================
echo -e "${BLUE}[7/10]${NC} Checking password security..."

# Check if passwords are hashed
if git grep -E "password.*=.*req\.body" -- 'app/api/**/*.ts' 2>/dev/null | grep -v "bcrypt\|hash\|compare"; then
  check_issue "Password stored without hashing" "" "" "CRITICAL"
fi

# Check for weak password requirements
if git grep -E "minlength.*[0-4]" -- 'lib/models/*.ts' 2>/dev/null; then
  check_issue "Weak password minimum length (< 5 characters)" "" "" "WARNING"
fi

# ============================================
# 8. Check for Next.js security best practices
# ============================================
echo -e "${BLUE}[8/10]${NC} Checking Next.js security..."

# Check for disable eslint
if grep -r "eslint.*disable\|eslint-disable" app/ components/ 2>/dev/null | grep -v node_modules; then
  check_issue "ESLint disabled (may hide security issues)" "" "" "WARNING"
fi

# Check for image optimization with user input
if git grep -E "img.*src=.*user\.|Image.*src=.*req\." -- 'components/**/*.tsx' 'app/**/*.tsx' 2>/dev/null; then
  check_issue "User-provided image URL without validation" "" "" "WARNING"
fi

# ============================================
# 9. Check for session security
# ============================================
echo -e "${BLUE}[9/10]${NC} Checking session security..."

# Check for session expiration
if ! grep -E "maxAge|expires|expiresIn" lib/auth.ts 2>/dev/null; then
  echo -e "${blue}⚠️  WARNING${NC}: Session expiration may not be configured"
  WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
fi

# Check for secure cookies
if ! grep -E "secure.*true|httpOnly.*true" lib/auth.ts 2>/dev/null; then
  echo -e "${blue}⚠️  WARNING${NC}: Session cookies may not be secure/httpOnly"
  WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
fi

# ============================================
# 10. Check for dependency vulnerabilities
# ============================================
echo -e "${BLUE}[10/10]${NC} Checking for known vulnerabilities..."

if command -v npm &> /dev/null; then
  VULNERABILITIES=$(npm audit --json 2>/dev/null | grep -o '"vulnerabilities"' | wc -l)

  if [ "$VULNERABILITIES" -gt 0 ]; then
    echo -e "${blue}⚠️  WARNING${NC}: Found $VULNERABILITIES vulnerable dependencies"
    echo "   Run: npm audit fix"
    WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
  else
    echo -e "${GREEN}✅ No known vulnerabilities${NC}"
  fi
fi

echo ""
echo "════════════════════════════════════════"
echo "📊 Security Scan Summary"
echo "════════════════════════════════════════"

if [ $ISSUES_FOUND -gt 0 ]; then
  echo -e "${RED}❌ Critical Issues: $ISSUES_FOUND${NC}"
fi

if [ $WARNINGS_FOUND -gt 0 ]; then
  echo -e "${blue}⚠️  Warnings: $WARNINGS_FOUND${NC}"
fi

if [ $ISSUES_FOUND -eq 0 ] && [ $WARNINGS_FOUND -eq 0 ]; then
  echo -e "${GREEN}✅ No security issues found!${NC}"
  echo ""
  echo "🎉 Your application passes all security checks!"
  exit 0
else
  echo ""
  echo "⚠️  Please review and fix the issues above before deploying."
  exit 1
fi
