# Vercel Deployment Guide

This guide explains how to deploy the Comestag frontend to Vercel and the backend to a separate hosting platform.

## Architecture Overview

Since Vercel doesn't support running Spring Boot applications, we need to deploy:
- **Frontend (Next.js)**: Deploy to Vercel
- **Backend (Spring Boot)**: Deploy to a platform that supports Java (Railway, Render, Fly.io, AWS, etc.)

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. A backend hosting platform account (Railway, Render, Fly.io, or AWS)
3. A PostgreSQL database (can be provided by your hosting platform or use a service like Supabase, Neon, or Railway)
4. Environment variables configured

## Step 1: Deploy Backend

First, deploy your Spring Boot backend to a hosting platform. Here are recommended options:

### Option A: Railway (Recommended)

1. Go to https://railway.app
2. Create a new project
3. Connect your GitHub repository
4. Add a PostgreSQL service
5. Add a new service from your repository
6. Set the root directory to `comestag` (not `comestag/frontend`)
7. Configure environment variables (see below)
8. Railway will automatically detect it's a Java application and build it

### Option B: Render

1. Go to https://render.com
2. Create a new Web Service
3. Connect your GitHub repository
4. Set:
   - **Build Command**: `cd comestag && ./mvnw clean package -DskipTests`
   - **Start Command**: `cd comestag && java -jar target/comestag-0.0.1-SNAPSHOT.jar`
   - **Root Directory**: `comestag`
5. Add a PostgreSQL database
6. Configure environment variables

### Option C: Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Create a `fly.toml` in the `comestag` directory (see example below)
3. Run `fly launch` from the `comestag` directory
4. Configure environment variables

### Backend Environment Variables

Set these in your backend hosting platform:

```bash
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-host:5432/comestag
SPRING_DATASOURCE_USERNAME=your-db-user
DB_PASSWORD=your-db-password

# JWT Security
APP_SECURITY_JWT_SECRET=your-very-long-random-secret-key-here

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
MAIL_FROM=your-email@example.com
MAIL_FROM_NAME=Comestag

# CORS (Important! Set to your Vercel domain)
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-custom-domain.com

# Optional: Verification Code Secret
VERIFICATION_CODE_SECRET=your-verification-secret

# Optional: Token durations (in seconds)
AUTH_TOKEN_REFRESH_DURATION=18000
AUTH_TOKEN_ACCESS_DURATION=1800
```

**Important**: After deploying, note your backend URL (e.g., `https://your-backend.railway.app` or `https://your-backend.onrender.com`)

## Step 2: Deploy Frontend to Vercel

### ⚠️ SSL Certificate Issues?

If you encounter `SELF_SIGNED_CERT_IN_CHAIN` errors, **use Method 2 (GitHub Integration)** instead. It's more reliable and doesn't require dealing with SSL certificates.

### Method 1: Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Navigate to the frontend directory:
   ```bash
   cd comestag/frontend
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy:
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No**
   - Project name? (Press Enter for default or enter a custom name)
   - Directory? `./frontend` (or just `.` if you're already in the frontend directory)
   - Override settings? **No**

5. Set environment variables:
   ```bash
   vercel env add NEXT_PUBLIC_API_BASE_URL
   ```
   Enter your backend URL (e.g., `https://your-backend.railway.app`)
   
   ```bash
   vercel env add NEXT_PUBLIC_DEV_MODE
   ```
   Enter `false` for production

6. Redeploy with environment variables:
   ```bash
   vercel --prod
   ```

### Method 2: Vercel Dashboard (Recommended - No SSL Issues)

**This is the recommended method** as it avoids SSL certificate problems and provides better integration.

1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `comestag/frontend`
   - **Build Command**: `npm run build` (or leave default)
   - **Output Directory**: `.next` (or leave default)
   - **Install Command**: `npm install` (or leave default)

5. Add Environment Variables:
   - Go to Project Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_API_BASE_URL`: Your backend URL (e.g., `https://your-backend.railway.app`)
     - `NEXT_PUBLIC_DEV_MODE`: `false`

6. Click "Deploy"

## Step 3: Configure CORS

Make sure your backend CORS configuration includes your Vercel domain:

```bash
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-custom-domain.com
```

Update this in your backend hosting platform's environment variables.

## Step 4: Custom Domain (Optional)

1. In Vercel dashboard, go to your project → Settings → Domains
2. Add your custom domain
3. Follow Vercel's instructions to configure DNS
4. Update `CORS_ALLOWED_ORIGINS` in your backend to include the custom domain

## Environment Variables Summary

### Frontend (Vercel)
- `NEXT_PUBLIC_API_BASE_URL`: Backend API URL (e.g., `https://your-backend.railway.app`)
- `NEXT_PUBLIC_DEV_MODE`: Set to `false` for production

### Backend (Railway/Render/Fly.io)
- Database connection variables
- JWT secret
- SendGrid API key
- CORS allowed origins (must include Vercel domain)

## Troubleshooting

### SSL Certificate Errors

If you see `SELF_SIGNED_CERT_IN_CHAIN` errors when using Vercel CLI:

**Solution 1 (Recommended)**: Use GitHub Integration instead of CLI
- Go to Vercel Dashboard → Add New Project
- Import from GitHub
- No SSL issues, automatic deployments

**Solution 2**: Temporarily disable SSL verification (development only):
```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED = "0"
vercel login
```

**Solution 3**: Use the provided PowerShell script:
```powershell
cd comestag/frontend
.\deploy-vercel.ps1 -SkipSSL
```

See `frontend/VERCEL_SSL_FIX.md` for detailed solutions.

### CORS Errors

If you see CORS errors in the browser console:
1. Check that `CORS_ALLOWED_ORIGINS` in your backend includes your Vercel domain
2. Make sure there are no trailing slashes in the URLs
3. Verify the backend is accessible from the browser

### API Connection Errors

1. Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly in Vercel
2. Check that your backend is running and accessible
3. Test the backend URL directly in a browser or with curl

### Build Errors

1. Make sure the root directory in Vercel is set to `comestag/frontend`
2. Check that all dependencies are in `package.json`
3. Review build logs in Vercel dashboard

## Continuous Deployment

Once connected to GitHub, Vercel will automatically deploy on every push to your main branch. You can configure branch-specific deployments in the Vercel dashboard.

## Monitoring

- **Vercel Analytics**: Automatically enabled for performance monitoring
- **Vercel Speed Insights**: Already included in the project
- **Backend Logs**: Check your hosting platform's logs (Railway, Render, etc.)

## Cost Considerations

- **Vercel**: Free tier includes generous limits for personal projects
- **Railway**: Free tier with $5 credit monthly
- **Render**: Free tier available (with limitations)
- **Fly.io**: Free tier with resource limits

For production, consider upgrading to paid tiers for better performance and reliability.
