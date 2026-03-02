# Quick Setup: Connect Vercel + Railway

## 🚀 Quick Steps (5 minutes)

### 1. Get Your Railway Backend URL
- Go to Railway → Your Service → Settings
- Copy the domain (e.g., `https://your-app.up.railway.app`)

### 2. Configure CORS in Railway
- Railway Dashboard → Your Backend Service → Variables
- Add variable:
  - **Name**: `CORS_ALLOWED_ORIGINS`
  - **Value**: `https://your-app.vercel.app` (your Vercel domain)
- Save (Railway will auto-redeploy)

### 3. Configure API URL in Vercel
- Vercel Dashboard → Your Project → Settings → Environment Variables
- Add variable:
  - **Name**: `NEXT_PUBLIC_API_BASE_URL`
  - **Value**: `https://your-app.up.railway.app` (your Railway URL)
  - **Environment**: All (Production, Preview, Development)
- Save

### 4. Redeploy Vercel
- Vercel Dashboard → Deployments → Latest → "..." → Redeploy

### 5. Test
- Visit your Vercel site
- Try logging in
- Check browser console for errors

## ✅ Done!

Your frontend should now communicate with your backend.

## 🔧 Troubleshooting

**CORS Error?**
- Verify `CORS_ALLOWED_ORIGINS` includes your exact Vercel domain (with `https://`)
- Restart Railway service

**API Not Working?**
- Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Redeploy Vercel (env vars require redeploy)
- Check Railway logs to see if requests are arriving

**Still Issues?**
See full guide: `VERCEL_RAILWAY_CONNECTION.md`
