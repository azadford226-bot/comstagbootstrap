# Connecting Vercel (Frontend) with Railway (Backend)

This guide explains how to connect your Vercel-deployed frontend with your Railway-deployed backend.

## 📋 Prerequisites

- ✅ Frontend deployed on Vercel
- ✅ Backend deployed on Railway
- ✅ Railway backend URL (e.g., `https://your-app.up.railway.app`)

## 🔗 Step 1: Get Your Railway Backend URL

1. Go to your Railway project dashboard
2. Click on your backend service
3. Find the **"Settings"** tab
4. Look for **"Domains"** or check the service URL
5. Your backend URL will look like: `https://your-app.up.railway.app`

**Note**: Railway automatically provides a domain like `your-app.up.railway.app`. You can also add a custom domain.

## 🔧 Step 2: Configure CORS in Railway Backend

Your backend needs to allow requests from your Vercel frontend domain.

### Option A: Set CORS Environment Variable in Railway

1. In Railway, go to your backend service
2. Click **"Variables"** tab
3. Add a new environment variable:
   - **Name**: `CORS_ALLOWED_ORIGINS`
   - **Value**: Your Vercel domain(s), comma-separated
     ```
     https://your-app.vercel.app,https://www.yourdomain.com
     ```
4. Save the variable
5. Railway will automatically redeploy

### Option B: Update application.properties (if needed)

If you need to add more origins, you can also set them in `application.properties`:
```properties
cors.allowed-origins=${CORS_ALLOWED_ORIGINS:https://your-app.vercel.app}
```

## 🌐 Step 3: Configure Frontend API URL in Vercel

### Method 1: Using Vercel Dashboard (Recommended)

1. Go to your Vercel project dashboard
2. Click on **"Settings"**
3. Go to **"Environment Variables"**
4. Add a new variable:
   - **Name**: `NEXT_PUBLIC_API_BASE_URL`
   - **Value**: Your Railway backend URL (e.g., `https://your-app.up.railway.app`)
   - **Environment**: Select all environments (Production, Preview, Development)
5. Click **"Save"**
6. **Redeploy** your application (Vercel will automatically redeploy on next push, or you can manually trigger it)

### Method 2: Using Vercel CLI

```bash
cd comestag/frontend
vercel env add NEXT_PUBLIC_API_BASE_URL production
# When prompted, enter: https://your-app.up.railway.app

vercel env add NEXT_PUBLIC_API_BASE_URL preview
# Enter the same URL

vercel env add NEXT_PUBLIC_API_BASE_URL development
# Enter the same URL or use http://localhost:3000 for local dev
```

## ✅ Step 4: Verify the Connection

### Test 1: Check Environment Variable

1. After redeploying, visit your Vercel site
2. Open browser DevTools (F12)
3. Go to Console
4. Check if the API URL is correct (you can add a debug component)

### Test 2: Test API Connection

1. Try logging in or making an API call
2. Check browser Network tab
3. Verify requests are going to your Railway backend URL
4. Check for CORS errors in the console

### Test 3: Check Backend Health

Visit: `https://your-app.up.railway.app/actuator/health`

You should see:
```json
{"status":"UP"}
```

## 🔍 Troubleshooting

### Issue 1: CORS Errors

**Error**: `Access to fetch at 'https://railway-url' from origin 'https://vercel-url' has been blocked by CORS policy`

**Solution**:
1. Verify `CORS_ALLOWED_ORIGINS` is set in Railway with your Vercel domain
2. Make sure the domain matches exactly (including `https://`)
3. Restart your Railway service after adding the variable

### Issue 2: API Calls Fail

**Error**: `Failed to fetch` or `Network error`

**Solutions**:
1. Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly in Vercel
2. Check that your Railway backend is running (check Railway logs)
3. Verify the Railway URL is accessible (try opening it in a browser)
4. Check browser console for specific error messages

### Issue 3: Environment Variable Not Working

**Problem**: Frontend still uses old API URL

**Solutions**:
1. **Redeploy Vercel**: Environment variables require a redeploy
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click "..." on latest deployment → "Redeploy"
2. **Clear browser cache**: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. **Verify variable name**: Must be exactly `NEXT_PUBLIC_API_BASE_URL` (case-sensitive)

### Issue 4: Mixed Content (HTTP/HTTPS)

**Error**: Mixed content warnings

**Solution**: 
- Ensure both Vercel and Railway use HTTPS
- Railway provides HTTPS by default
- Vercel provides HTTPS by default

## 📝 Environment Variables Summary

### Railway (Backend)
```
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,https://www.yourdomain.com
SPRING_DATASOURCE_URL=jdbc:postgresql://...
SPRING_DATASOURCE_USERNAME=...
DB_PASSWORD=...
APP_SECURITY_JWT_SECRET=...
```

### Vercel (Frontend)
```
NEXT_PUBLIC_API_BASE_URL=https://your-app.up.railway.app
```

## 🎯 Quick Setup Checklist

- [ ] Get Railway backend URL
- [ ] Set `CORS_ALLOWED_ORIGINS` in Railway with Vercel domain
- [ ] Set `NEXT_PUBLIC_API_BASE_URL` in Vercel with Railway URL
- [ ] Redeploy Vercel application
- [ ] Test API connection (try login or API call)
- [ ] Verify no CORS errors in browser console
- [ ] Check Railway logs for incoming requests

## 🔐 Security Notes

1. **CORS Origins**: Only add trusted domains to `CORS_ALLOWED_ORIGINS`
2. **HTTPS Only**: Always use HTTPS in production
3. **Environment Variables**: Never commit sensitive values to Git
4. **API Keys**: Keep JWT secrets and database passwords secure

## 📚 Additional Resources

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)
- [CORS Configuration Guide](./BACKEND_DEPLOYMENT.md#cors-configuration)

## 🚀 Example Configuration

### Railway Variables:
```
CORS_ALLOWED_ORIGINS=https://comestag.vercel.app
SPRING_DATASOURCE_URL=jdbc:postgresql://containers-us-west-xxx.railway.app:5432/railway
SPRING_DATASOURCE_USERNAME=postgres
DB_PASSWORD=your-secure-password
APP_SECURITY_JWT_SECRET=your-jwt-secret-key
```

### Vercel Variables:
```
NEXT_PUBLIC_API_BASE_URL=https://comestag-backend.up.railway.app
```

---

**After completing these steps, your Vercel frontend will communicate with your Railway backend!** 🎉
