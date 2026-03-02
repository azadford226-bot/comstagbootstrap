# Backend Deployment Guide

This guide covers deploying the Spring Boot backend to various platforms. Since Vercel only supports frontend deployments, you need a separate platform for the Java backend.

## 🎯 Recommended Platforms

### 1. **Railway** (⭐ Recommended - Easiest)
- ✅ Automatic Java detection
- ✅ Built-in PostgreSQL
- ✅ Free tier with $5 credit/month
- ✅ Simple setup
- ✅ GitHub integration

### 2. **Render**
- ✅ Free tier available
- ✅ PostgreSQL included
- ✅ Good documentation
- ⚠️ Free tier spins down after inactivity

### 3. **Fly.io**
- ✅ Great for Docker deployments
- ✅ Global edge network
- ✅ Free tier available
- ⚠️ Requires Docker knowledge

### 4. **AWS/Heroku**
- ✅ Enterprise-grade
- ✅ Highly scalable
- ⚠️ More complex setup
- ⚠️ Higher cost

---

## 🚀 Option 1: Railway (Recommended)

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"

### Step 2: Add PostgreSQL Database
1. Click "+ New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will create a PostgreSQL instance
4. Note the connection details (shown in the database service)

### Step 3: Deploy Backend
1. Click "+ New" → "GitHub Repo"
2. Select your repository: `azadford226-bot/comstagbootstrap`
3. Railway will detect it's a Java project
4. **Important**: Set the **Root Directory** to `comestag`
5. Railway will automatically:
   - Detect Maven
   - Run `mvn clean package`
   - Deploy the JAR

### Step 4: Configure Environment Variables

In Railway → Your Service → Variables, add:

```bash
# Database (Railway provides these automatically if you link the database)
SPRING_DATASOURCE_URL=${{Postgres.DATABASE_URL}}
SPRING_DATASOURCE_USERNAME=${{Postgres.USERNAME}}
DB_PASSWORD=${{Postgres.PASSWORD}}

# Or manually set:
# SPRING_DATASOURCE_URL=jdbc:postgresql://host:port/railway
# SPRING_DATASOURCE_USERNAME=postgres
# DB_PASSWORD=your-password

# JWT Security (REQUIRED - generate a long random string)
APP_SECURITY_JWT_SECRET=your-very-long-random-secret-key-minimum-32-characters

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
MAIL_FROM=your-email@example.com
MAIL_FROM_NAME=Comestag

# CORS - Add your Vercel frontend URL
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-custom-domain.com

# Optional
VERIFICATION_CODE_SECRET=your-verification-secret
AUTH_TOKEN_REFRESH_DURATION=18000
AUTH_TOKEN_ACCESS_DURATION=1800
AUTH_TOKEN_USER_SECRET_KEY=your-token-secret

# Supabase (if using)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
```

### Step 5: Link Database
1. In your backend service, click "Variables"
2. Click "Reference Variable"
3. Select your PostgreSQL service
4. Add references for `DATABASE_URL`, `USERNAME`, `PASSWORD`

### Step 6: Deploy
1. Railway will automatically deploy on git push
2. Or click "Deploy" to trigger manually
3. Wait for build to complete
4. Your backend URL will be: `https://your-app.up.railway.app`

### Step 7: Update Frontend
In Vercel, update environment variable:
```
NEXT_PUBLIC_API_BASE_URL=https://your-app.up.railway.app
```

---

## 🚀 Option 2: Render

### Step 1: Create Account
1. Go to https://render.com
2. Sign up with GitHub

### Step 2: Create PostgreSQL Database
1. Dashboard → "New +" → "PostgreSQL"
2. Name: `comestag-db`
3. Region: Choose closest to you
4. Plan: Free (or paid)
5. Click "Create Database"
6. Note the connection details

### Step 3: Deploy Backend
1. Dashboard → "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `comestag-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `comestag`
   - **Runtime**: `Java`
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/comestag-0.0.1-SNAPSHOT.jar`
   - **Plan**: Free (or paid)

### Step 4: Environment Variables
Add the same variables as Railway (see above)

### Step 5: Deploy
1. Click "Create Web Service"
2. Render will build and deploy
3. Your URL: `https://comestag-backend.onrender.com`

**Note**: Free tier services spin down after 15 minutes of inactivity. First request may take 30-60 seconds.

---

## 🚀 Option 3: Fly.io

