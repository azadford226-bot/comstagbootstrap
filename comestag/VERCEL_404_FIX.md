# Fixing Vercel 404 NOT_FOUND Error

## 1. **The Fix: Root Cause and Solution**

### Root Cause
The 404 error occurs because Vercel cannot find your Next.js application. This happens when:
- **Root Directory is incorrect**: Vercel is looking in the wrong folder
- **Package Manager Mismatch**: Using `npm` when project uses `pnpm`
- **Build Output Missing**: Next.js build didn't generate required files

### Solution

#### Step 1: Configure Vercel Project Settings

1. Go to Vercel Dashboard → Your Project → Settings
2. **General Settings**:
   - **Root Directory**: Set to `comestag/frontend`
   - **Framework Preset**: Next.js (should auto-detect)
3. **Build & Development Settings**:
   - **Build Command**: Leave empty (auto-detects) OR `pnpm run build`
   - **Output Directory**: Leave empty (auto-detects)
   - **Install Command**: Leave empty (auto-detects) OR `pnpm install`
   - **Development Command**: Leave empty (auto-detects) OR `pnpm run dev`

#### Step 2: Set Environment Variables

Go to Settings → Environment Variables and add:

```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com
NEXT_PUBLIC_DEV_MODE=false
```

#### Step 3: Redeploy

1. Go to Deployments tab
2. Click "Redeploy" on the latest deployment
3. Or push a new commit to trigger deployment

## 2. **Why This Error Occurred**

### What Was Happening
- Vercel was trying to build from the repository root (`/`)
- It couldn't find `package.json` or `next.config.ts` at the root
- The build either failed or produced no output
- When you visit the URL, Vercel returns 404 because no app was deployed

### What Should Happen
- Vercel should build from `comestag/frontend/`
- It finds `package.json` and `next.config.ts`
- Build completes and generates `.next/` folder
- Vercel serves the Next.js app correctly

## 3. **Understanding the Concept**

### Vercel's Deployment Model
Vercel needs to know:
1. **Where your app is**: Root Directory tells Vercel which folder contains your app
2. **How to build it**: Framework detection or explicit build commands
3. **What to serve**: Next.js automatically generates the correct output

### Next.js on Vercel
- Next.js apps on Vercel use **serverless functions** for API routes
- Static pages are pre-rendered and cached
- Dynamic routes use **ISR** (Incremental Static Regeneration)
- The App Router works seamlessly with Vercel's infrastructure

### Why Root Directory Matters
```
Repository Structure:
├── comestag/
│   ├── frontend/          ← Vercel needs to build from here
│   │   ├── app/
│   │   ├── package.json
│   │   └── next.config.ts
│   └── src/               ← Backend (not needed for frontend)
```

If Root Directory is not set, Vercel looks at the repository root and finds no Next.js app.

## 4. **Warning Signs to Watch For**

### Red Flags
1. ✅ **Build succeeds but 404 on all routes**
   - **Cause**: Root Directory not set correctly
   - **Fix**: Set Root Directory to `comestag/frontend`

2. ✅ **"Cannot find package.json" in build logs**
   - **Cause**: Wrong root directory or missing file
   - **Fix**: Verify Root Directory setting

3. ✅ **"Framework not detected" warning**
   - **Cause**: Vercel can't find Next.js config
   - **Fix**: Ensure `next.config.ts` exists in root directory

4. ✅ **Build completes but deployment shows 404**
   - **Cause**: No output generated or wrong output directory
   - **Fix**: Check build logs, verify `.next` folder is created

5. ✅ **Package manager errors (pnpm vs npm)**
   - **Cause**: Mismatch between `packageManager` field and install command
   - **Fix**: Use `pnpm` consistently (already fixed in `vercel.json`)

### Code Smells
- ❌ Hardcoded paths that assume root directory
- ❌ Build scripts that don't account for subdirectory structure
- ❌ Missing `package.json` in the frontend folder
- ❌ Incorrect `vercel.json` configuration

## 5. **Alternative Approaches and Trade-offs**

### Approach 1: Monorepo with Root Directory (Current)
**Pros:**
- ✅ Keeps backend and frontend in same repo
- ✅ Easy to manage dependencies
- ✅ Single source of truth

**Cons:**
- ⚠️ Requires Root Directory configuration
- ⚠️ Slightly more complex setup

**Best for**: Full-stack applications where you want everything together

### Approach 2: Separate Repositories
**Pros:**
- ✅ Simpler Vercel setup (no Root Directory needed)
- ✅ Independent deployments
- ✅ Clear separation of concerns

**Cons:**
- ⚠️ More repositories to manage
- ⚠️ Harder to keep in sync

**Best for**: Large teams or when frontend/backend are truly independent

### Approach 3: Vercel Monorepo Support
**Pros:**
- ✅ Native support for monorepos
- ✅ Automatic detection

**Cons:**
- ⚠️ Requires specific structure (workspaces, etc.)

**Best for**: Large monorepos with multiple apps

## Quick Fix Checklist

- [ ] Set Root Directory to `comestag/frontend` in Vercel
- [ ] Verify `vercel.json` uses `pnpm` (already fixed)
- [ ] Set environment variables (`NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_DEV_MODE`)
- [ ] Trigger new deployment
- [ ] Check build logs for errors
- [ ] Verify `.next` folder is generated
- [ ] Test deployment URL

## Still Having Issues?

1. **Check Build Logs**: Look for specific error messages
2. **Verify File Structure**: Ensure `app/page.tsx` and `app/layout.tsx` exist
3. **Test Locally**: Run `pnpm run build` locally to catch build errors
4. **Check Vercel Docs**: https://vercel.com/docs/errors/NOT_FOUND
