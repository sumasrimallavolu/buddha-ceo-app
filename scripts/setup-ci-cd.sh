#!/bin/bash

echo "🚀 CI/CD Setup Helper for Buddha CEO App"
echo "========================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found!"
    echo "Installing Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI installed"
fi

echo ""
echo "Step 1: Link your project to Vercel"
echo "==================================="
vercel link

echo ""
echo "Step 2: Get Vercel Credentials"
echo "==============================="
echo ""
echo "Your Vercel project credentials:"
echo ""

if [ -f .vercel/project.json ]; then
    echo "VERCEL_ORG_ID=$(cat .vercel/project.json | grep -o '"orgId": "[^"]*' | cut -d'"' -f4)"
    echo "VERCEL_PROJECT_ID=$(cat .vercel/project.json | grep -o '"projectId": "[^"]*' | cut -d'"' -f4)"
else
    echo "⚠️  .vercel/project.json not found. Make sure you ran 'vercel link'"
fi

echo ""
echo "Step 3: Create Vercel Token"
echo "==========================="
echo "Opening browser to create token..."
echo ""
echo "After creating the token, add it to GitHub:"
echo "1. Go to: https://github.com/sumasrimallavolu/Buddha-ceo-app/settings/secrets/actions"
echo "2. Click 'New repository secret'"
echo "3. Add the following secrets:"
echo ""
echo "   Name: VERCEL_TOKEN"
echo "   Value: <paste your token here>"
echo ""
echo "   Name: VERCEL_ORG_ID"
echo "   Value: $(cat .vercel/project.json 2>/dev/null | grep -o '"orgId": "[^"]*' | cut -d'"' -f4)"
echo ""
echo "   Name: VERCEL_PROJECT_ID"
echo "   Value: $(cat .vercel/project.json 2>/dev/null | grep -o '"projectId": "[^"]*' | cut -d'"' -f4)"
echo ""

# Open browser to create token
if command -v open &> /dev/null; then
    open https://vercel.com/account/tokens
elif command -v start &> /dev/null; then
    start https://vercel.com/account/tokens
else
    xdg-open https://vercel.com/account/tokens 2>/dev/null || echo "Manually open: https://vercel.com/account/tokens"
fi

echo ""
echo "Step 4: Test the Workflow"
echo "========================"
echo "After adding secrets to GitHub:"
echo ""
echo "1. Create a test branch:"
echo "   git checkout -b test/ci-cd"
echo ""
echo "2. Make a small change:"
echo "   echo '# test' > test-ci-cd.md"
echo ""
echo "3. Commit and push:"
echo "   git add test-ci-cd.md"
echo "   git commit -m 'test: validate CI/CD workflow'"
echo "   git push origin test/ci-cd"
echo ""
echo "4. Create a PR on GitHub"
echo ""
echo "5. Watch the Actions tab for workflow runs!"
echo ""

echo "✅ Setup complete!"
echo ""
echo "For full documentation, see: .github/DEPLOYMENT_GUIDE.md"
