# How to Add Spring Boot to Railway

## Current Situation

You have:
- ✅ PostgreSQL database running in Railway (confirmed from logs)
- ❓ Need to add Spring Boot backend service

## Step-by-Step: Adding Spring Boot Service

### Step 1: Open Your Railway Project

1. Go to https://railway.app
2. Click on your project (the one with PostgreSQL)
3. You should see your PostgreSQL service listed

### Step 2: Add Spring Boot Service

1. **Click the "+ New" button** (top right or in the services list)
2. **Select "GitHub Repo"** from the dropdown
3. **Select your repository**: `azadford226-bot/comstagbootstrap`
4. Railway will start detecting the project

### Step 3: Configure Root Directory ⚠️ IMPORTANT

**This is the critical step!**

1. After Railway adds the service, click on it
2. Go to **Settings** tab
3. Scroll down to **"Root Directory"**
4. **Set it to**: `comestag`
5. Click **"Update"**

**Why?** Your Spring Boot app is in the `comestag/` folder, not the repository root.

### Step 4: Verify Railway Detected Java

Railway should automatically:
- ✅ Detect it's a Java/Maven project
- ✅ See `pom.xml` in the `comestag/` folder
- ✅ Configure build command: `mvn clean package`
- ✅ Configure start command: `java -jar target/comestag-0.0.1-SNAPSHOT.jar`

You can verify this in:
- **Settings** → **Build & Deploy** section

### Step 5: Link PostgreSQL Database

1. In your **Spring Boot service** (not PostgreSQL service)
2. Go to **Variables** tab
3. Click **"+ New Variable"**
4. Click **"Reference Variable"** (instead of typing)
5. Select your **PostgreSQL service**
6. Add these references:
   - `DATABASE_URL` → Create as `SPRING_DATASOURCE_URL`
   - `PGUSER` → Create as `SPRING_DATASOURCE_USERNAME`
   - `PGPASSWORD` → Create as `DB_PASSWORD`

**Or manually set:**
```
SPRING_DATASOURCE_URL=jdbc:postgresql://host:port/railway
SPRING_DATASOURCE_USERNAME=postgres
DB_PASSWORD=your-password-from-postgres-service
```

### Step 6: Add Required Environment Variables

In **Variables** tab, add:

```bash
# JWT Security (REQUIRED - generate a long random string)
APP_SECURITY_JWT_SECRET=your-very-long-random-secret-key-minimum-32-characters

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
MAIL_FROM=your-email@example.com
MAIL_FROM_NAME=Comestag

# CORS - Your Vercel frontend URL
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app

# Optional
VERIFICATION_CODE_SECRET=your-verification-secret
AUTH_TOKEN_REFRESH_DURATION=18000
AUTH_TOKEN_ACCESS_DURATION=1800
```

### Step 7: Deploy

1. Railway will automatically deploy when you:
   - Push to GitHub, OR
   - Click **"Deploy"** button in the service
2. Watch the **Deployments** tab for build progress
3. Check **Logs** tab for startup messages

### Step 8: Get Your Backend URL

1. Once deployed, go to **Settings** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"** (if not already generated)
4. Your backend URL will be: `https://your-service.up.railway.app`

## Visual Guide: Where Things Are

```
Railway Dashboard
├── Your Project
    ├── PostgreSQL Service (✅ You have this)
    │   └── Variables (database credentials)
    │
    └── Spring Boot Service (➕ Add this)
        ├── Settings
        │   ├── Root Directory: "comestag" ⚠️
        │   └── Build & Deploy
        ├── Variables
        │   ├── Database references (link from PostgreSQL)
        │   └── Other env vars (JWT, SendGrid, etc.)
        ├── Deployments (build history)
        └── Logs (application output)
```

## Troubleshooting

### Issue: "No build detected" or "Build failed"

**Solution:**
1. Verify **Root Directory** is set to `comestag`
2. Check that `pom.xml` exists in `comestag/` folder
3. Check build logs for specific errors

### Issue: "Cannot find pom.xml"

**Solution:**
- Root Directory is wrong - set it to `comestag`

### Issue: "Database connection failed"

**Solution:**
1. Verify database variables are linked correctly
2. Check PostgreSQL service is running
3. Ensure database name in connection string matches

### Issue: "Application won't start"

**Solution:**
1. Check **Logs** tab for error messages
2. Verify `APP_SECURITY_JWT_SECRET` is set (required)
3. Check all environment variables are correct

## Quick Checklist

- [ ] Added GitHub repo as new service
- [ ] Set Root Directory to `comestag`
- [ ] Linked PostgreSQL database variables
- [ ] Added `APP_SECURITY_JWT_SECRET`
- [ ] Added `CORS_ALLOWED_ORIGINS` with Vercel URL
- [ ] Added SendGrid credentials (if using email)
- [ ] Service deployed successfully
- [ ] Backend URL generated
- [ ] Application logs show "Started ComestagApplication"

## Expected Logs When Working

When Spring Boot starts successfully, you should see:
```
HikariPool-1 - Starting...
HikariPool-1 - Start completed.
Flyway Community Edition ...
Flyway: Successfully applied X migration(s)
Started ComestagApplication in X.XXX seconds
```

## Next Steps After Deployment

1. **Test the backend:**
   - Visit: `https://your-service.up.railway.app/actuator/health`
   - Should return: `{"status":"UP"}`

2. **Update Vercel frontend:**
   - Add environment variable: `NEXT_PUBLIC_API_BASE_URL=https://your-service.up.railway.app`

3. **Test API:**
   - Try: `https://your-service.up.railway.app/v1/...`

## Summary

**Where is Spring Boot in Railway?**
- It's a **separate service** you need to add
- Click **"+ New"** → **"GitHub Repo"**
- **Set Root Directory to `comestag`** (critical!)
- Link it to your PostgreSQL database
- Add environment variables
- Deploy!

The Spring Boot service will appear alongside your PostgreSQL service in the Railway dashboard.
