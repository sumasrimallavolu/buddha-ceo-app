# UI Theme Consistency Verification Workflow

**Project:** Meditation Institute Website
**Created:** 2025-02-04
**Status:** Ready for Execution
**Priority:** HIGH - Pre-commit validation

---

## 📋 Workflow Overview

This workflow systematically verifies that all pages, components, and UI elements follow consistent theming before committing changes to the meditation institute website.

### Scope
- **Modified Files:** 55+ files across admin, pages, components, and layouts
- **Focus Areas:** Color consistency, typography, spacing, component variants, animations
- **Verification Method:** Automated agent checks + Manual validation

### Theme System Summary
- **Color Space:** OKLCH for perceptual accuracy
- **Primary Colors:** Terracotta, Sage Green, Muted Lavender, Warm Beige
- **Design Style:** Glassmorphism with rounded-full components
- **Typography:** Inter (body) + Poppins (headings)

---

## 🎯 Verification Goals

### Critical Success Criteria
✅ All buttons use consistent variant system (default, outline, ghost, link)
✅ Color values use CSS variables, not hardcoded Tailwind colors
✅ Spacing follows consistent scale (base: 0.75rem radius, 4px grid)
✅ Typography uses Poppins for headings, Inter for body
✅ Animations follow 300-500ms transition standard
✅ Dark mode support implemented consistently
✅ Component variants use `cva` pattern consistently
✅ Hover/focus states follow established patterns

---

## 📊 Phase 1: Automated Agent Checks

### Agent 1: Component Variant Consistency
**Agent:** Explore Agent
**Focus:** Verify all components use consistent variant patterns

**Tasks:**
1. Check all UI components use `cva` (class-variance-authority)
2. Verify variant naming matches: `default | destructive | outline | secondary | ghost | link`
3. Verify size variants: `xs | sm | default | lg | icon`
4. Identify components not following the pattern

**Output:** Component consistency report

---

### Agent 2: Color Token Audit
**Agent:** Explore Agent
**Focus:** Find hardcoded colors that should use CSS variables

**Tasks:**
1. Search for hardcoded Tailwind colors (rose-500, amber-500, etc.)
2. Search for hardcoded hex/rgb values in component files
3. Verify gradient usage follows theme system
4. Check dark mode implementation completeness

**Output:** Color violation report with file locations

---

### Agent 3: Spacing & Layout Consistency
**Agent:** Explore Agent
**Focus:** Verify spacing, padding, margin consistency

**Tasks:**
1. Check padding patterns (should follow 4px grid: 4, 8, 12, 16, 20, 24...)
2. Verify border-radius consistency (rounded-full or rounded-2xl preferred)
3. Check gap spacing in flex/grid layouts
4. Identify arbitrary values that don't follow scale

**Output:** Spacing inconsistency report

---

### Agent 4: Typography Verification
**Agent:** Explore Agent
**Focus:** Ensure consistent font usage

**Tasks:**
1. Verify headings use Poppins (font-poppins)
2. Verify body text uses Inter (font-geist-sans)
3. Check font-weight consistency (headings: 600-700, body: 400-500)
4. Verify font-size scale (sm, base, lg, xl, 2xl, 3xl, 4xl)

**Output:** Typography usage report

---

### Agent 5: Animation Consistency
**Agent:** Explore Agent
**Focus:** Verify animation patterns

**Tasks:**
1. Check transition duration (should be 300-500ms)
2. Verify hover effects (scale-105, scale-95 for active)
3. Check shadow consistency (sm → md → lg → xl → 2xl)
4. Identify custom animations that should use utilities

**Output:** Animation pattern report

---

## 🔍 Phase 2: Manual Verification

### Page-by-Page Visual Review
**Method:** Visual inspection of each modified page

**Checklist for Each Page:**

