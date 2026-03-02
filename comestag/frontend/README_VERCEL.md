# Quick Vercel Deployment Guide

## Prerequisites

1. Install Vercel CLI: `npm i -g vercel`
2. Have your backend deployed and URL ready

## Quick Deploy

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Login to Vercel
vercel login

# 3. Deploy (first time)
vercel

# 4. Set environment variables
vercel env add NEXT_PUBLIC_API_BASE_URL production
# Enter your backend URL when prompted (e.g., https://your-backend.railway.app)

vercel env add NEXT_PUBLIC_DEV_MODE production
# Enter: false

# 5. Deploy to production
vercel --prod
```

## Environment Variables

Set these in Vercel Dashboard → Project Settings → Environment Variables:

- `NEXT_PUBLIC_API_BASE_URL`: Your backend API URL
- `NEXT_PUBLIC_DEV_MODE`: `false` (for production)

## Important Notes

1. **Backend CORS**: Make sure your backend's `CORS_ALLOWED_ORIGINS` includes your Vercel domain
2. **API Routes**: The `/api/proxy` route won't work in Vercel - the frontend will call the backend directly using `NEXT_PUBLIC_API_BASE_URL`
3. **Database**: Your backend needs its own PostgreSQL database

## Troubleshooting

- **CORS Errors**: Check backend CORS configuration includes Vercel domain
- **API Errors**: Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly
- **Build Errors**: Check Vercel build logs in dashboard

For detailed instructions, see `../VERCEL_DEPLOYMENT.md`
