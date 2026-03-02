# Vercel 404 NOT_FOUND Error - Fix Guide

## Root Cause Analysis

The 404 NOT_FOUND error on Vercel typically occurs due to:

1. **Incorrect Root Directory**: Vercel needs to know where your Next.js app is located
2. **Package Manager Mismatch**: Using `npm` when `pnpm` is specified in `package.json`
3. **Build Configuration Issues**: Missing or incorrect build settings
4. **Missing Environment Variables**: Required env vars not set

## The Fix

### Step 1: Verify Vercel Project Settings

In your Vercel Dashboard → Project Settings:

1. **Root Directory**: Set to `comestag/frontend`
2. **Framework Preset**: Next.js (auto-detected)
3. **Build Command**: Leave empty (Vercel auto-detects) OR set to `pnpm run build`
4. **Output Directory**: Leave empty (Vercel auto-detects)
5. **Install Command**: Leave empty (Vercel auto-detects) OR set to `pnpm install`

### Step 2: Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com
NEXT_PUBLIC_DEV_MODE=false
```

### Step 3: Update vercel.json (Already Done)

The `vercel.json` has been updated to use `pnpm` instead of `npm` to match your `package.json`.

### Step 4: Verify Build Output

After deployment, check:
- Build logs in Vercel dashboard
- Ensure build completes successfully
- Check that `.next` folder is generated

## Common Issues and Solutions

### Issue 1: "Cannot find module" errors
**Solution**: Ensure `packageManager` in `package.json` matches Vercel's install command

### Issue 2: Build succeeds but 404 on all routes
**Solution**: 
- Check Root Directory is set to `comestag/frontend`
- Verify `app/` directory exists in the root directory
- Check that `app/page.tsx` exists

### Issue 3: API routes return 404
**Solution**: 
- API routes in `app/api/` work on Vercel
- Ensure route handlers export correct HTTP methods (GET, POST, etc.)

### Issue 4: Dynamic routes not working
**Solution**: 
- Next.js App Router dynamic routes work automatically
- Ensure route files follow naming convention: `[param]/page.tsx`

## Verification Checklist

- [ ] Root Directory set to `comestag/frontend` in Vercel
- [ ] Environment variables set correctly
- [ ] Build completes without errors
- [ ] `.next` folder generated in build output
- [ ] `app/page.tsx` exists and is valid
- [ ] `app/layout.tsx` exists and is valid
- [ ] Package manager matches (pnpm)

## Testing After Fix

1. Trigger a new deployment
2. Check build logs for errors
3. Visit the deployment URL
4. Test a few routes:
   - `/` (home page)
   - `/login`
   - `/dashboard`

If issues persist, check the deployment logs in Vercel dashboard for specific error messages.