#### Admin Pages (11 files)
- [ ] `app/(auth)/login/page.tsx` - Login form styling
- [ ] `app/admin/contact-messages/page.tsx` - Table styling, badges
- [ ] `app/admin/content/new/page.tsx` - Form elements, editor
- [ ] `app/admin/content/page.tsx` - Card layout, actions
- [ ] `app/admin/content/review/[id]/page.tsx` - Detail view styling
- [ ] `app/admin/events/page.tsx` - Event cards, status badges
- [ ] `app/admin/layout.tsx` - Admin layout consistency
- [ ] `app/admin/page.tsx` - Dashboard cards
- [ ] `app/admin/resources/page.tsx` - Resource cards
- [ ] `app/admin/users/new/page.tsx` - Form styling
- [ ] `app/admin/users/page.tsx` - User table, actions

#### Public Pages (9 files)
- [ ] `app/community/page.tsx` - Community cards, buttons
- [ ] `app/contact/page.tsx` - Form styling, contact info
- [ ] `app/donate/page.tsx` - Donation cards, CTA buttons
- [ ] `app/events/page.tsx` - Event cards, filters
- [ ] `app/project-excellence/page.tsx` - Content sections
- [ ] `app/register/page.tsx` - Registration form
- [ ] `app/resources/page.tsx` - Resource cards, filters
- [ ] `app/teach/page.tsx` - Teaching content layout

#### Layout Components (5 files)
- [ ] `components/layout/Header.tsx` - Navigation, logo placement
- [ ] `components/layout/Footer.tsx` - Footer links, sections
- [ ] `components/home/HeroSection.tsx` - Hero styling, CTA
- [ ] `components/home/VideoSection.tsx` - Video player styling
- [ ] `components/home/RecentEvents.tsx` - Event cards

#### Component Files (20+ files)
- [ ] About components (11 files)
- [ ] Admin components (2 files)
- [ ] Content components (3 files)
- [ ] Events components (2 files)
- [ ] Home components (3 files)
- [ ] UI components (4 modified)

---

## 📐 Phase 3: Component-Level Verification

### Button Component Verification
**File:** `components/ui/button.tsx`

**Checklist:**
- [ ] All variants defined (default, destructive, outline, secondary, ghost, link)
- [ ] All sizes defined (xs, sm, default, lg, icon, icon-xs, icon-sm, icon-lg)
- [ ] Uses CSS variables for colors (no hardcoded rose-500, amber-500)
- [ ] Gradient backgrounds follow theme system
- [ ] Hover effects: `hover:scale-105`
- [ ] Active state: `active:scale-95`
- [ ] Shadow progression: `shadow-md` → `hover:shadow-xl`
- [ ] Transition: `transition-all duration-300`
- [ ] Border radius: `rounded-full`
- [ ] Dark mode variants defined

### Card Component Verification
**File:** `components/ui/card.tsx`

**Checklist:**
- [ ] Glassmorphism effect: `bg-white/40 backdrop-blur-xl`
- [ ] Border radius: `rounded-[2rem]`
- [ ] Hover effect: `hover:scale-[1.02]`
- [ ] Border: `border border-white/50`
- [ ] Transition: `transition-all duration-500`
- [ ] Dark mode support with appropriate colors
- [ ] Consistent padding: `p-6` or `p-8`

### Input Component Verification
**File:** `components/ui/input.tsx`

**Checklist:**
- [ ] Border radius: `rounded-full`
- [ ] Background: `bg-white/60 backdrop-blur-sm`
- [ ] Shadow: `shadow-sm`
- [ ] Focus ring: `ring-[3px]`
- [ ] Invalid state: destructive color scheme
- [ ] Transition: `transition-all duration-300`
- [ ] Padding consistent: `px-4 py-3`

### Badge Component Verification
**File:** `components/ui/badge.tsx`

**Checklist:**
- [ ] All variants defined (default, secondary, destructive, outline, ghost, link)
- [ ] Border radius: `rounded-full`
- [ ] Shadow: `shadow-sm`
- [ ] Padding: `px-3 py-1`
- [ ] Transitions on interactive states
- [ ] Dark mode support

