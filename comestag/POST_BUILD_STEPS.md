# Post-Build Deployment Steps

After successfully building the frontend and backend, follow these steps to deploy your application.

## ✅ Build Complete

You should now have:
- **Frontend built**: Next.js production build in `frontend/.next/`
- **Backend JAR**: `target/comestag-0.0.1-SNAPSHOT.jar`

---

## 🚀 Next Steps

### Step 1: Set Up Database

**If you haven't already:**

1. **Ensure PostgreSQL is running**
   ```powershell
   # Check if PostgreSQL service is running
   Get-Service -Name "*postgresql*"
   ```

2. **Create database and user** (if not exists):
   ```sql
   -- Connect to PostgreSQL
   psql -U postgres
   
   -- Create database
   CREATE DATABASE comestag;
   
   -- Create user
   CREATE USER comestag_user WITH PASSWORD 'your_strong_password';
   
   -- Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE comestag TO comestag_user;
   
   -- Connect to database
   \c comestag
   
   -- Grant schema privileges
   GRANT ALL ON SCHEMA public TO comestag_user;
   ```

---

### Step 2: Configure Environment Variables

**Create a `.env` file or set environment variables:**

```powershell
# Profile
$env:SPRING_PROFILES_ACTIVE="prod"

# Database
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/comestag"
$env:SPRING_DATASOURCE_USERNAME="comestag_user"
$env:SPRING_DATASOURCE_PASSWORD="your_strong_password"

# Security (Generate strong random values!)
# Use: [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
$env:APP_SECURITY_JWT_SECRET="your_generated_jwt_secret_min_32_chars"
$env:VERIFICATION_CODE_SECRET="your_generated_verification_secret"
$env:AUTH_TOKEN_USER_SECRET_KEY="your_generated_auth_secret"

# Application URLs
$env:APP_BASE_URL="http://localhost:8080"  # Change to your domain in production
$env:CORS_ALLOWED_ORIGINS="http://localhost:8080"  # Add your frontend domain

# Email Configuration (SendGrid example)
$env:MAIL_HOST="smtp.sendgrid.net"
$env:MAIL_PORT="587"
$env:MAIL_USERNAME="apikey"
$env:MAIL_PASSWORD="your_sendgrid_api_key"
$env:SENDGRID_API_KEY="your_sendgrid_api_key"
$env:MAIL_FROM="noreply@yourdomain.com"
$env:MAIL_FROM_NAME="Comestag"
$env:MAIL_CONTACT="info@yourdomain.com"

# Supabase (for media storage)
$env:SUPABASE_URL="https://your-project.supabase.co"
$env:SUPABASE_SERVICE_KEY="your_supabase_service_key"

# Frontend
$env:NEXT_PUBLIC_DEV_MODE="false"
$env:NEXT_PUBLIC_API_BASE_URL=""  # Empty for same-origin (unified deployment)
```

**For production, see `PRODUCTION_ENV_VARIABLES.md` for complete list.**

---

### Step 3: Test Locally First

**Before deploying to production, test locally:**

```powershell
# Set local profile
$env:SPRING_PROFILES_ACTIVE="local"

# Start the application
java -jar target\comestag-0.0.1-SNAPSHOT.jar
```

**Wait for startup** (look for "Started ComestagApplication"):
- Application will be available at: http://localhost:8080
- API will be at: http://localhost:8080/v1/*
- Swagger UI: http://localhost:8080/swagger-ui.html

**Test:**
1. ✅ Homepage loads
2. ✅ Login works
3. ✅ API endpoints respond
4. ✅ Database migrations ran successfully

---

### Step 4: Choose Deployment Method

#### Option A: Unified Deployment (Single Server)

**Best for:** Small to medium applications, single server

1. **Copy JAR to server:**
   ```powershell
   # On your server
   scp target\comestag-0.0.1-SNAPSHOT.jar user@server:/opt/comestag/
   ```

2. **Set up systemd service** (Linux):
   ```ini
   [Unit]
   Description=Comestag Application
   After=network.target postgresql.service

   [Service]
   Type=simple
   User=comestag
   WorkingDirectory=/opt/comestag
   EnvironmentFile=/opt/comestag/.env
   ExecStart=/usr/bin/java -jar /opt/comestag/comestag-0.0.1-SNAPSHOT.jar
   Restart=always
   RestartSec=10

   [Install]
   WantedBy=multi-user.target
   ```

