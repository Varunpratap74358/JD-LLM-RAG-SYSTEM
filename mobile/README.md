# 📱 Mobile App Setup & Run Guide

## 1. Prerequisites

- **Node.js** installed.
- **Expo Go** app installed on your physical Android/iOS device (optional, but recommended).
- **Android Studio** (for Emulator) OR **Xcode** (for iOS Simulator) if not using a physical device.

## 2. Setup

Open a terminal in the `mobile` directory:

```bash
cd mobile
npm install
```

## 3. Running the App

### Option A: Physical Device (Easiest)
1. Ensure your phone and computer are on the **same Wi-Fi**.
2. Run:
   ```bash
   npx expo start
   ```
3. Scan the QR code with the **Expo Go** app (Android) or Camera (iOS).
4. **Important**: You must update `src/api.ts` to use your computer's IP address (e.g., `http://192.168.1.5:8000`) instead of `localhost`.

### Option B: Android Emulator
1. Open Android Studio and start a virtual device.
2. Run:
   ```bash
   npm run android
   ```
3. The app should launch automatically.
4. It is pre-configured to connect to `http://10.0.2.2:8000` (which forwards to your localhost).

### Option C: Web Browser
1. Run:
   ```bash
   npm run web
   ```

## 4. Troubleshooting
- **Backend Connection Failed**: Ensure the backend is running (`uvicorn main:app --reload` in `backend` folder).
- **Network Error**: Check `src/api.ts`. If on physical device, `localhost` won't work. Use IP.