---

## 🎨 Theme Consistency Criteria

### Color System Rules

#### ✅ Correct Usage
```tsx
// Using CSS variables
className="bg-primary text-primary-foreground"
className="border-border bg-background"
className="text-muted-foreground hover:text-foreground"
```

#### ❌ Incorrect Usage
```tsx
// Hardcoded Tailwind colors
className="bg-rose-500 text-white"
className="border-amber-600"
className="hover:bg-blue-500"

// Hardcoded hex values
style={{ backgroundColor: '#8B4513' }}
style={{ color: 'rgb(139, 69, 19)' }}
```

### Spacing Rules

#### ✅ Correct Usage
```tsx
// Following 4px grid
className="p-4 p-6 p-8"  // 16px, 24px, 32px
className="gap-4 gap-6 gap-8"
className="px-6 py-3"  // 24px horizontal, 12px vertical
```

#### ❌ Incorrect Usage
```tsx
// Arbitrary values
className="p-[23px]"
className="gap-[13px]"
className="px-[17px]"

// Inconsistent patterns
className="px-5"  // Should be px-4 or px-6
className="py-7"  // Should be py-6 or py-8
```

### Typography Rules

#### ✅ Correct Usage
```tsx
// Headings - Poppins
<h1 className="font-poppins font-bold text-4xl">
<h2 className="font-poppins font-semibold text-3xl">
<h3 className="font-poppins font-medium text-2xl">

// Body - Inter
<p className="font-geist-sans text-base">
<span className="font-geist-sans text-sm">
```

#### ❌ Incorrect Usage
```tsx
// Wrong font for purpose
<h1 className="font-geist-sans">  // Should use Poppins
<p className="font-poppins">  // Should use Inter

// Inconsistent weights
className="font-normal"  // Use font-light or font-medium
className="font-bold text-sm"  // Don't use bold on small text
```

### Animation Rules

#### ✅ Correct Usage
```tsx
// Hover effects
className="hover:scale-105 transition-all duration-300"
className="active:scale-95 transition-all duration-300"

// Shadow progression
className="shadow-md hover:shadow-xl transition-all duration-300"

// Focus states
className="focus:ring-[3px] focus:ring-primary/50"
```

#### ❌ Incorrect Usage
```tsx
// Inconsistent durations
className="transition-all duration-150"  // Too fast
className="transition-all duration-1000"  // Too slow

// Wrong scale values
className="hover:scale-150"  // Too much
className="hover:scale-101"  // Not noticeable

// Missing transitions
className="hover:shadow-xl"  // Missing transition-all
```

---

## 🔧 Phase 4: Fix & Standardize

### Priority 1: Critical Fixes
**Blocking commit - Must fix before proceeding**

1. **Hardcoded Colors → CSS Variables**
   ```bash
   # Find all hardcoded colors
   grep -r "rose-500\|amber-500\|blue-500\|green-500" components/ app/
   # Replace with theme tokens
   ```

2. **Inconsistent Component Variants**
   - Standardize all components to use `cva`
   - Ensure all components have: default, outline, ghost, link variants
   - Add missing size variants

3. **Spacing Violations**
   - Replace arbitrary values with scale values
   - Standardize padding: `px-4 py-2` (sm), `px-6 py-3` (default), `px-8 py-4` (lg)

### Priority 2: Important Improvements
**Should fix - Improves consistency**

1. **Typography Standardization**
   - Ensure all headings use Poppins
   - Ensure all body uses Inter
   - Standardize font weights

2. **Animation Consistency**
   - Standardize transition duration to 300ms (or 500ms for complex animations)
   - Ensure all hover states have transitions
   - Standardize shadow progression

3. **Dark Mode Completeness**
   - Add dark mode variants to all components
   - Test all pages in dark mode
   - Ensure contrast ratios meet WCAG AA

### Priority 3: Nice to Have
**Can defer - Polish and refinement**

1. **Component Documentation**
   - Add JSDoc comments to components
   - Create component usage examples
   - Document variant usage

