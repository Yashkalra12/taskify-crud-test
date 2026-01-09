# Deployment Guide

This guide will help you set up GitHub Actions for CI/CD and deploy your project to Vercel.

## Option 1: Vercel GitHub Integration (Recommended - Easiest)

This is the simplest method and doesn't require GitHub Actions configuration.

### Steps:

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Your Repository**
   - Click "Add New Project"
   - Select your `taskify-crud-test` repository
   - Vercel will auto-detect it's a Vite project

3. **Configure Project Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)
   - Install Command: `npm install` (auto-detected)

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically deploy on every push to main branch

**That's it!** Vercel will handle deployments automatically via their GitHub integration.

---

## Option 2: GitHub Actions with Vercel CLI (Advanced)

If you want more control and use GitHub Actions for deployment:

### Step 1: Get Vercel Credentials

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Link your project**:
   ```bash
   cd /path/to/taskify-crud
   vercel link
   ```
   - Select your scope (personal or team)
   - Select "Set up and deploy" or "Link to existing project"
   - This creates a `.vercel/project.json` file

4. **Get your credentials**:
   - Open `.vercel/project.json` - you'll find:
     - `orgId` → This is your `VERCEL_ORG_ID`
     - `projectId` → This is your `VERCEL_PROJECT_ID`

5. **Get Vercel Token**:
   - Go to [Vercel Account Settings](https://vercel.com/account/tokens)
   - Click "Create Token"
   - Give it a name (e.g., "GitHub Actions")
   - Copy the token → This is your `VERCEL_TOKEN`

### Step 2: Add GitHub Secrets

1. Go to your GitHub repository: `https://github.com/Yashkalra12/taskify-crud-test`

2. Navigate to: **Settings** → **Secrets and variables** → **Actions**

3. Click **"New repository secret"** and add:

   - **Name**: `VERCEL_TOKEN`
   - **Value**: (paste your Vercel token from Step 1.5)

   - **Name**: `VERCEL_ORG_ID`
   - **Value**: (paste your orgId from `.vercel/project.json`)

   - **Name**: `VERCEL_PROJECT_ID`
   - **Value**: (paste your projectId from `.vercel/project.json`)

### Step 3: Push to GitHub

The GitHub Actions workflow will automatically:
- Run tests on every push
- Build the project
- Deploy to Vercel (only on main branch)

```bash
git add .
git commit -m "Add GitHub Actions and Vercel configuration"
git push origin main
```

### Step 4: Verify Deployment

1. Check GitHub Actions:
   - Go to your repo → **Actions** tab
   - You should see workflows running

2. Check Vercel:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Your project should show deployment status

---

## Workflow Files Explained

### `.github/workflows/ci.yml`
- Runs on every push and pull request
- Executes linting and tests
- Checks test coverage (70% threshold)

### `.github/workflows/deploy.yml`
- Full deployment workflow with:
  - Multi-version Node.js testing
  - Build verification
  - Vercel deployment
- Only runs on main branch pushes

### `.github/workflows/deploy-simple.yml`
- Simplified deployment workflow
- Uses `amondnet/vercel-action` for easier setup
- Alternative to the full deploy.yml

---

## Troubleshooting

### GitHub Actions Failing

1. **Check Secrets**: Ensure all three secrets are set correctly
2. **Check Vercel Token**: Make sure token has proper permissions
3. **Check Logs**: View workflow logs in GitHub Actions tab

### Vercel Deployment Issues

1. **Build Errors**: Check build logs in Vercel dashboard
2. **Environment Variables**: Add any needed env vars in Vercel dashboard
3. **Node Version**: Ensure Node.js version matches (20.x recommended)

### Test Failures

1. **Coverage Threshold**: Currently set to 70% - adjust in `jest.config.js` if needed
2. **Local Testing**: Run `npm test` locally to debug

---

## Manual Deployment

If you want to deploy manually:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

## Environment Variables

If your app needs environment variables:

1. **Vercel Dashboard**:
   - Go to your project → Settings → Environment Variables
   - Add variables for Production, Preview, and Development

2. **GitHub Actions**:
   - Add secrets in GitHub repository settings
   - Reference them in workflow files as `${{ secrets.VARIABLE_NAME }}`

---

## Next Steps

- ✅ Your project is now set up for CI/CD
- ✅ Every push to main will trigger tests and deployment
- ✅ Pull requests will run tests automatically
- ✅ Monitor deployments in Vercel dashboard

Happy deploying! 🚀

