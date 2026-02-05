# Theme Consistency Quick Start Guide

## 🚀 Quick Verification

### Option 1: Full Workflow (Recommended)
Follow the complete workflow in `workflow_ui_theme_consistency_verification.md`

### Option 2: Quick Pre-Commit Check
Run these quick checks before committing:

```bash
# 1. Check for hardcoded colors
echo "Checking for hardcoded colors..."
grep -r "rose-500\|amber-500\|blue-500\|green-500\|purple-500" --include="*.tsx" --include="*.ts" components/ app/ | grep -v "node_modules" | grep -v ".next"

# 2. Check for arbitrary spacing
echo "Checking for arbitrary spacing..."
grep -r "p-\-\[\|px-\-\[\|py-\-\[" --include="*.tsx" --include="*.ts" components/ app/ | grep -v "node_modules"

# 3. Check for font consistency
echo "Checking font usage..."
grep -r "className.*font-" --include="*.tsx" app/ components/ | grep -v "node_modules" | head -20

# 4. Build to check for errors
echo "Building project..."
npm run build
```

## 📊 Critical Checks

### Must Verify Before Commit

1. **No Hardcoded Colors**
   - Search for: `rose-500`, `amber-500`, `blue-500`, hex codes like `#8B4513`
   - Replace with: `bg-primary`, `text-primary`, CSS variables

2. **Consistent Button Usage**
   - All buttons should use Button component from `components/ui/button`
   - Variants: `default`, `outline`, `ghost`, `link`
   - Sizes: `sm`, `default`, `lg`

3. **Consistent Card Usage**
   - All cards should use Card components
   - Structure: Card → CardHeader → CardTitle → CardDescription → CardContent

4. **Typography Consistency**
   - Headings: `font-poppins font-semibold`
   - Body: `font-geist-sans`
   - No hardcoded font sizes

## 🎨 Theme Tokens Reference

### Colors
```tsx
// ✅ Use these
bg-primary              // Terracotta
bg-secondary            // Sage green
bg-accent               // Muted lavender
bg-background           // Warm beige
bg-muted                // Muted beige
border-border           // Soft beige border
text-primary            // Primary text
text-muted-foreground   // Muted text

// ❌ Don't use these
bg-rose-500
bg-amber-500
text-blue-600
border-gray-300
```

### Spacing (4px grid)
```tsx
// ✅ Use these
p-4    // 16px
p-6    // 24px
p-8    // 32px
gap-4  // 16px
gap-6  // 24px

// ❌ Don't use these
p-[23px]
p-[17px]
gap-[13px]
```

### Border Radius
```tsx
// ✅ Use these
rounded-full      // Buttons, badges, inputs
rounded-2xl       // Cards
rounded-[2rem]    // Large cards

// ❌ Don't use these
rounded-[13px]
rounded-[27px]
```

### Animations
```tsx
// ✅ Use these
transition-all duration-300
hover:scale-105
active:scale-95
hover:shadow-xl

// ❌ Don't use these
transition-all duration-100  // Too fast
transition-all duration-1000 // Too slow
hover:scale-150             // Too much
```

## 🔍 Visual Checklist

### Check Each Modified Page

- [ ] **Colors match theme** (no jarring colors)
- [ ] **Buttons are consistent** (same style, hover effects)
- [ ] **Cards use glassmorphism** (semi-transparent, blur)
- [ ] **Text is readable** (proper contrast, hierarchy)
- [ ] **Spacing is balanced** (consistent gaps, padding)
- [ ] **Animations are smooth** (no jank, proper timing)
- [ ] **Responsive works** (mobile, tablet, desktop)
- [ ] **Dark mode works** (colors invert properly)

### Priority Pages to Check

1. **Homepage** (`app/page.tsx`) - Main landing, most important
2. **Events** (`app/events/page.tsx`) - Event cards, filters
3. **Community** (`app/community/page.tsx`) - Community cards
4. **Contact** (`app/contact/page.tsx`) - Form styling
5. **Admin pages** - Table layouts, forms

## 🛠️ Quick Fixes

### Replace Hardcoded Colors

```bash
# In button.tsx
- className="bg-gradient-to-r from-rose-500 to-amber-500"
+ className="bg-gradient-to-r from-primary to-secondary"

# In any component
- className="text-blue-600"
+ className="text-primary"

- style={{ color: '#8B4513' }}
+ className="text-primary"
```

### Fix Spacing

```bash
# Replace arbitrary values
- className="p-[23px]"
+ className="p-6"  // 24px, closest on 4px grid

- className="px-[17px]"
+ className="px-4"  // 16px, closest on 4px grid
```

### Standardize Buttons

```tsx
// ❌ Don't use raw HTML
<button className="bg-blue-500 text-white px-4 py-2 rounded">
  Click me
</button>

// ✅ Use Button component
import { Button } from "@/components/ui/button"

<Button variant="default" size="default">
  Click me
</Button>
```

## 📝 Pre-Commit Checklist

```
□ No hardcoded colors in modified files
□ All buttons use Button component
□ All cards use Card components
□ Typography is consistent (Poppins/Inter)
□ Spacing follows 4px grid
□ Animations use 300-500ms duration
□ Visual check of all modified pages
□ Build succeeds
□ Linting passes
□ Tested in light mode
□ Tested in dark mode
```

## 🎯 Common Issues & Solutions

### Issue: Buttons look different across pages
**Solution:** Ensure all buttons use `components/ui/button` with consistent variants

### Issue: Cards don't have glassmorphism effect
**Solution:** Add `bg-white/40 backdrop-blur-xl` to card component

### Issue: Text hard to read in dark mode
**Solution:** Add dark mode variant with proper contrast

### Issue: Spacing feels uneven
**Solution:** Use consistent spacing scale (4, 6, 8 for padding/gaps)

### Issue: Animations feel jerky
**Solution:** Ensure `transition-all duration-300` on all animated elements

## 📚 Need More Info?

- Full workflow: `workflow_ui_theme_consistency_verification.md`
- Design guide: `docs/UI_UX_DESIGN_GUIDE.md`
- Component examples: `docs/UI_COMPONENT_EXAMPLES.md`
