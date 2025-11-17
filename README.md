# Mittai's Music

> **⚠️ LEGAL NOTICE**: This scaffold uses mock data. If you add YouTube or any third-party content, use official APIs and follow their Developer Policies. This output is for educational/prototyping use only — do not publish a product that violates terms or copyrights.

A complete monorepo React starter for building a music streaming app targeting iOS, Android, and Web. This is a developer scaffold (not a production-ready, licensed music service) that demonstrates core UI/flows similar to music streaming apps.

## 🏗️ Project Structure

```
mittais-music/
├── apps/
│   ├── web/              # Next.js web app (TypeScript)
│   └── mobile/           # Expo React Native app (TypeScript)
├── packages/
│   ├── ui/               # Shared component library
│   └── services/         # Shared services (API, auth, player, storage)
├── pnpm-workspace.yaml   # pnpm workspace configuration
└── package.json          # Root package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- For mobile development: Expo CLI and iOS Simulator / Android Emulator

### Installation

1. **Clone and install dependencies:**
   ```bash
   pnpm install
   ```

2. **Run the web app:**
   ```bash
   pnpm dev:web
   ```
   Open [http://localhost:3000](http://localhost:3000)

3. **Run the mobile app:**
   ```bash
   pnpm dev:mobile
   ```
   This starts the Expo development server. Use the Expo Go app on your device or press `i` for iOS simulator / `a` for Android emulator.

## 📱 Platform Support

- **Web**: Next.js with pages directory (SEO-friendly)
- **iOS**: Expo-managed React Native
- **Android**: Expo-managed React Native
- **Shared UI**: Components work across all platforms via `react-native-web`

## 🛠️ Tech Stack

- **TypeScript** everywhere
- **Next.js** (pages directory) for web
- **Expo** + **React Native** for mobile
- **Zustand** for state management
- **styled-components** for universal styling
- **react-navigation** for mobile navigation
- **expo-av** for mobile audio playback
- **react-player** (web fallback) for web audio
- **@react-native-async-storage/async-storage** for mobile storage
- **localStorage** for web storage

## 📂 Key Features

### Screens & UI

- **Home**: Carousel/banner, trending playlists, genres grid, recommended songs
- **Search**: Debounced search input with local mock data search
- **Playlist**: Track list, add/remove UI skeleton, share button
- **Player**: Full-screen player with artwork, controls, seekbar, queue panel, sleep timer UI, equalizer placeholder
- **Settings**: Theme toggle, backup/restore buttons, account/subscription toggle

### Services

- **API Service**: Mock functions with TODOs for real API integration
- **Player Adapter**: Cross-platform audio playback abstraction
- **Auth Service**: Mock authentication with OAuth placeholders
- **Storage**: Cross-platform storage wrapper (AsyncStorage/localStorage)
- **Payments**: TODOs for Apple/Google in-app purchases

## 🔑 API Keys & Configuration

### Where to Add API Keys

1. **Web App** (`apps/web/`):
   - Create `.env.local` file:
     ```env
     NEXT_PUBLIC_YT_API_KEY=your_youtube_api_key_here
     NEXT_PUBLIC_API_URL=http://localhost:3001
     ```

2. **Mobile App** (`apps/mobile/`):
   - Create `.env` file:
     ```env
     EXPO_PUBLIC_YT_API_KEY=your_youtube_api_key_here
     EXPO_PUBLIC_API_URL=http://localhost:3001
     ```
   - Install `expo install dotenv` and load in `App.tsx`:
     ```typescript
     import 'dotenv/config';
     ```

3. **Example Secrets File**:
   - See `apps/web/lib/secrets.example.ts` for reference
   - **DO NOT** commit actual secrets to version control
   - Add `secrets.ts` to `.gitignore`

### Getting YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Add the key to your `.env` files

## ⚖️ Legal & Compliance

### YouTube API Usage

**IMPORTANT**: If you plan to use YouTube content:

1. **Use Official YouTube Data API v3**
   - Do NOT scrape or extract audio in violation of terms
   - Follow [YouTube API Services Terms of Service](https://developers.google.com/youtube/terms/api-services-terms-of-service)
   - Review [YouTube Developer Policies](https://developers.google.com/youtube/developer-policies)

2. **Audio Playback**
   - YouTube Data API is for **metadata only**, NOT audio extraction
   - For audio playback, use official YouTube IFrame Player API or obtain proper licenses
   - Do NOT download or stream YouTube audio without proper licensing

3. **Music Licensing**
   - Obtain proper music licensing for monetization
   - Contact music rights organizations (ASCAP, BMI, etc.) for commercial use
   - This scaffold is for **educational/prototyping use only**

### Compliance Checklist

- [ ] Review YouTube API Terms of Service
- [ ] Obtain proper API keys and credentials
- [ ] Implement server-side receipt validation for payments
- [ ] Add privacy policy and terms of service
- [ ] Obtain music licensing for commercial use
- [ ] Review App Store and Play Store policies before publishing

## 🧪 Testing

Run tests across all packages:

```bash
pnpm test
```

### Test Structure

- **Unit Tests**: `packages/services/src/__tests__/api.test.ts` (Jest)
- **Component Tests**: `packages/ui/src/__tests__/Button.test.tsx` (React Testing Library)

## 📦 Build Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm dev:web          # Start Next.js dev server
pnpm dev:mobile       # Start Expo dev server

# Build
pnpm build:web        # Build Next.js for production
pnpm build:mobile     # Run expo prebuild (generates native code)

# Testing
pnpm test            # Run all tests

# Type checking
pnpm type-check      # Type check all packages
```

