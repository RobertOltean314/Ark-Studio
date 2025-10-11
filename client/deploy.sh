#!/bin/bash

# Ark Studio Deployment Script
# This script builds and deploys the Angular app to Firebase Hosting

set -e  # Exit on any error

echo "🚀 Starting Ark Studio Deployment..."

# Check if we're in the client directory
if [ ! -f "angular.json" ]; then
    echo "❌ Error: Not in the client directory. Please run this script from the client folder."
    exit 1
fi

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Error: Firebase CLI is not installed. Please install it with: npm install -g firebase-tools"
    exit 1
fi

echo "📦 Building Angular application for production..."
ng build --configuration production

echo "🔍 Verifying build output..."
if [ ! -f "dist/client/browser/index.html" ]; then
    echo "❌ Error: Build failed. index.html not found in dist/client/browser/"
    exit 1
fi

echo "✅ Build successful! Found index.html in dist/client/browser/"

echo "🌐 Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo "🎉 Deployment complete!"
echo "🔗 Your app is live at: https://ark-studio-88515.web.app"
echo ""
echo "💡 Pro tip: You can also deploy specific services:"
echo "   firebase deploy --only firestore  (for database rules/indexes)"
echo "   firebase deploy --only hosting    (for web app only)"
echo "   firebase deploy                   (for everything)"