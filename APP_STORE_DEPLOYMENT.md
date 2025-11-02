# App Store Deployment Guide for ViScan

## Overview

This guide will help you deploy ViScan to both Apple App Store and Google Play Store using Capacitor.

## Prerequisites

- **Apple Developer Account**: msmbm2003@gmail.com ($99/year)
- **Google Play Console Account**: msmbm2003@gmail.com ($25 one-time)
- **Mac computer** (required for iOS builds)
- **Xcode** (latest version from Mac App Store)
- **Android Studio** (for Android builds)
- **Node.js** and **pnpm** installed

## Step 1: Install Capacitor

```bash
cd /home/ubuntu/viscan-app
pnpm add @capacitor/core @capacitor/cli
pnpm add @capacitor/ios @capacitor/android
```

## Step 2: Initialize Capacitor

```bash
npx cap init
```

When prompted:

- **App name**: ViScan
- **App ID**: com.viscan.app
- **Web asset directory**: client/dist

## Step 3: Build Web App

```bash
pnpm run build
```

## Step 4: Add Platforms

```bash
# Add iOS
npx cap add ios

# Add Android
npx cap add android
```

## Step 5: Configure iOS

### Update Info.plist

Edit `ios/App/App/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>ViScan needs camera access to capture medical images for analysis</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>ViScan needs photo library access to select images for analysis</string>

<key>NSPhotoLibraryAddUsageDescription</key>
<string>ViScan needs permission to save analysis results to your photo library</string>
```

### Configure Signing

1. Open Xcode:

```bash
npx cap open ios
```

2. Select the project in left sidebar
3. Go to "Signing & Capabilities"
4. Select your team: msmbm2003@gmail.com
5. Bundle Identifier: com.viscan.app
6. Enable "Automatically manage signing"

### Add Capabilities

In Xcode, click "+ Capability":

- Sign In with Apple
- Push Notifications (optional)
- Background Modes (if needed)

## Step 6: Configure Android

### Update AndroidManifest.xml

Edit `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.INTERNET" />
```

### Configure build.gradle

Edit `android/app/build.gradle`:

```gradle
android {
    compileSdkVersion 34
    defaultConfig {
        applicationId "com.viscan.app"
        minSdkVersion 22
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
}
```

### Generate Signing Key

```bash
keytool -genkey -v -keystore viscan-release-key.keystore -alias viscan -keyalg RSA -keysize 2048 -validity 10000
```

Save the keystore file and passwords securely!

## Step 7: Create App Icons

### iOS Icons (Required sizes):

- 20x20 (2x, 3x)
- 29x29 (2x, 3x)
- 40x40 (2x, 3x)
- 60x60 (2x, 3x)
- 76x76 (1x, 2x)
- 83.5x83.5 (2x)
- 1024x1024 (1x, App Store)

### Android Icons (Required sizes):

- mdpi: 48x48
- hdpi: 72x72
- xhdpi: 96x96
- xxhdpi: 144x144
- xxxhdpi: 192x192

### Generate Icons Automatically:

```bash
# Install icon generator
pnpm add -D @capacitor/assets

# Generate icons
npx capacitor-assets generate
```

Place your source icon (1024x1024 PNG) in `resources/icon.png`

## Step 8: Create Splash Screens

Place splash screen (2732x2732 PNG) in `resources/splash.png`

```bash
npx capacitor-assets generate --splash
```

## Step 9: Build for iOS

### Development Build:

```bash
# Sync changes
npx cap sync ios

# Open in Xcode
npx cap open ios

# In Xcode:
# 1. Select target device or simulator
# 2. Click Run button (▶️)
```

### Production Build:

1. In Xcode, select "Any iOS Device"
2. Product → Archive
3. Wait for archive to complete
4. Click "Distribute App"
5. Choose "App Store Connect"
6. Follow the wizard

## Step 10: Submit to App Store

### Prepare App Store Connect:

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Sign in with: msmbm2003@gmail.com
3. Click "My Apps" → "+" → "New App"

Fill in:

- **Platform**: iOS
- **Name**: ViScan - AI Medical Analysis
- **Primary Language**: English
- **Bundle ID**: com.viscan.app
- **SKU**: viscan-001
- **User Access**: Full Access

### App Information:

- **Category**: Medical
- **Secondary Category**: Health & Fitness
- **Content Rights**: Check if you own rights
- **Age Rating**: 17+ (Medical/Treatment Information)

### Pricing:

- **Price**: Free (or set your price)
- **Availability**: All countries

### App Privacy:

Answer questions about data collection:

- Health data: Yes
- User content: Yes
- Contact info: Yes
- Usage data: Yes

### Screenshots (Required):

- 6.7" Display (iPhone 14 Pro Max): 1290 x 2796
- 6.5" Display: 1242 x 2688
- 5.5" Display: 1242 x 2208

Minimum 3 screenshots per size.

### App Preview Video (Optional):