2. **Accessibility Improvements**
   - Add ARIA labels where missing
   - Ensure keyboard navigation works
   - Test with screen reader

3. **Performance Optimization**
   - Remove unused CSS
   - Optimize animation performance
   - Reduce bundle size

---

## 🪝 Phase 5: Pre-Commit Hook Validation

### Hook Configuration
**File:** `.husky/pre-commit` (or create new)

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# UI Theme Consistency Checks

echo "🎨 Running UI theme consistency checks..."

# Check for hardcoded colors
echo "  → Checking for hardcoded colors..."
if grep -r "rose-500\|amber-500\|bg-\[#" --include="*.tsx" --include="*.ts" components/ app/ | grep -v "node_modules"; then
  echo "❌ Found hardcoded colors! Please use CSS variables instead."
  exit 1
fi

# Check for arbitrary spacing values
echo "  → Checking for arbitrary spacing..."
if grep -r "p-\-\[\|px-\-\[\|py-\-\[" --include="*.tsx" --include="*.ts" components/ app/ | grep -v "node_modules"; then
  echo "⚠️  Found arbitrary spacing values. Please use spacing scale."
  # Don't fail, just warn
fi

# Check for missing transitions on hover states
echo "  → Checking hover states have transitions..."
if grep -r "hover:" --include="*.tsx" components/ui/ | grep -v "transition" | grep -v "node_modules"; then
  echo "⚠️  Found hover states without transitions."
  # Don't fail, just warn
fi

echo "✅ Theme consistency checks passed!"

# Run existing checks
npm run lint || exit 1
npm run type-check || exit 1
```

### Automated Linting Rules
**File:** `.eslintrc.json` (add rules)

```json
{
  "rules": {
    "react/no-unknown-property": ["error", {
      "ignore": ["className"]
    }],
    "custom/no-hardcoded-colors": "warn",
    "custom/no-arbitrary-spacing": "warn",
    "custom/require-transitions-on-hover": "warn"
  }
}
```

---

## 📋 Phase 6: Final Verification Checklist

### Before Committing

- [ ] All agent checks completed and reviewed
- [ ] All critical fixes applied
- [ ] Manual visual review of all modified pages
- [ ] Component verification checklist complete
- [ ] Pre-commit hook passes
- [ ] Linting passes
- [ ] Type checking passes
- [ ] Build succeeds
- [ ] Tested in light mode
- [ ] Tested in dark mode
- [ ] Responsive design verified (mobile, tablet, desktop)
- [ ] Accessibility verified (keyboard navigation, screen reader)
- [ ] Performance verified (Lighthouse score)

---

## 🚀 Execution Commands

### Step 1: Run Automated Agent Checks
```bash
# This will run all 5 exploration agents in parallel
# Reports will be generated in claudedocs/theme-consistency-reports/
```

### Step 2: Review Reports
```bash
# Check generated reports
cat claudedocs/theme-consistency-reports/component-consistency.md
cat claudedocs/theme-consistency-reports/color-violations.md
cat claudedocs/theme-consistency-reports/spacing-inconsistencies.md
cat claudedocs/theme-consistency-reports/typography-usage.md
cat claudedocs/theme-consistency-reports/animation-patterns.md
```

### Step 3: Manual Verification
```bash
# Start development server
npm run dev

# Visit each modified page and verify:
# - http://localhost:3000
# - http://localhost:3000/community
# - http://localhost:3000/events
# - http://localhost:3000/contact
# - http://localhost:3000/donate
# - http://localhost:3000/admin (if accessible)
# etc.
```

### Step 4: Apply Fixes
```bash
# Use search and replace for common patterns
# Example: Replace hardcoded rose-500 with primary
# Do this manually with supervision
```

### Step 5: Run Pre-Commit Hook
```bash
# Test pre-commit hook
npm run pre-commit-validation

