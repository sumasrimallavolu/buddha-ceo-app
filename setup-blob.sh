#!/bin/bash

echo "Setting up Vercel Blob Storage..."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "Installing Vercel CLI..."
    npm i -g vercel
fi

echo "Logging in to Vercel..."
vercel login

echo "Linking project..."
cd "C:\Users\suma sri mallavolu\zysecai\Repositories\buddha-ceo-app"
vercel link

echo "Creating blob store..."
vercel blob create

echo ""
echo "✅ Setup complete! Your .env.local has been updated with the blob token."
echo "Please restart your dev server with: npm run dev"
