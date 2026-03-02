# How to View Application Logs in Railway

## ⚠️ Critical: We Need APPLICATION Logs, Not Health Check Logs

The health check logs you're seeing only show that the health check is failing. **We need to see the actual application startup logs** to diagnose why the application isn't starting.

## 📋 Step-by-Step: View Application Logs

### Method 1: Railway Dashboard (Easiest)

1. **Go to Railway Dashboard**
   - Visit: https://railway.app
   - Login to your account

2. **Select Your Project**
   - Click on your project (the one with your backend service)

3. **Select Your Backend Service**
   - Click on the service that's failing (usually named after your app)

4. **View Logs**
   - Click on the **"Logs"** tab at the top
   - OR click on **"Deployments"** → Latest deployment → **"View Logs"**

5. **Look for Application Output**
   - Scroll through the logs
   - Look for lines starting with your application name
   - Look for `Started ComestagApplication` or similar
   - Look for `Exception`, `Error`, or stack traces

### Method 2: Railway CLI

```bash
# Install Railway CLI (if not installed)
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# View logs
railway logs
```

## 🔍 What to Look For in Logs

### ✅ Success Indicators:
```
Started ComestagApplication in X.XXX seconds
Tomcat started on port(s): XXXX (http)
```

### ❌ Error Indicators:

#### 1. Database Connection Error
```
org.postgresql.util.PSQLException: Connection to ... refused
org.postgresql.util.PSQLException: FATAL: password authentication failed
```
**Fix**: Check database connection variables

#### 2. Missing Environment Variable
```
java.lang.IllegalStateException: CORS_ALLOWED_ORIGINS must be set in production
```
**Fix**: Set `CORS_ALLOWED_ORIGINS` in Railway Variables

#### 3. JWT Secret Missing
```
app.security.jwt-secret is empty
```
**Fix**: Set `APP_SECURITY_JWT_SECRET` in Railway Variables

#### 4. Port Binding Error
```
Port 8080 is already in use
Address already in use
```
**Fix**: Railway sets PORT automatically - shouldn't happen

#### 5. Flyway Migration Error
```
org.flywaydb.core.api.FlywayException: Validate failed
```
**Fix**: Check database schema or migration files

#### 6. Application Crashes Immediately
```
Exception in thread "main" ...
Process exited with code 1
```
**Fix**: Check the exception message for details

## 📸 What to Share

If you need help, please share:

1. **Application Logs** (not health check logs):
   - Copy the logs from Railway Dashboard → Logs tab
   - Look for lines with "Started", "Exception", "Error"
   - Share the last 50-100 lines

2. **Environment Variables** (screenshot or list):
   - Railway → Service → Variables tab
   - Show which variables are set (hide actual values for security)

3. **Service Status**:
   - Is PostgreSQL service running?
   - Are services connected?

## 🚨 Common Issues

### Issue: No Application Logs at All

**Possible Causes**:
- Application crashes before logging starts
- Wrong start command
- JAR file not found

**Check**:
- Verify `railway.toml` has correct `startCommand`
- Verify Dockerfile copies JAR to correct location
- Check if JAR file exists in build

### Issue: Application Starts Then Crashes

**Check Logs For**:
- Database connection errors
- Missing environment variables
- Out of memory errors
- Port binding issues

### Issue: Application Never Starts

**Check**:
- Environment variables are set
- Database service is running
- Start command is correct

## 🔧 Quick Diagnostic Commands

If you have Railway CLI access:

```bash
# View recent logs
railway logs --tail 100

# Check service status
railway status

# View environment variables
railway variables
```

## 📝 Next Steps

1. **View Application Logs** using Method 1 or 2 above
2. **Look for Errors** - especially database, environment variables, or startup errors
3. **Share the Logs** if you need help diagnosing
4. **Check Environment Variables** - ensure all required ones are set

---

**Remember**: Health check logs only tell us the health check is failing. **Application logs tell us WHY the application isn't starting!**