## 🎯 Next Steps Checklist

### Authentication
- [ ] Implement OAuth flow (Google, Apple, etc.)
- [ ] Set up JWT token management
- [ ] Add refresh token handling
- [ ] Implement user profile management

### Backend Integration
- [ ] Set up backend API server
- [ ] Replace mock API functions with real endpoints
- [ ] Implement playlist CRUD operations
- [ ] Add user data persistence
- [ ] Set up backup/restore service

### Player & Audio
- [ ] Integrate `react-native-track-player` for background audio (mobile)
- [ ] Add lock screen controls and media notifications
- [ ] Implement `expo-media-session` for media controls
- [ ] Add proper error handling and retry logic
- [ ] Implement offline caching

### Payments & Subscriptions
- [ ] Integrate Apple In-App Purchases (iOS)
- [ ] Integrate Google Play Billing (Android)
- [ ] Set up server-side receipt validation
- [ ] Implement subscription status checking
- [ ] Add subscription management UI

### Production Readiness
- [ ] Set up CI/CD pipeline
- [ ] Configure environment variables for production
- [ ] Add error tracking (Sentry, etc.)
- [ ] Implement analytics
- [ ] Set up crash reporting
- [ ] Add performance monitoring

### App Store / Play Store
- [ ] Prepare app icons and splash screens
- [ ] Write app descriptions and screenshots
- [ ] Set up App Store Connect / Play Console accounts
- [ ] Submit for review
- [ ] Handle app updates and versioning

## 🐛 Troubleshooting

### Web App Issues

- **Module not found errors**: Run `pnpm install` from root
- **TypeScript errors**: Run `pnpm type-check` to see all errors
- **Next.js build errors**: Check `next.config.js` webpack configuration

### Mobile App Issues

- **Expo start fails**: Clear cache with `expo start -c`
- **Module resolution errors**: Ensure workspace dependencies are linked: `pnpm install`
- **iOS build issues**: Run `cd apps/mobile && npx expo prebuild --clean`
- **Android build issues**: Ensure Android SDK is properly configured

### General Issues

- **pnpm workspace errors**: Ensure `pnpm-workspace.yaml` is correct
- **Type errors in shared packages**: Check `tsconfig.json` paths configuration

## 📚 Documentation

### Key Files to Review

- `packages/services/src/api.ts` - API service with TODOs
- `packages/services/src/playerAdapter.ts` - Player abstraction
- `packages/services/src/auth.ts` - Authentication service
- `apps/web/lib/secrets.example.ts` - API key configuration example

### Code Comments

All services include extensive TODO comments indicating:
- Where to add real API calls
- How to integrate official APIs
- Legal and compliance considerations
- Production implementation guidance

## 🤝 Contributing

This is a starter template. Feel free to:
- Fork and customize for your needs
- Add features and improvements
- Report issues or suggest enhancements

## 📄 License

This project is provided as-is for educational and prototyping purposes. Ensure you comply with all third-party service terms and obtain proper licenses before commercial use.

## ⚠️ Disclaimer

This scaffold is **NOT** a production-ready, licensed music service. It uses mock data and placeholder implementations. Before publishing:

1. Replace all mock data with real API integrations
2. Obtain proper music licensing
3. Comply with all third-party service terms
4. Implement proper authentication and security
5. Add error handling and monitoring
6. Review and comply with App Store / Play Store policies

---

**Built with ❤️ for developers who want to build music streaming apps the right way.**

