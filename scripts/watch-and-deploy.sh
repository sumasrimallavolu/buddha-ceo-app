#!/bin/bash

echo "🚀 Parallel Development & Deployment Workflow"
echo "=========================================="

# Function to check if command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Run type checking in background
echo "🔍 Type checking (running in parallel)..."
npm run type-check &
TYPE_CHECK_PID=$!

# Run linting in background
echo "🔍 Linting (running in parallel)..."
npm run lint &
LINT_PID=$!

# Wait for both to complete
wait $TYPE_CHECK_PID
TYPE_STATUS=$?

wait $LINT_PID
LINT_STATUS=$?

if [ $TYPE_STATUS -ne 0 ] || [ $LINT_STATUS -ne 0 ]; then
  echo "❌ Pre-deployment checks failed!"
  echo "   - TypeScript: $([ $TYPE_STATUS -eq 0 ] && echo '✅' || echo '❌')"
  echo "   - Linting: $([ $LINT_STATUS -eq 0 ] && echo '✅' || echo '❌')"
  exit 1
fi

echo "✅ All checks passed! Starting build..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build successful!"
  echo ""
  echo "🚀 Ready to deploy to Vercel?"
  read -p "Deploy now? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command_exists vercel; then
      vercel --prod
    else
      echo "⚠️  Vercel CLI not found. Install with: npm i -g vercel"
    fi
  fi
else
  echo "❌ Build failed. Please fix errors before deploying."
  exit 1
fi
