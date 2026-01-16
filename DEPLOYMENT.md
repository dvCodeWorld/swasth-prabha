# Production Deployment Guide

## Pre-Deployment Checklist

- [ ] Update `public/manifest.webmanifest` with production details
- [ ] Replace default icons in `public/icons/` with branded icons
- [ ] Update API URLs in `ngsw-config.json` for production
- [ ] Test PWA locally with `npm run pwa:serve`
- [ ] Run Lighthouse audit (aim for 100% PWA score)
- [ ] Test offline functionality
- [ ] Test install prompt
- [ ] Verify service worker registration

## Build for Production

```bash
npm run build:prod
```

Output will be in `dist/swasth-prabha/browser/`

## Deployment Options

### Option 1: Using Express Server (Recommended)

1. Build the application:

```bash
npm run build:prod
```

2. Start the production server:

```bash
npm run start:prod
```

This serves both the Angular app and the JSON server API.

### Option 2: Static Hosting (Netlify, Vercel, Firebase)

1. Build the application:

```bash
npm run build:prod
```

2. Deploy the `dist/swasth-prabha/browser/` folder

3. Configure redirects for SPA routing:

**Netlify** - Create `netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Vercel** - Create `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Firebase** - Update `firebase.json`:

```json
{
  "hosting": {
    "public": "dist/swasth-prabha/browser",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Option 3: Apache Server

1. Upload `dist/swasth-prabha/browser/` contents to server
2. Copy `.htaccess` file to the root directory
3. Ensure mod_rewrite and mod_headers are enabled

### Option 4: Nginx

Add to nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist/swasth-prabha/browser;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(ico|jpg|jpeg|png|gif|svg|js|css|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Don't cache service worker
    location = /ngsw-worker.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    location = /ngsw.json {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    # Security headers
    add_header X-Content-Type-Options "nosniff";
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
}
```

## HTTPS Requirement

PWAs require HTTPS in production (localhost is exempt). Ensure your hosting provides SSL/TLS certificates.

Free options:

- Let's Encrypt
- Cloudflare
- Netlify/Vercel (automatic)

## Post-Deployment Verification

1. **Test Service Worker**:

   - Open DevTools > Application > Service Workers
   - Verify ngsw-worker.js is registered and activated

2. **Test Manifest**:

   - Open DevTools > Application > Manifest
   - Verify all fields are correct

3. **Test Offline**:

   - Open DevTools > Network
   - Check "Offline" checkbox
   - Reload page - should still work

4. **Test Install**:

   - Look for install prompt in browser
   - Install and verify app works standalone

5. **Run Lighthouse**:
   - Open DevTools > Lighthouse
   - Run PWA audit
   - Fix any issues reported

## Environment-Specific Configuration

### Update API URLs

Edit `ngsw-config.json` to use production API:

```json
{
  "dataGroups": [
    {
      "name": "api-cache",
      "urls": [
        "https://your-api.com/**",
        "/api/**"
      ],
      ...
    }
  ]
}
```

### Update Manifest URLs

Edit `public/manifest.webmanifest`:

```json
{
  "scope": "/",
  "start_url": "/",
  ...
}
```

## Monitoring

### Service Worker Updates

Monitor service worker updates in production:

- Check browser console for update messages
- Users will be prompted when updates are available
- Updates check every 6 hours automatically

### Error Tracking

Consider adding error tracking:

- Sentry
- LogRocket
- Google Analytics

## Troubleshooting

### Service Worker Not Updating

1. Clear browser cache
2. Unregister service worker in DevTools
3. Hard reload (Ctrl+Shift+R)
4. Verify ngsw.json has new hash

### Install Prompt Not Showing

1. Verify HTTPS is enabled
2. Check manifest is valid
3. Ensure service worker is registered
4. Check browser console for errors

### Offline Mode Not Working

1. Verify service worker is active
2. Check cache storage in DevTools
3. Ensure assets are being cached
4. Check ngsw-config.json configuration

## Performance Optimization

- [ ] Enable compression (gzip/brotli)
- [ ] Use CDN for static assets
- [ ] Optimize images
- [ ] Enable HTTP/2
- [ ] Monitor Core Web Vitals

## Security

- [ ] Enable HTTPS
- [ ] Set security headers
- [ ] Implement CSP (Content Security Policy)
- [ ] Regular dependency updates
- [ ] Security audits

## Rollback Strategy

If issues occur after deployment:

1. Keep previous build artifacts
2. Redeploy previous version
3. Service worker will update automatically
4. Users will get rollback on next visit

## Continuous Deployment

### GitHub Actions Example

```yaml
name: Deploy PWA

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build:prod
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/swasth-prabha/browser
```

## Support

For issues or questions:

- Check PWA-SETUP.md for configuration details
- Review Angular Service Worker documentation
- Test locally with `npm run pwa:serve`
