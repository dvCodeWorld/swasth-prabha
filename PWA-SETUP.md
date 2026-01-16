# PWA Setup Guide - Swasth Prabha

## Overview

This application is configured as a Production-Ready Progressive Web App (PWA) with offline support, automatic updates, and installability.

## Features Implemented

### 1. Service Worker Configuration

- **Location**: `ngsw-config.json`
- **Asset Caching**: App shell and static assets are prefetched
- **API Caching**: API responses cached with freshness strategy (1 hour max age)
- **Font Caching**: Google Fonts cached with performance strategy (7 days max age)
- **Update Strategy**: Prefetch for app updates

### 2. Web App Manifest

- **Location**: `public/manifest.webmanifest`
- **Features**:
  - App name and description
  - Theme colors (#1976d2)
  - Multiple icon sizes (72x72 to 512x512)
  - Standalone display mode
  - Portrait orientation
  - Categories: health, medical, lifestyle

### 3. PWA Services

#### PwaService (`src/app/services/pwa.service.ts`)

- Checks for updates every 6 hours
- Prompts user when new version is available
- Handles unrecoverable errors
- Auto-reload on update activation

#### OfflineService (`src/app/services/offline.service.ts`)

- Monitors online/offline status
- Provides reactive signal for network state
- Can be used to show offline indicators

### 4. Meta Tags & Icons

- Theme color meta tag
- Apple touch icon support
- Apple mobile web app capabilities
- Description meta tag for SEO

## Building for Production

### Build Command

```bash
npm run build:prod
```

This will:

- Build the app with production optimizations
- Generate the service worker (`ngsw-worker.js`)
- Create the `ngsw.json` configuration file
- Output to `dist/swasth-prabha/browser`

### Serve Production Build

```bash
npm run start:prod
```

## Testing PWA Features

### 1. Local Testing with HTTP Server

Install http-server globally (if not already):

```bash
npm install -g http-server
```

Build and serve:

```bash
npm run build:prod
cd dist/swasth-prabha/browser
http-server -p 8080 -c-1
```

Access at: `http://localhost:8080`

### 2. Test with Chrome DevTools

1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. Check:
   - **Manifest**: Verify manifest.webmanifest is loaded
   - **Service Workers**: Verify ngsw-worker.js is registered
   - **Cache Storage**: Check cached assets
   - **Offline**: Toggle offline mode to test offline functionality

### 3. Lighthouse Audit

1. Open Chrome DevTools
2. Go to **Lighthouse** tab
3. Select **Progressive Web App** category
4. Click **Generate report**
5. Aim for 100% PWA score

### 4. Install PWA

1. Build and serve production app
2. Open in Chrome
3. Look for install prompt in address bar
4. Click install to add to home screen/desktop

## Service Worker Registration

The service worker is only enabled in production mode:

- **Development**: Service worker is disabled
- **Production**: Service worker is enabled and registers after app stabilizes (30 seconds)

Configuration in `src/app/app.config.ts`:

```typescript
provideServiceWorker('ngsw-worker.js', {
  enabled: !isDevMode(),
  registrationStrategy: 'registerWhenStable:30000',
});
```

## Caching Strategies

### Asset Groups

1. **App Shell** (prefetch):

   - index.html
   - JavaScript bundles
   - CSS files
   - favicon.ico
   - manifest.webmanifest

2. **Assets** (lazy):
   - Icons
   - Images (svg, png, jpg, etc.)
   - Fonts (woff, woff2, ttf, otf)

### Data Groups

1. **API Cache** (freshness strategy):

   - Max size: 100 entries
   - Max age: 1 hour
   - Timeout: 10 seconds
   - URLs: localhost:3000/**, /api/**

2. **External Resources** (performance strategy):
   - Max size: 50 entries
   - Max age: 7 days
   - URLs: Google Fonts

## Update Flow

1. User opens the app
2. Service worker checks for updates every 6 hours
3. If update found, user is prompted
4. On confirmation, new version is activated
5. App reloads with new version

## Offline Support

The app will work offline with cached resources:

- Previously visited pages
- Cached API responses (up to 1 hour old)
- All static assets

## Troubleshooting

### Service Worker Not Registering

- Ensure you're running production build
- Check browser console for errors
- Verify HTTPS or localhost (required for service workers)

### Updates Not Working

- Clear service worker cache in DevTools
- Unregister service worker and reload
- Check `ngsw.json` is generated in build output

### Cache Issues

- Clear all cache in Application > Storage
- Rebuild the application
- Check cache storage in DevTools

### PWA Not Installable

- Verify manifest.webmanifest is accessible
- Check all required icons are present
- Ensure HTTPS (or localhost)
- Verify service worker is registered

## Production Checklist

- [x] Service worker configured
- [x] Web app manifest created
- [x] Icons generated (all sizes)
- [x] Meta tags added
- [x] Update service implemented
- [x] Offline detection implemented
- [x] Production build configured
- [x] Caching strategies defined
- [x] Navigation URLs configured

## Next Steps

1. **Customize Icons**: Replace default icons in `public/icons/` with your app's branding
2. **Update Manifest**: Modify `public/manifest.webmanifest` with your app details
3. **Configure API URLs**: Update data group URLs in `ngsw-config.json` for production API
4. **Add Offline UI**: Use `OfflineService` to show offline indicators in your components
5. **Test Thoroughly**: Run Lighthouse audits and test on various devices
6. **Deploy**: Deploy to HTTPS-enabled hosting (required for PWA)

## Resources

- [Angular Service Worker Guide](https://angular.dev/ecosystem/service-workers)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Web App Manifest](https://web.dev/add-manifest/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
