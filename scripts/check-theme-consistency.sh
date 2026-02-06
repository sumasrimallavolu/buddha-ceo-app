
#!/bin/bash

# Theme Consistency Checker
# Runs automated checks for theme compliance before commit

set -e

echo "🎨 Theme Consistency Checker"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track issues
CRITICAL_ISSUES=0
MEDIUM_ISSUES=0
LOW_ISSUES=0

echo "🔍 Running theme consistency checks..."
echo ""

# Check 1: Hardcoded colors (CRITICAL)
echo "1️⃣  Checking for hardcoded colors..."
HARDCODED_COLORS=$(grep -r "rose-500\|amber-500\|blue-500\|emerald-500\|teal-500\|indigo-500" \
  --include="*.tsx" --include="*.ts" \
  components/ app/ 2>/dev/null || echo "")

if [ -n "$HARDCODED_COLORS" ]; then
  echo -e "${RED}❌ Found hardcoded colors!${NC}"
  echo "$HARDCODED_COLORS" | head -20
  CRITICAL_ISSUES=$(echo "$HARDCODED_COLORS" | wc -l)
else
  echo -e "${GREEN}✅ No hardcoded colors found${NC}"
fi
echo ""

# Check 2: Arbitrary spacing values (MEDIUM)
echo "2️⃣  Checking for arbitrary spacing..."
ARBITRARY_SPACING=$(grep -r "p-\-\[\|px-\-\[\|py-\-\[\|m-\-\[\|mx-\-\[\|my-\-\[" \
  --include="*.tsx" --include="*.ts" \
  components/ app/ 2>/dev/null || echo "")

if [ -n "$ARBITRARY_SPACING" ]; then
  echo -e "${YELLOW}⚠️  Found arbitrary spacing values${NC}"
  echo "$ARBITRARY_SPACING" | head -10
  MEDIUM_ISSUES=$(echo "$ARBITRARY_SPACING" | wc -l)
else
  echo -e "${GREEN}✅ No arbitrary spacing found${NC}"
fi
echo ""

# Check 3: Hardcoded border colors (MEDIUM)
echo "3️⃣  Checking for hardcoded border colors..."
BORDER_COLORS=$(grep -r "border-gray-200\|border-gray-300\|border-gray-400" \
  --include="*.tsx" --include="*.ts" \
  components/ app/ 2>/dev/null || echo "")

if [ -n "$BORDER_COLORS" ]; then
  echo -e "${YELLOW}⚠️  Found hardcoded border colors${NC}"
  echo "$BORDER_COLORS" | head -10
  MEDIUM_ISSUES=$((MEDIUM_ISSUES + $(echo "$BORDER_COLORS" | wc -l)))
else
  echo -e "${GREEN}✅ No hardcoded border colors found${NC}"
fi
echo ""

# Check 4: Hardcoded text colors (MEDIUM)
echo "4️⃣  Checking for hardcoded text colors..."
TEXT_COLORS=$(grep -r "text-gray-500\|text-gray-600\|text-gray-700\|text-blue-600" \
  --include="*.tsx" --include="*.ts" \
  components/ app/ 2>/dev/null || echo "")

if [ -n "$TEXT_COLORS" ]; then
  echo -e "${YELLOW}⚠️  Found hardcoded text colors${NC}"
  echo "$TEXT_COLORS" | head -10
  MEDIUM_ISSUES=$((MEDIUM_ISSUES + $(echo "$TEXT_COLORS" | wc -l)))
else
  echo -e "${GREEN}✅ No hardcoded text colors found${NC}"
fi
echo ""

# Check 5: Hardcoded background colors (MEDIUM)
echo "5️⃣  Checking for hardcoded background colors..."
BG_COLORS=$(grep -r "bg-gray-50\|bg-gray-100\|bg-gray-200" \
  --include="*.tsx" --include="*.ts" \
  components/ app/ 2>/dev/null || echo "")

