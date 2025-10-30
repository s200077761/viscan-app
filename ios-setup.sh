#!/bin/bash

echo "🚀 ViScan iOS Setup Script"
echo "=========================="
echo ""

# Check if on Mac
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ This script must be run on macOS"
    exit 1
fi

# Check if Xcode is installed
if ! command -v xcodebuild &> /dev/null; then
    echo "❌ Xcode is not installed. Please install Xcode from App Store"
    exit 1
fi

echo "✅ Running on macOS"
echo "✅ Xcode is installed"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build the web app
echo "🔨 Building web application..."
pnpm build

# Initialize Capacitor (if not already done)
if [ ! -f "capacitor.config.ts" ]; then
    echo "⚙️  Initializing Capacitor..."
    npx cap init "ViScan" "com.viscan.medical" --web-dir=dist
fi

# Add iOS platform
if [ ! -d "ios" ]; then
    echo "📱 Adding iOS platform..."
    npx cap add ios
fi

# Copy web assets and sync
echo "🔄 Syncing with iOS..."
npx cap copy ios
npx cap sync ios

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Open the project in Xcode:"
echo "   npx cap open ios"
echo ""
echo "2. In Xcode:"
echo "   - Select your development team"
echo "   - Update bundle identifier if needed"
echo "   - Build and run on simulator or device"
echo ""
echo "3. For App Store submission, follow: IOS_DEPLOYMENT_GUIDE.md"
echo ""