# Or test manually
npx eslint . --max-warnings=0
npm run build
```

### Step 6: Commit
```bash
# Only commit after all checks pass
git add .
git commit -m "feat: apply consistent theming across all pages

- Standardized button variants across all pages
- Replaced hardcoded colors with CSS variables
- Fixed spacing inconsistencies
- Ensured consistent typography usage
- Added dark mode support to all components
- Standardized animation patterns

Verified with UI theme consistency workflow"
```

---

## 📊 Report Templates

### Component Consistency Report Template
```markdown
# Component Consistency Report

## Components Using CVA Pattern ✅
- button.tsx
- badge.tsx
- [Add more]

## Components NOT Using CVA Pattern ❌
- card.tsx - Uses inline Tailwind classes
- input.tsx - Uses inline Tailwind classes
- [Add more]

## Recommendations
1. Convert card.tsx to use CVA pattern
2. Add variant system to input.tsx
3. [Add more]
```

### Color Violation Report Template
```markdown
# Color Violation Report

## Hardcoded Tailwind Colors Found ❌

### button.tsx
- Line 45: `bg-rose-500` → Should use `bg-primary`
- Line 46: `to-amber-500` → Should use gradient token

### [Component/File]
- Line [X]: [Violation] → [Recommendation]

## Summary
- Total violations: [X]
- High priority: [X]
- Medium priority: [X]
- Low priority: [X]
```

---

## 🎯 Success Metrics

### Quantitative Metrics
- **Zero hardcoded colors** in committed code
- **95%+ components** using CVA pattern
- **100% of modified pages** visually verified
- **All spacing** follows 4px grid
- **All animations** use 300-500ms duration
- **100% component coverage** for dark mode

### Qualitative Metrics
- **Visual consistency** across all pages
- **Cohesive design language** throughout site
- **Professional, polished appearance**
- **Accessible and performant** implementation
- **Maintainable codebase** with clear patterns

---

## 🔄 Iteration Process

### If Issues Found:
1. **Document** the issue in the appropriate report
2. **Categorize** by priority (Critical, Important, Nice-to-have)
3. **Fix** Critical issues before commit
4. **Defer** Important issues to next commit if needed
5. **Track** Nice-to-have items for future refinement

### Re-verification:
1. After fixes applied, re-run automated checks
2. Re-verify affected pages manually
3. Update reports with fixes applied
4. Ensure no regressions introduced

---

## 📚 Resources

### Documentation
- `docs/UI_UX_DESIGN_GUIDE.md` - Design system guidelines
- `docs/UI_IMPLEMENTATION_ROADMAP.md` - Implementation roadmap
- `docs/UI_COMPONENT_EXAMPLES.md` - Component usage examples

### Theme Files
- `app/globals.css` - CSS variables and theme definitions
- `tailwind.config.ts` - Tailwind configuration
- `components/ui/` - UI component library

### Related Workflows
- Workflow for component creation: `claudedocs/workflow_component_creation.md`
- Workflow for dark mode: `claudedocs/workflow_dark_mode_implementation.md`

---

## ✍️ Notes

### Current Theme System
- **Color Space:** OKLCH (perceptually uniform)
- **Primary Colors:** Terracotta, Sage Green, Muted Lavender
- **Design Philosophy:** Glassmorphism + Soft Rounded Components
- **Animation Style:** Subtle, smooth (300-500ms)

### Known Issues
From agent analysis:
1. Button component uses hardcoded gradients (rose-500 → amber-500)
2. Card component doesn't use CVA pattern
3. Inconsistent spacing patterns across components
4. Mix of CVA and inline styling approaches

### Design Principles
- **Calm & Serene:** Appropriate for meditation/wellness context
- **Modern & Accessible:** Meets WCAG AA contrast requirements
- **Performant:** Smooth animations without jank
- **Maintainable:** Clear patterns, reusable components

---

**Workflow Status:** 🟢 Ready for Execution
**Next Action:** Run Phase 1 automated agent checks
**Estimated Completion:** After manual verification of all modified pages
