# GitHub Actions Deployment Setup

This guide will help you set up automated deployment to your VPS using GitHub Actions.

## Prerequisites

- GitHub repository for your project
- VPS server with SSH access (62.72.57.68)
- PM2 already installed and configured on VPS

## Step 1: Generate SSH Key for GitHub Actions

On your **local machine**, generate a new SSH key pair:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f github-actions-key
```

This creates two files:

- `github-actions-key` (private key)
- `github-actions-key.pub` (public key)

## Step 2: Add Public Key to VPS

Copy the public key to your VPS:

```bash
ssh-copy-id -i github-actions-key.pub root@62.72.57.68
```

Or manually:

```bash
# Copy the public key content
cat github-actions-key.pub

# SSH to VPS
ssh root@62.72.57.68

# Add to authorized_keys
echo "your-public-key-content" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

## Step 3: Add Secrets to GitHub Repository

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

### Required Secrets:

| Secret Name   | Value                                | Description                        |
| ------------- | ------------------------------------ | ---------------------------------- |
| `VPS_SSH_KEY` | Content of `github-actions-key` file | Private SSH key for authentication |
| `VPS_IP`      | `62.72.57.68`                        | Your VPS IP address                |
| `VPS_USER`    | `root`                               | SSH username                       |
| `VPS_APP_DIR` | `/var/www/swasth-prabha`             | Application directory on VPS       |

### How to add VPS_SSH_KEY:

```bash
# On Windows PowerShell
Get-Content github-actions-key | Set-Clipboard

# On Linux/Mac
cat github-actions-key | pbcopy  # Mac
cat github-actions-key | xclip   # Linux
```

Then paste the entire content (including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`) into the GitHub secret.

## Step 4: Push Your Code to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit with GitHub Actions deployment"

# Add remote (replace with your repository URL)
git remote add origin https://github.com/yourusername/swasth-prabha.git

# Push to main branch
git push -u origin main
```

## Step 5: Verify Deployment

1. Go to your GitHub repository
2. Click on **Actions** tab
3. You should see the "Deploy to VPS" workflow running
4. Click on the workflow to see deployment progress

## How It Works

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:

1. ✅ Checks out your code
2. ✅ Sets up Node.js 20
3. ✅ Installs dependencies
4. ✅ Builds production bundle
5. ✅ Connects to VPS via SSH
6. ✅ Uploads built files to VPS
7. ✅ Installs production dependencies on VPS
8. ✅ Restarts PM2 application

## Triggering Deployment

Deployment happens automatically when you:

- Push to `main` or `master` branch
- Manually trigger via GitHub Actions UI

### Manual Deployment:

1. Go to **Actions** tab
2. Select "Deploy to VPS" workflow
3. Click **Run workflow**
4. Select branch and click **Run workflow**

## Development Workflow

```bash
# Make changes to your code
# ...

# Test locally
npm run dev

# Build and test production
npm run build:prod
npm run start:prod

# Commit and push
git add .
git commit -m "Your commit message"
git push origin main

# GitHub Actions will automatically deploy! 🚀
```

## Environment Configuration

The app now uses environment files:

- **Development**: `src/environments/environment.ts` → `http://localhost:3000`
- **Production**: `src/environments/environment.production.ts` → `http://62.72.57.68:3000`

Angular automatically uses the correct environment based on build configuration.

## Monitoring Deployments

### View Deployment Logs:

1. GitHub Actions tab → Click on workflow run
2. Click on "deploy" job
3. Expand steps to see detailed logs

### Check Application on VPS:

```bash
ssh root@62.72.57.68
pm2 status
pm2 logs swasth-prabha
```

## Troubleshooting

### Deployment Fails with SSH Error

**Problem**: `Permission denied (publickey)`

**Solution**:

1. Verify SSH key is correct in GitHub secrets
2. Ensure public key is in VPS `~/.ssh/authorized_keys`
3. Check VPS SSH configuration allows key authentication

### Build Fails

**Problem**: Build errors in GitHub Actions

**Solution**:

1. Test build locally: `npm run build:prod`
2. Fix any TypeScript/build errors
3. Commit and push again

### PM2 Restart Fails

**Problem**: Application doesn't restart

**Solution**:

```bash
ssh root@62.72.57.68
pm2 delete swasth-prabha
pm2 start /var/www/swasth-prabha/server.js --name swasth-prabha
pm2 save
```

### Files Not Uploading

**Problem**: SCP fails

**Solution**:

1. Verify `VPS_APP_DIR` secret is correct
2. Ensure directory exists on VPS
3. Check VPS disk space: `df -h`

## Security Best Practices

✅ **DO**:

- Use dedicated SSH key for GitHub Actions
- Restrict SSH key permissions on VPS
- Use GitHub Secrets for sensitive data
- Regularly rotate SSH keys

❌ **DON'T**:

- Commit SSH keys to repository
- Share SSH keys
- Use root password authentication
- Hardcode sensitive data in code

## Rollback Strategy

If deployment breaks the application:

```bash
# SSH to VPS
ssh root@62.72.57.68

# View PM2 logs
pm2 logs swasth-prabha

# Restart application
pm2 restart swasth-prabha

# Or redeploy previous version from GitHub
# Go to Actions → Select successful deployment → Re-run jobs
```

## Advanced Configuration

### Deploy to Staging First

Create `.github/workflows/deploy-staging.yml`:

```yaml
name: Deploy to Staging

on:
  push:
    branches:
      - develop

jobs:
  deploy:
    # Same as deploy.yml but use staging secrets
    # VPS_STAGING_IP, VPS_STAGING_APP_DIR, etc.
```

### Add Deployment Notifications

Add to workflow after deployment:

```yaml
- name: Notify deployment
  if: success()
  run: |
    # Send notification (Slack, Discord, Email, etc.)
```

### Run Tests Before Deploy

Add before build step:

```yaml
- name: Run tests
  run: npm test
```

## Cost Optimization

- GitHub Actions is **free** for public repositories
- Private repositories get 2,000 minutes/month free
- Each deployment takes ~2-5 minutes

## Next Steps

1. ✅ Set up GitHub repository
2. ✅ Configure GitHub Secrets
3. ✅ Push code to trigger first deployment
4. ✅ Monitor deployment in Actions tab
5. ✅ Verify application is running
6. 🎉 Enjoy automated deployments!

## Support

For issues:

- Check GitHub Actions logs
- Review VPS PM2 logs: `pm2 logs swasth-prabha`
- Verify secrets are correctly configured
- Test SSH connection manually

---

**Your deployment is now automated! Every push to main will deploy to production automatically.** 🚀