3. **Start service:**
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable comestag
   sudo systemctl start comestag
   ```

4. **Set up Nginx reverse proxy** (see DEPLOYMENT_GUIDE.md)

#### Option B: Docker Deployment

**Best for:** Containerized environments

1. **Create Dockerfile** (see DEPLOYMENT_GUIDE.md)
2. **Build image:**
   ```bash
   docker build -t comestag:latest .
   ```
3. **Run container:**
   ```bash
   docker run -d -p 8080:8080 --env-file .env comestag:latest
   ```

#### Option C: Cloud Platform

**AWS, Google Cloud, Azure** - See DEPLOYMENT_GUIDE.md for platform-specific instructions.

---

### Step 5: Production Checklist

Before going live, verify:

#### Backend
- [ ] All environment variables set
- [ ] Database connection working
- [ ] Migrations completed successfully
- [ ] Health check: `/actuator/health` returns 200
- [ ] SSL/HTTPS configured
- [ ] CORS configured for your domain
- [ ] Email service configured and tested
- [ ] Media storage (Supabase) configured

#### Frontend
- [ ] `NEXT_PUBLIC_DEV_MODE=false`
- [ ] `NEXT_PUBLIC_API_BASE_URL` set correctly
- [ ] All pages load correctly
- [ ] No console errors
- [ ] Images/assets load correctly

#### Security
- [ ] Strong JWT secrets generated
- [ ] Database password is strong
- [ ] All secrets in environment variables (not in code)
- [ ] HTTPS enabled
- [ ] Rate limiting enabled
- [ ] Actuator endpoints secured

#### Monitoring
- [ ] Logs accessible
- [ ] Error tracking configured
- [ ] Uptime monitoring set up
- [ ] Database backups configured

---

### Step 6: Deploy

**For unified deployment:**

```powershell
# On your server
cd /opt/comestag

# Set environment variables (or use .env file)
export SPRING_PROFILES_ACTIVE=prod
export SPRING_DATASOURCE_URL=jdbc:postgresql://...
# ... (all other variables)

# Start application
java -jar comestag-0.0.1-SNAPSHOT.jar
```

**Or use systemd service** (recommended for production):
```bash
sudo systemctl start comestag
sudo systemctl status comestag
```

---

### Step 7: Verify Deployment

1. **Check application is running:**
   ```bash
   curl https://yourdomain.com/actuator/health
   ```

2. **Test frontend:**
   - Visit: https://yourdomain.com
   - Test login
   - Test key features

3. **Check logs:**
   ```bash
   # Systemd
   sudo journalctl -u comestag -f
   
   # Docker
   docker logs -f container_name
   ```

---

## 🔧 Troubleshooting

### Application Won't Start

1. **Check logs:**
   ```bash
   # Look for errors in startup logs
   sudo journalctl -u comestag -n 100
   ```

2. **Common issues:**
   - Database connection failed → Check credentials
   - Port already in use → Change port or stop conflicting service
   - Missing environment variables → Check all required vars are set
   - Migration failed → Check database permissions

### Frontend Not Loading

1. **Check if backend is running:**
   ```bash
   curl http://localhost:8080/actuator/health
   ```

2. **Check browser console** for errors

3. **Verify CORS configuration** includes your frontend domain

### Database Issues

1. **Check connection:**
   ```bash
   psql -h your-db-host -U comestag_user -d comestag
   ```

2. **Verify migrations:**
   ```sql
   SELECT * FROM flyway_schema_history ORDER BY installed_on DESC;
   ```

---

## 📚 Additional Resources

- **Complete Deployment Guide**: `DEPLOYMENT_GUIDE.md`
- **Environment Variables: `PRODUCTION_ENV_VARIABLES.md`
- **Troubleshooting**: See DEPLOYMENT_GUIDE.md troubleshooting section

---

## 🎯 Quick Reference

**Local Testing:**
```powershell
$env:SPRING_PROFILES_ACTIVE="local"
java -jar target\comestag-0.0.1-SNAPSHOT.jar
```

**Production Deployment:**
```bash
# Set all environment variables
# Then:
java -jar comestag-0.0.1-SNAPSHOT.jar
# Or use systemd service
sudo systemctl start comestag
```

**Check Status:**
```bash
# Health check
curl http://localhost:8080/actuator/health

# View logs
sudo journalctl -u comestag -f
```

---

**Last Updated:** 2026-01-24