### Step 1: Install Fly CLI
```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# Mac/Linux
curl -L https://fly.io/install.sh | sh
```

### Step 2: Login
```bash
fly auth login
```

### Step 3: Create Fly App
```bash
cd comestag
fly launch
```

Follow prompts:
- App name: `comestag-backend` (or choose your own)
- Region: Choose closest
- PostgreSQL: Yes (creates database)
- Redis: No (unless needed)

### Step 4: Configure fly.toml
Fly will create `fly.toml`. Update it:

```toml
[build]
  dockerfile = "Dockerfile"

[env]
  SPRING_PROFILES_ACTIVE = "prod"
  PORT = "8080"

[[services]]
  internal_port = 8080
  protocol = "tcp"
```

### Step 5: Set Secrets
```bash
fly secrets set APP_SECURITY_JWT_SECRET=your-secret
fly secrets set SENDGRID_API_KEY=your-key
fly secrets set MAIL_FROM=your-email@example.com
# ... add all other secrets
```

### Step 6: Deploy
```bash
fly deploy
```

Your URL: `https://comestag-backend.fly.dev`

---

## 🚀 Option 4: Docker Deployment (Any Platform)

If your platform supports Docker:

### Build Locally
```bash
cd comestag
docker build -t comestag-backend:latest .
```

### Run Locally (Test)
```bash
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host:port/db \
  -e SPRING_DATASOURCE_USERNAME=user \
  -e DB_PASSWORD=pass \
  -e APP_SECURITY_JWT_SECRET=secret \
  comestag-backend:latest
```

### Push to Registry
```bash
# Tag for your registry
docker tag comestag-backend:latest your-registry/comestag-backend:latest

# Push
docker push your-registry/comestag-backend:latest
```

---

## 📋 Required Environment Variables

### Required (Must Set)
```bash
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://host:port/database
SPRING_DATASOURCE_USERNAME=username
DB_PASSWORD=password

# Security
APP_SECURITY_JWT_SECRET=minimum-32-character-random-string

# Email
SENDGRID_API_KEY=your-sendgrid-key
MAIL_FROM=your-email@example.com
MAIL_FROM_NAME=Comestag

# CORS
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Optional
```bash
VERIFICATION_CODE_SECRET=secret
AUTH_TOKEN_REFRESH_DURATION=18000
AUTH_TOKEN_ACCESS_DURATION=1800
AUTH_TOKEN_USER_SECRET_KEY=secret

# Supabase
SUPABASE_URL=https://project.supabase.co
SUPABASE_SERVICE_KEY=key
```

---

## 🔧 Post-Deployment Checklist

- [ ] Backend is accessible (check `/actuator/health`)
- [ ] Database migrations ran successfully (check logs)
- [ ] CORS is configured with frontend URL
- [ ] Environment variables are set correctly
- [ ] Frontend `NEXT_PUBLIC_API_BASE_URL` points to backend
- [ ] Test API endpoints from frontend
- [ ] Check logs for any errors

---

## 🐛 Troubleshooting

### Database Connection Issues
- Verify connection string format: `jdbc:postgresql://host:port/database`
- Check database is accessible from your platform
- Verify credentials are correct

### Build Failures
- Check Java version (needs Java 21)
- Verify Maven wrapper exists (`mvnw` or `mvnw.cmd`)
- Check build logs for specific errors

### Application Won't Start
- Check environment variables are set
- Verify `APP_SECURITY_JWT_SECRET` is set (required)
- Check database is accessible
- Review application logs

### CORS Errors
- Ensure `CORS_ALLOWED_ORIGINS` includes your frontend URL
- No trailing slashes in URLs
- Check backend logs for CORS errors

---

## 💰 Cost Comparison

| Platform | Free Tier | Paid Starting |
|----------|-----------|---------------|
| Railway  | $5 credit/month | $5/month |
| Render   | Free (spins down) | $7/month |
| Fly.io   | 3 VMs free | $1.94/month |
| AWS      | Limited free | ~$10/month |
| Heroku   | No free tier | $7/month |

---

## 🎯 Quick Start Recommendation

**For beginners**: Use **Railway**
- Easiest setup
- Automatic detection
- Built-in database
- Good free tier

**For production**: Use **Render** or **Fly.io**
- More control
- Better performance
- More features

---

## 📚 Additional Resources

- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Fly.io Docs](https://fly.io/docs)
- [Spring Boot Deployment](https://spring.io/guides/gs/spring-boot-for-azure/)
