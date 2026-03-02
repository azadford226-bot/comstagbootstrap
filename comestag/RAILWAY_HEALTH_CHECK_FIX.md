# Fix: Railway Health Check Failure

## 🔴 The Problem

Your Railway deployment is failing the health check:
```
Healthcheck failed!
1/1 replicas never became healthy!
```

**Root Causes**:
1. **Port Mismatch**: Application configured for port 3000, but health check uses 8080
2. **Railway PORT Variable**: Railway sets `PORT` env var, but Dockerfile health check was hardcoded
3. **Security Blocking**: Actuator health endpoint might be blocked by security
4. **Startup Time**: Spring Boot with database migrations needs more time to start

## ✅ The Fixes Applied

### Fix 1: Dynamic Port Configuration

**Updated `application.properties`**:
```properties
# Railway sets PORT env var, Spring Boot will use it automatically
server.port=${PORT:3000}
```

**Why?** Railway sets a `PORT` environment variable. Spring Boot automatically uses it if present, otherwise defaults to 3000 for local dev.

### Fix 2: Updated Dockerfile Health Check

**Before**:
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1
```

**After**:
```dockerfile
ENV PORT=8080
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=5 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-8080}/actuator/health || exit 1
```

**Changes**:
- ✅ Uses `${PORT:-8080}` to respect Railway's PORT variable
- ✅ Increased `start-period` from 40s to 120s (allows time for DB migrations)
- ✅ Increased `timeout` from 3s to 10s (more forgiving)
- ✅ Increased `retries` from 3 to 5 (more attempts)

### Fix 3: Security Configuration

**Updated `SecurityConfig.java`**:
```java
// Allow actuator health endpoint (needed for Railway health checks)
.requestMatchers("/actuator/health").permitAll()
```

**Why?** Ensures the health endpoint is accessible without authentication.

## How Railway Ports Work

1. **Railway sets `PORT`**: Railway automatically sets a `PORT` environment variable
2. **Spring Boot uses it**: Spring Boot automatically uses `server.port=${PORT:3000}` 
3. **Health check must match**: The health check must use the same port

## Expected Behavior After Fix

1. **Build succeeds** ✅ (already working)
2. **Container starts** ✅
3. **Spring Boot starts** (may take 30-60 seconds with DB migrations)
4. **Health check passes** after ~120 seconds
5. **Deployment succeeds** ✅

## Monitoring the Deployment

Watch the Railway logs for:
```
Started ComestagApplication in X.XXX seconds
```

Then the health check should succeed:
```
Attempt #X succeeded
```

## If Health Check Still Fails

### Check 1: Application Logs
Look for errors in Railway logs:
- Database connection issues
- Missing environment variables
- Application startup errors

### Check 2: Environment Variables
Ensure these are set in Railway:
- `SPRING_DATASOURCE_URL` - PostgreSQL connection string
- `SPRING_DATASOURCE_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `APP_SECURITY_JWT_SECRET` - JWT secret key
- `CORS_ALLOWED_ORIGINS` - CORS origins (if needed)

### Check 3: Database Connection
Verify your PostgreSQL service is:
- ✅ Running
- ✅ Connected to the same Railway project
- ✅ Has the correct database name (`comestag`)

### Check 4: Increase Start Period Further
If migrations take longer, increase `start-period` in Dockerfile:
```dockerfile
--start-period=180s  # 3 minutes
```

## Summary

- ✅ **Port**: Now uses Railway's PORT variable dynamically
- ✅ **Security**: Actuator health endpoint is accessible
- ✅ **Timing**: Health check allows 120s for startup
- ✅ **Resilience**: More retries and longer timeout

**Next Step**: Commit and push these changes. Railway will automatically redeploy.
