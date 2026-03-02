# Admin Login Troubleshooting Guide

## Current Issue
The backend process is running but not responding to HTTP requests. This means it's stuck during startup.

## Quick Fix Steps

### Step 1: Check Backend Logs
1. Open a **new PowerShell terminal**
2. Navigate to the project:
   ```powershell
   cd d:\comstag\fomregyptcomestag\comestag
   ```
3. Stop any running backend:
   ```powershell
   Get-Process -Name "java" | Stop-Process -Force
   ```
4. Start backend with visible output:
   ```powershell
   $env:SPRING_PROFILES_ACTIVE="local"
   java -jar target\comestag-0.0.1-SNAPSHOT.jar
   ```
5. **Watch for errors** - Look for:
   - Database connection errors
   - Migration failures
   - Port binding errors
   - Any red error messages

### Step 2: Verify Database Connection
The backend needs to connect to PostgreSQL. Check:

1. **PostgreSQL is running:**
   ```powershell
   Get-Service -Name "*postgresql*"
   ```

2. **Database exists:**
   - Database name: `comestag`
   - Username: `comestag`
   - Password: `comestag` (or check `application-local.properties`)

3. **Test connection manually:**
   ```powershell
   psql -U comestag -d comestag -c "SELECT version();"
   ```

### Step 3: Verify Admin Account Exists
Run this SQL query in PostgreSQL:

```sql
SELECT id, email, type, status, email_verified, display_name 
FROM accounts 
WHERE email = 'admin@comstag.com';
```

**Expected result:**
- Should return 1 row with:
  - `type` = 'ADMIN'
  - `status` = 'ACTIVE'
  - `email_verified` = true

**If the account doesn't exist:**
The migration V5__admin_system.sql hasn't run. Run it manually:

```sql
-- Copy and paste the contents of:
-- src\main\resources\db\migration\V5__admin_system.sql
```

### Step 4: Check Migration Status
Verify migration V5 has run:

```sql
SELECT * FROM flyway_schema_history 
WHERE version = '5' 
ORDER BY installed_on DESC 
LIMIT 1;
```

If V5 is not in the list, the migration hasn't run.

## Common Issues & Solutions

### Issue 1: Database Connection Failed
**Symptoms:** Backend logs show "Connection refused" or "Authentication failed"

**Solution:**
1. Check PostgreSQL is running
2. Verify credentials in `application-local.properties`
3. Test connection with `psql`

### Issue 2: Migration Failed
**Symptoms:** Backend logs show migration errors

**Solution:**
1. Check if `contact_messages` table exists:
   ```sql
   SELECT * FROM information_schema.tables 
   WHERE table_name = 'contact_messages';
   ```
2. If missing, run V5__admin_system.sql manually
3. Check if ADMIN type is allowed:
   ```sql
   SELECT constraint_name, check_clause 
   FROM information_schema.check_constraints 
   WHERE constraint_name = 'chk_account_type';
   ```

### Issue 3: Port Already in Use
**Symptoms:** Backend can't bind to port 8080

**Solution:**
```powershell
# Find what's using port 8080
netstat -ano | findstr ":8080"

# Kill the process (replace PID with actual process ID)
Stop-Process -Id <PID> -Force
```

### Issue 4: Backend Starts But Times Out
**Symptoms:** Process runs, port listens, but HTTP requests timeout

**Solution:**
This usually means the HTTP server hasn't fully started. Wait 60-90 seconds after startup, or check logs for:
- "Started ComestagApplication" message
- Any errors after this message

## Admin Login Credentials
- **Email:** `admin@comstag.com`
- **Password:** `Admin@123!`

## Testing Login
Once backend is responding:

1. **Test with PowerShell:**
   ```powershell
   $body = @{email="admin@comstag.com";password="Admin@123!"} | ConvertTo-Json
   Invoke-WebRequest -Uri "http://localhost:8080/v1/auth/login" `
     -Method POST -ContentType "application/json" -Body $body
   ```

2. **Test in browser:**
   - Go to: http://localhost:3000/admin/login
   - Enter credentials
   - Check browser console (F12) for errors

## Still Not Working?
1. Check browser console (F12) for frontend errors
2. Verify backend logs show "Started ComestagApplication"
3. Try accessing: http://localhost:8080/actuator/health
4. Check if CORS is blocking requests (check browser network tab)
