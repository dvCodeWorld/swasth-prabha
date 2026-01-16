# Setup HTTPS for PWA

PWA install prompts require HTTPS. Here's how to set it up on your VPS.

## Prerequisites

- Domain name pointed to your VPS IP (62.72.57.68)
- SSH access to VPS

## Step 1: Install Nginx

```bash
ssh root@62.72.57.68

# Install Nginx
apt update
apt install nginx -y
```

## Step 2: Configure Nginx as Reverse Proxy

```bash
# Create Nginx configuration
nano /etc/nginx/sites-available/swasth-prabha
```

Add this configuration (replace `your-domain.com` with your actual domain):

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Don't cache service worker
    location = /ngsw-worker.js {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    location = /ngsw.json {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }
}
```

Enable the site:

```bash
ln -s /etc/nginx/sites-available/swasth-prabha /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

## Step 3: Install SSL Certificate with Let's Encrypt

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate (replace with your domain)
certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow the prompts:
# - Enter email address
# - Agree to terms
# - Choose to redirect HTTP to HTTPS (option 2)
```

## Step 4: Configure Firewall

```bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw enable
```

## Step 5: Update Environment Configuration

Update `src/environments/environment.production.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-domain.com/api', // Use HTTPS
};
```

## Step 6: Update ngsw-config.json

Update API URLs to use your domain:

```json
{
  "dataGroups": [
    {
      "name": "api-cache",
      "urls": [
        "https://your-domain.com/api/**",
        "/api/**"
      ],
      ...
    }
  ]
}
```

## Step 7: Rebuild and Deploy

```bash
# On local machine
git add .
git commit -m "Update for HTTPS"
git push
```

GitHub Actions will automatically deploy.

## Step 8: Test PWA Install

1. Visit `https://your-domain.com` (HTTPS)
2. Open Chrome DevTools > Application > Manifest
3. Verify manifest is loaded correctly
4. Check "Service Workers" tab - should show registered worker
5. Install prompt should appear in address bar

## Verify PWA Criteria

Chrome requires these for install prompt:

✅ Served over HTTPS
✅ Has a valid manifest.webmanifest
✅ Has a registered service worker
✅ Has icons (192x192 and 512x512)
✅ Has start_url
✅ Has name or short_name
✅ Has display: standalone or fullscreen

## Auto-Renewal of SSL Certificate

Certbot automatically sets up renewal. Verify:

```bash
certbot renew --dry-run
```

## Access Your PWA

- **Production**: https://your-domain.com
- **Install**: Click install icon in Chrome address bar
- **API**: https://your-domain.com/api

## Troubleshooting

### Install Prompt Not Showing

1. Check HTTPS is working
2. Open DevTools > Console - check for errors
3. Open DevTools > Application > Manifest - verify it loads
4. Open DevTools > Application > Service Workers - verify registration
5. Check Lighthouse PWA audit

### Service Worker Not Registering

1. Clear browser cache
2. Unregister old service workers in DevTools
3. Hard reload (Ctrl+Shift+R)
4. Check ngsw.json is accessible at `/ngsw.json`

### Mixed Content Errors

Ensure all resources (API, fonts, images) use HTTPS or relative URLs.
