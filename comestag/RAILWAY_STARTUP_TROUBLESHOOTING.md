# Railway Startup Troubleshooting Guide

## 🔴 Problem: Health Check Failing

Your Railway deployment is building successfully but the health check is failing. This means the application is either:
1. **Not starting** (crashing on startup)
2. **Taking too long to start** (database migrations, slow initialization)
3. **Starting but not accessible** (wrong port, binding issues)

## 🔍 Step 1: Check Application Logs

**This is the most important step!**

1. Go to Railway Dashboard → Your Service
2. Click on **"Deployments"** tab
3. Click on the **latest deployment**
4. Click on **"View Logs"** or **"Logs"** tab
5. Look for:
   - `Started ComestagApplication` - ✅ Application started successfully
   - `Exception` or `Error` - ❌ Application crashed
   - Database connection errors
   - Missing environment variable errors

### Common Startup Errors

#### Error 1: Database Connection Failed
```
org.postgresql.util.PSQLException: Connection to ... refused
```
**Solution**: 
- Verify PostgreSQL service is running
- Check `SPRING_DATASOURCE_URL` is correct
- Verify database credentials

#### Error 2: Missing Environment Variable
```
java.lang.IllegalStateException: CORS_ALLOWED_ORIGINS must be set in production
```
**Solution**: 
- Set `CORS_ALLOWED_ORIGINS` in Railway Variables
- Or set it to a default value for testing

#### Error 3: JWT Secret Missing
```
app.security.jwt-secret is empty
```
**Solution**: 
- Set `APP_SECURITY_JWT_SECRET` in Railway Variables

#### Error 4: Port Binding Issue
```
Port 8080 is already in use
```
**Solution**: 
- Railway sets `PORT` automatically - don't hardcode it
- Application should use `server.port=${PORT:3000}`

## 🔧 Step 2: Verify Environment Variables

Go to Railway → Your Service → Variables tab and verify:

### Required Variables:
- ✅ `SPRING_DATASOURCE_URL` - PostgreSQL connection string
- ✅ `SPRING_DATASOURCE_USERNAME` - Database username  
- ✅ `DB_PASSWORD` - Database password
- ✅ `APP_SECURITY_JWT_SECRET` - JWT secret key
- ✅ `CORS_ALLOWED_ORIGINS` - CORS origins (can be empty for testing)

### Optional but Recommended:
- `SPRING_PROFILES_ACTIVE=prod`
- `SENDGRID_API_KEY` (if using email)
- `MAIL_FROM` (if using email)

## ⏱️ Step 3: Increase Health Check Timeout

If the application is starting but just taking a long time:

1. **Update `railway.toml`**:
```toml
[deploy]
  healthcheckTimeout = 180  # 3 minutes instead of 100 seconds
```

2. **Commit and push**:
```bash
git add comestag/railway.toml
git commit -m "Increase health check timeout to 180s"
git push origin main
```

## 🐛 Step 4: Check Database Connection

1. Go to Railway → Your PostgreSQL Service
2. Check **"Variables"** tab
3. Copy the connection details
4. Verify your backend service has:
   - `SPRING_DATASOURCE_URL` pointing to the PostgreSQL service
   - Correct username and password

### Railway PostgreSQL Connection Format:
```
SPRING_DATASOURCE_URL=jdbc:postgresql://containers-us-west-xxx.railway.app:5432/railway
SPRING_DATASOURCE_USERNAME=postgres
DB_PASSWORD=your-password-from-railway
```

## 🔍 Step 5: Test Health Endpoint Manually

Once the application starts, test the health endpoint:

1. Get your Railway service URL (e.g., `https://your-app.up.railway.app`)
2. Visit: `https://your-app.up.railway.app/actuator/health`
3. You should see: `{"status":"UP"}`

If you get a 404:
- Actuator might not be configured
- Security might be blocking it

If you get connection refused:
- Application isn't running
- Check logs for startup errors

## 📋 Step 6: Verify Dockerfile Configuration

Check that your Dockerfile:
1. ✅ Exposes the correct port: `EXPOSE 8080`
2. ✅ Uses Railway's PORT variable: `ENV PORT=8080`
3. ✅ Health check uses correct port: `http://localhost:${PORT:-8080}/actuator/health`

## 🚀 Step 7: Enable Debug Logging (Temporary)

To see more detailed logs, temporarily add to Railway Variables:

```
LOGGING_LEVEL_ROOT=DEBUG
LOGGING_LEVEL_COM_HIVECONTROLSOLUTIONS=DEBUG
```

**⚠️ Remove after debugging - DEBUG logs are verbose!**

## 📊 Common Startup Times

- **Fast**: 10-30 seconds (no database migrations)
- **Normal**: 30-60 seconds (with database migrations)
- **Slow**: 60-120 seconds (large database, many migrations)
- **Very Slow**: 120+ seconds (complex initialization)

If your application takes longer than 120 seconds, increase `healthcheckTimeout` in `railway.toml`.

## ✅ Success Indicators

Look for these in the logs:
```
Started ComestagApplication in X.XXX seconds
Tomcat started on port(s): XXXX (http)
```

## 🔄 Quick Fix Checklist

- [ ] Check application logs for errors
- [ ] Verify all required environment variables are set
- [ ] Verify database connection string is correct
- [ ] Increase `healthcheckTimeout` if startup is slow
- [ ] Verify PostgreSQL service is running
- [ ] Test health endpoint manually after startup
- [ ] Check Railway service is using correct Root Directory (`comestag`)

## 📚 Next Steps

If the application still won't start:
1. Share the application logs (not just health check logs)
2. Verify all environment variables
3. Check database connectivity
4. Try starting locally with the same environment variables

## 🆘 Still Stuck?

1. **Get Full Logs**: Railway → Service → Logs → Copy all logs
2. **Check Environment**: Railway → Service → Variables → Screenshot
3. **Verify Database**: Railway → PostgreSQL Service → Check it's running
4. **Test Locally**: Try running with the same env vars locally

---

**Remember**: The health check logs only show health check attempts. The **application logs** show why the application isn't starting!