- 30 seconds max
- Show key features
- No audio narration needed

### Description:

```
ViScan - AI-Powered Medical Image Analysis

Transform medical images into actionable insights with advanced AI technology. ViScan provides rapid, accurate analysis of:

• Iris Scanning & Iridology
• X-rays & Radiographs
• MRI Scans
• CT Scans
• Facial Diagnosis
• Palm Reading

Key Features:
✓ Advanced AI Analysis
✓ Instant Results
✓ Detailed Health Reports
✓ PDF Export
✓ Secure & Private
✓ Professional Grade

Trusted by healthcare professionals worldwide.

Note: This app is for informational purposes only and should not replace professional medical advice.
```

### Keywords:

```
medical, health, AI, diagnosis, iris, scanning, analysis, healthcare, radiology, MRI, xray
```

### Support URL:

```
https://viscan.app/support
```

### Marketing URL:

```
https://viscan.app
```

### Build Upload:

1. In Xcode, after archiving, upload to App Store Connect
2. Wait for processing (15-60 minutes)
3. Select the build in App Store Connect
4. Submit for Review

### Review Notes:

```
Test Account:
Email: test@viscan.app
Password: TestUser123!

Instructions:
1. Sign in with test account
2. Upload a sample iris image
3. View analysis results
4. Check recommendations

The app uses AI for medical image analysis. All data is securely stored and encrypted.
```

## Step 11: Build for Android

### Development Build:

```bash
# Sync changes
npx cap sync android

# Open in Android Studio
npx cap open android

# In Android Studio:
# 1. Wait for Gradle sync
# 2. Select device/emulator
# 3. Click Run button (▶️)
```

### Production Build:

```bash
# Build release APK
cd android
./gradlew assembleRelease

# Or build App Bundle (recommended)
./gradlew bundleRelease
```

Output:

- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

### Sign the Build:

Edit `android/app/build.gradle`:

```gradle
android {
    signingConfigs {
        release {
            storeFile file('../../viscan-release-key.keystore')
            storePassword 'your_keystore_password'
            keyAlias 'viscan'
            keyPassword 'your_key_password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

## Step 12: Submit to Google Play

### Prepare Google Play Console:

1. Go to [Google Play Console](https://play.google.com/console/)
2. Sign in with: msmbm2003@gmail.com
3. Click "Create app"

Fill in:

- **App name**: ViScan - AI Medical Analysis
- **Default language**: English (United States)
- **App or game**: App
- **Free or paid**: Free

### Store Listing:

- **Short description** (80 chars):

```
AI-powered medical image analysis for iris scanning, X-rays, MRIs, and more
```

- **Full description** (4000 chars):

```
[Same as iOS description above]
```

- **App icon**: 512x512 PNG
- **Feature graphic**: 1024x500 PNG
- **Screenshots**: Minimum 2, up to 8 (phone, tablet, TV)

### Content Rating:

Complete questionnaire:

- Medical reference app
- No violence, sexual content, etc.

### Target Audience:

- Age: 18+
- Target children: No

### Privacy Policy:

URL: https://viscan.app/privacy

### App Access:

- All functionality available without restrictions
- Or provide test account if needed

### Upload App Bundle:

1. Go to "Production" → "Create new release"
2. Upload your AAB file
3. Add release notes
4. Review and rollout

## Step 13: Post-Submission

### iOS Review Time:

- Usually 24-48 hours
- Can take up to 7 days

### Android Review Time:

- Usually few hours
- Can take up to 7 days

### Common Rejection Reasons:

**iOS:**

- Missing privacy policy
- Incomplete app information
- Crashes or bugs
- Misleading medical claims

**Android:**

- Missing content rating
- Privacy policy issues
- Permissions not justified

## Step 14: Updates

### For future updates:

```bash
# 1. Make changes to your code
# 2. Update version in package.json
# 3. Build
pnpm run build

# 4. Sync
npx cap sync

# 5. iOS: Archive in Xcode and upload
# 6. Android: Build and upload new AAB
```

## Maintenance

### Update Capacitor:

```bash
pnpm update @capacitor/core @capacitor/cli
pnpm update @capacitor/ios @capacitor/android
npx cap sync
```

### Monitor:

- App Store Connect: Reviews, ratings, crashes
- Google Play Console: Reviews, ratings, crashes
- Firebase Analytics: User behavior

## Resources

- [Capacitor Docs](https://capacitorjs.com/docs)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Android Design Guidelines](https://developer.android.com/design)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy](https://play.google.com/about/developer-content-policy/)

## Account Information

- **Apple Developer**: msmbm2003@gmail.com
- **Google Play Console**: msmbm2003@gmail.com
- **Bundle ID (iOS)**: com.viscan.app
- **Package Name (Android)**: com.viscan.app
- **App Name**: ViScan - AI Medical Analysis

## Support

For issues or questions:

- Email: msmbm2003@gmail.com
- Website: https://viscan.app
