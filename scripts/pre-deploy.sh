#!/bin/bash

echo "🔍 Running pre-deployment checks..."

# Check TypeScript
echo "▶️ TypeScript check..."
npm run type-check || {
  echo "❌ TypeScript errors found!"
  exit 1
}

# Check linting
echo "▶️ Lint check..."
npm run lint || {
  echo "❌ Linting errors found!"
  exit 1
}

# Test build
echo "▶️ Production build test..."
npm run build || {
  echo "❌ Build failed!"
  exit 1
}

echo "✅ All checks passed! Safe to deploy."
