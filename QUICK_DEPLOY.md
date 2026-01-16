# Quick Deployment Reference

## 🚀 Automated Deployment (Recommended)

### First Time Setup (One-time only)

1. **Generate SSH Key**:

```bash
ssh-keygen -t ed25519 -C "github-actions" -f github-actions-key
```

2. **Add Public Key to VPS**:

```bash
ssh-copy-id -i github-actions-key.pub root@62.72.57.68
```

3. **Add GitHub Secrets**:

   - Go to: `GitHub Repo → Settings → Secrets and variables → Actions`
   - Add these secrets:
     - `VPS_SSH_KEY`: Content of `github-actions-key` file
     - `VPS_IP`: `62.72.57.68`
     - `VPS_USER`: `root`
     - `VPS_APP_DIR`: `/var/www/swasth-prabha`

4. **Push to GitHub**:

```bash
git add .
git commit -m "Setup automated deployment"
git push origin main
```

### Every Deployment After Setup

Just push your code:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

**That's it!** GitHub Actions will automatically:

- Build your app
- Deploy to VPS
- Restart PM2

Monitor progress: `GitHub → Actions tab`

---

## 🔧 Manual Deployment (Backup Method)

### From Local Machine (PowerShell)

```powershell
# 1. Build
npm run build:prod

# 2. Upload files
scp -r dist/swasth-prabha/browser root@62.72.57.68:/var/www/swasth-prabha/dist/swasth-prabha/
scp server.js root@62.72.57.68:/var/www/swasth-prabha/
scp db.json root@62.72.57.68:/var/www/swasth-prabha/
scp package.json root@62.72.57.68:/var/www/swasth-prabha/

# 3. SSH to VPS and restart
ssh root@62.72.57.68
cd /var/www/swasth-prabha
npm install --production
pm2 restart swasth-prabha
exit
```

---

## 📊 Check Application Status

```bash
ssh root@62.72.57.68
pm2 status
pm2 logs swasth-prabha
```

---

## 🌐 Access Your App

- **Production**: http://62.72.57.68:3000
- **Local Dev**: http://localhost:4200
- **Local Prod Test**: http://localhost:3000

---

## 🔄 Common Commands

### Local Development

```bash
npm run dev          # Start dev server + backend
npm run build:prod   # Build production
npm run start:prod   # Test production locally
```

### VPS Management

```bash
pm2 restart swasth-prabha   # Restart app
pm2 logs swasth-prabha      # View logs
pm2 stop swasth-prabha      # Stop app
pm2 start swasth-prabha     # Start app
pm2 monit                   # Monitor resources
```

---

## ⚠️ Troubleshooting

### GitHub Actions Fails

1. Check Actions tab for error logs
2. Verify all 4 secrets are set correctly
3. Test SSH manually: `ssh root@62.72.57.68`

### App Not Working After Deploy

```bash
ssh root@62.72.57.68
pm2 logs swasth-prabha --lines 50
pm2 restart swasth-prabha
```

### Need to Rollback

1. Go to GitHub Actions
2. Find last successful deployment
3. Click "Re-run all jobs"

---

## 📝 Environment Files

- **Development**: `src/environments/environment.ts` → localhost:3000
- **Production**: `src/environments/environment.production.ts` → 62.72.57.68:3000

Angular automatically uses the right one based on build mode.
