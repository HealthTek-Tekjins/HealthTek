# HealthTek

## Overview
HealthTek is a mobile application built using React Native with Expo for cross-platform development on iOS and Android. The app integrates Firebase for authentication (specifically Google Sign-In) and potentially other backend services like Firestore or Realtime Database. The primary goal of HealthTek is to provide users with a seamless experience for health-related functionalities, such as tracking health metrics or accessing health resources, with secure user authentication via Google Sign-In.

This README provides detailed instructions on how to set up, configure, and run the HealthTek application locally for development, as well as how to build and deploy it for testing or production.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Required Programs](#required-programs)
3. [Project Setup](#project-setup)
   - Clone the Repository
   - Install Dependencies
   - Configure Environment Variables
4. [Firebase Setup](#firebase-setup)
5. [Google Cloud Console Setup](#google-cloud-console-setup)
6. [Running the Application Locally](#running-the-application-locally)
   - Using Expo Go (Not Recommended for Google Sign-In)
   - Using a Development Build (Recommended)
7. [Building for Production](#building-for-production)
8. [Troubleshooting](#troubleshooting)
9. [Contributing](#contributing)
10. [License](#license)

## Prerequisites
Before setting up HealthTek, ensure you have the following:
- **Operating System:** Windows 10/11, macOS, or Linux (macOS required for iOS development).
- **Node.js:** Version 18.x or later (LTS recommended).
- **npm or Yarn:** npm comes with Node.js; Yarn is optional but supported.
- **Expo Account:** Sign up for a free account at [expo.dev](https://expo.dev).
- **Google Account:** For Firebase and Google Cloud Console access.
- **Git:** For cloning the repository.
- **A Physical Device or Emulator/Simulator:**
  - **Android:** Android device with Expo Go app or Android Emulator (via Android Studio).
  - **iOS:** iOS device with Expo Go app or iOS Simulator (macOS only, via Xcode).
- **Firebase Project:** Already created (e.g., `healthtek-9f1dc`).
- **Google Cloud Credentials:** OAuth 2.0 Client IDs for Web, Android, and iOS.

## Required Programs
Install the following programs before proceeding:

### Node.js and npm:
Download and install from [nodejs.org](https://nodejs.org/).
Verify installation:
```bash
node --version
npm --version
```

### Expo CLI:
Install globally using npm:
```bash
npm install -g expo-cli
```
Verify installation:
```bash
expo --version
```

### EAS CLI (Expo Application Services):
Install globally for building development and production builds:
```bash
npm install -g eas-cli
```
Verify installation:
```bash
eas --version
```

### Git:
Download and install from [git-scm.com](https://git-scm.com).
Verify installation:
```bash
git --version
```

### Android Studio (for Android Development):
Download and install from [developer.android.com/studio](https://developer.android.com/studio).
Set up an Android Virtual Device (AVD) for emulation.

### Xcode (for iOS Development, macOS Only):
Download from the Mac App Store or [developer.apple.com/xcode](https://developer.apple.com/xcode).
Install Xcode Command Line Tools:
```bash
xcode-select --install
```

## Project Setup
### Clone the Repository
```bash
git clone https://github.com/your-username/healthtek.git
cd healthtek
```

### Install Dependencies
```bash
npm install
```

### Configure Environment Variables
Create a `.env` file in the root directory:
```bash
touch .env
```
Add the following environment variables:
```ini
GOOGLE_WEB_CLIENT_ID=your-web-client-id
GOOGLE_ANDROID_CLIENT_ID=your-android-client-id
GOOGLE_IOS_CLIENT_ID=your-ios-client-id
```
Install `dotenv` if not already included:
```bash
npm install dotenv
```

## Firebase Setup
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project (`healthtek-9f1dc`).
3. Enable Google authentication.
4. Download configuration files (`google-services.json` and `GoogleService-Info.plist`).
5. Place them in the `config/` directory.

## Google Cloud Console Setup
1. Navigate to [Google Cloud Console](https://console.cloud.google.com/).
2. Enable necessary APIs:
   - Google Sign-In API
   - Identity Toolkit API
3. Configure OAuth 2.0 credentials.

## Running the Application Locally
### Using Expo Go (Not Recommended for Google Sign-In)
```bash
expo start
```
Scan the QR code using the Expo Go app.

### Using a Development Build (Recommended)
```bash
eas build --platform android --profile development
eas build --platform ios --profile development
```
Download and install the build on your device.
Start the development server:
```bash
expo start --dev-client
```

## Building for Production
Update `eas.json` for production:
```json
{
  "build": {
    "production": {
      "distribution": "store"
    }
  }
}
```
Run the build command:
```bash
eas build --platform android --profile production
eas build --platform ios --profile production
```

## Troubleshooting
### Common Issues and Fixes
- **Google Sign-In Error:** Ensure redirect URI is correctly set in Google Cloud Console.
- **SHA-1 Mismatch:** Update the SHA-1 fingerprint in Firebase.
- **Expo Go Redirect Issue:** Use a development build instead of Expo Go.
- **App Crashes on Launch:** Check logs with:
  ```bash
  expo start --dev-client
  ```

## Contributing
We welcome contributions to HealthTek! To contribute:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Make changes and commit:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a Pull Request on GitHub.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

For support, contact `fmotjoka@gmail.com`.