if [ -n "$BG_COLORS" ]; then
  echo -e "${YELLOW}⚠️  Found hardcoded background colors${NC}"
  echo "$BG_COLORS" | head -10
  MEDIUM_ISSUES=$((MEDIUM_ISSUES + $(echo "$BG_COLORS" | wc -l)))
else
  echo -e "${GREEN}✅ No hardcoded background colors found${NC}"
fi
echo ""

# Check 6: Hover states without transitions (LOW)
echo "6️⃣  Checking hover states have transitions..."
HOVER_NO_TRANSITION=$(grep -r "hover:scale\|hover:shadow" \
  --include="*.tsx" \
  components/ui/ 2>/dev/null | \
  grep -v "transition" | \
  head -20 || echo "")

if [ -n "$HOVER_NO_TRANSITION" ]; then
  echo -e "${YELLOW}⚠️  Found hover states without transitions${NC}"
  echo "$HOVER_NO_TRANSITION" | head -5
  LOW_ISSUES=$(echo "$HOVER_NO_TRANSITION" | wc -l)
else
  echo -e "${GREEN}✅ All hover states have transitions${NC}"
fi
echo ""

# Check 7: Font usage (LOW)
echo "7️⃣  Checking font consistency..."
WRONG_FONT_HEADINGS=$(grep -r "className.*font-geist-sans.*text-[2-9]xl\|className.*text-[2-9]xl.*font-geist-sans" \
  --include="*.tsx" \
  components/ app/ 2>/dev/null || echo "")

if [ -n "$WRONG_FONT_HEADINGS" ]; then
  echo -e "${YELLOW}⚠️  Found headings using body font${NC}"
  echo "$WRONG_FONT_HEADINGS" | head -5
  LOW_ISSUES=$((LOW_ISSUES + $(echo "$WRONG_FONT_HEADINGS" | wc -l)))
else
  echo -e "${GREEN}✅ Font usage is consistent${NC}"
fi
echo ""

# Summary
echo "=============================="
echo "📊 Summary"
echo "=============================="
echo ""

if [ $CRITICAL_ISSUES -gt 0 ]; then
  echo -e "${RED}🔴 Critical Issues: $CRITICAL_ISSUES${NC}"
fi

if [ $MEDIUM_ISSUES -gt 0 ]; then
  echo -e "${YELLOW}🟡 Medium Issues: $MEDIUM_ISSUES${NC}"
fi

if [ $LOW_ISSUES -gt 0 ]; then
  echo -e "${GREEN}🟢 Low Issues: $LOW_ISSUES${NC}"
fi

if [ $CRITICAL_ISSUES -eq 0 ] && [ $MEDIUM_ISSUES -eq 0 ] && [ $LOW_ISSUES -eq 0 ]; then
  echo -e "${GREEN}✅ No issues found! Theme consistency is perfect.${NC}"
  echo ""
  exit 0
fi

echo ""
TOTAL_ISSUES=$((CRITICAL_ISSUES + MEDIUM_ISSUES + LOW_ISSUES))

if [ $CRITICAL_ISSUES -gt 0 ]; then
  echo -e "${RED}❌ FAIL: $CRITICAL_ISSUES critical issue(s) must be fixed before commit${NC}"
  echo ""
  echo "Quick fix commands:"
  echo "  # Replace hardcoded rose-500 with primary"
  echo "  find components app -name '*.tsx' -exec sed -i 's/rose-500/primary/g' {} +"
  echo ""
  echo "See: claudedocs/theme-consistency-checks/color-violation-report.md"
  exit 1
elif [ $MEDIUM_ISSUES -gt 10 ]; then
  echo -e "${YELLOW}⚠️  WARNING: $MEDIUM_ISSUES medium issue(s) found${NC}"
  echo "   Consider fixing these before commit for better consistency"
  echo ""
  exit 0
else
  echo -e "${YELLOW}⚠️  Found $TOTAL_ISSUES minor issue(s)${NC}"
  echo "   Proceed with caution"
  echo ""
  exit 0
fi
