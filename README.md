# Women's Safety Mobile App

A React Native application focused on women's safety, using biometric data (pulse rate) to monitor emotional states and provide assistance in potentially unsafe situations.

## Features

- **Pulse Rate Monitoring**: Record and track your pulse rate to identify emotional states
- **High Pulse Alert**: Automatic detection and response to elevated pulse rates
- **Emergency SOS Button**: Quick access to emergency assistance
- **Location Tracking**: GPS location sharing during emergencies
- **AI-Powered Advice**: Get contextual safety advice based on your situation
- **Educational Resources**: Learn about the relationship between biometrics and safety

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Clone the repository
```
git clone <repository-url>
cd WomensSafety
```

2. Install dependencies
```
npm install
```

3. Create a `.env` file in the root directory with your API keys
```
GEMINI_API_KEY=your_gemini_api_key_here
HIGH_PULSE_THRESHOLD=120
```

4. Start the Metro bundler
```
npx react-native start
```

5. Run the app on Android
```
npx react-native run-android
```

6. Run the app on iOS (macOS only)
```
npx react-native run-ios
```

## Technical Overview

- **Framework**: React Native
- **State Management**: React Hooks and Context API
- **Storage**: AsyncStorage for local data persistence
- **APIs**: Google Gemini API for AI-assisted responses
- **Location Services**: React Native Geolocation Service
- **Styling**: StyleSheet API with custom components

## Environment Configuration

The app uses react-native-config for environment variables management:
- GEMINI_API_KEY: API key for Google's Gemini AI model
- HIGH_PULSE_THRESHOLD: The BPM threshold to trigger emergency protocols

## Important Code Modules

- **PulseInput**: Component for recording and processing pulse rate data
- **SOSButton**: Emergency assistance button component
- **locationUtils**: Cross-platform utilities for handling location services
- **geminiService**: Service for interacting with the Gemini AI API

## Troubleshooting

### Common Issues

1. **Gemini API Errors**: If you encounter errors with the Gemini API, check:
   - Your API key is valid and correctly set in the .env file
   - You have internet connectivity
   - The app will fall back to offline responses when API is unavailable

2. **Location Services**: On iOS, location permissions must be requested properly. On Android, ensure location services are enabled in device settings.

3. **React Native Config**: If environment variables aren't loading, try:
   ```
   npx react-native-config
   ```

## License

[MIT License](LICENSE)
