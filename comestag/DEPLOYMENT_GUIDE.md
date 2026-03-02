# Complete Deployment Guide - Comestag Application

This guide covers all deployment options for the Comestag application (Next.js frontend + Spring Boot backend).

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Deployment Options](#deployment-options)
3. [Option 1: Unified Deployment (Single JAR)](#option-1-unified-deployment-single-jar)
4. [Option 2: Separate Frontend & Backend](#option-2-separate-frontend--backend)
5. [Option 3: Docker Deployment](#option-3-docker-deployment)
6. [Option 4: Cloud Platform Deployment](#option-4-cloud-platform-deployment)
7. [Database Setup](#database-setup)
8. [Environment Variables](#environment-variables)
9. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Prerequisites

- **Java 21+** (for backend)
- **Node.js 20+** and **pnpm** (for frontend)
- **PostgreSQL 12+** (database)
- **Maven 3.9+** (for building backend)
- Domain name and SSL certificate (for production)

---

## Deployment Options

### Quick Comparison

| Option | Complexity | Best For | Pros | Cons |
|--------|-----------|----------|------|------|
| **Unified JAR** | ⭐ Easy | Small to medium apps | Simple, no CORS, single deploy | Less flexible |
| **Separate** | ⭐⭐ Medium | Large apps, scaling | Independent scaling | CORS config needed |
| **Docker** | ⭐⭐ Medium | Containerized environments | Consistent, portable | Docker knowledge needed |
| **Cloud Platform** | ⭐⭐⭐ Advanced | Enterprise, auto-scaling | Managed services | Vendor lock-in, cost |

---

## Option 1: Unified Deployment (Single JAR)

**Best for:** Small to medium applications, single server deployments

### Step 1: Build the Application

```bash
cd comestag

# Build everything (frontend + backend)
# Windows:
.\build-all.ps1

# Linux/Mac:
chmod +x build-all.sh
./build-all.sh
```

This creates: `target/comestag-0.0.1-SNAPSHOT.jar`

### Step 2: Set Up Database

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database and user
CREATE DATABASE comestag;
CREATE USER comestag_user WITH PASSWORD 'your_strong_password';
GRANT ALL PRIVILEGES ON DATABASE comestag TO comestag_user;

-- Connect to database
\c comestag
GRANT ALL ON SCHEMA public TO comestag_user;
```

### Step 3: Configure Environment Variables

Create `.env` file or set environment variables:

```bash
# Profile
export SPRING_PROFILES_ACTIVE=prod

# Database
export SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-host:5432/comestag
export SPRING_DATASOURCE_USERNAME=comestag_user
export SPRING_DATASOURCE_PASSWORD=your_strong_password

# Security (Generate strong random values!)
export APP_SECURITY_JWT_SECRET=$(openssl rand -base64 32)
export VERIFICATION_CODE_SECRET=$(openssl rand -base64 32)
export AUTH_TOKEN_USER_SECRET_KEY=$(openssl rand -base64 32)

# Application URLs
export APP_BASE_URL=https://yourdomain.com
export CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Email (SendGrid example)
export MAIL_HOST=smtp.sendgrid.net
export MAIL_PORT=587
export MAIL_USERNAME=apikey
export MAIL_PASSWORD=your_sendgrid_api_key
export SENDGRID_API_KEY=your_sendgrid_api_key
export MAIL_FROM=noreply@yourdomain.com
export MAIL_FROM_NAME=Comestag
export MAIL_CONTACT=info@yourdomain.com

# Supabase (for media storage)
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_SERVICE_KEY=your_supabase_service_key

# Frontend
export NEXT_PUBLIC_DEV_MODE=false
export NEXT_PUBLIC_API_BASE_URL=  # Empty for same-origin
```

### Step 4: Deploy

**On Linux Server:**

```bash
# Copy JAR to server
scp target/comestag-0.0.1-SNAPSHOT.jar user@server:/opt/comestag/

# SSH to server
ssh user@server

# Create systemd service
sudo nano /etc/systemd/system/comestag.service
```

**Systemd Service File:**

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

**Start Service:**

```bash
sudo systemctl daemon-reload
sudo systemctl enable comestag
sudo systemctl start comestag
sudo systemctl status comestag
```

**Behind Nginx Reverse Proxy:**

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Option 2: Separate Frontend & Backend

**Best for:** Large applications, independent scaling, different teams

### Frontend Deployment (Next.js)

#### Option A: Vercel (Recommended for Next.js)

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
cd frontend
vercel
```

3. **Set Environment Variables in Vercel Dashboard:**
   - `NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com`
   - `NEXT_PUBLIC_DEV_MODE=false`

#### Option B: Self-Hosted (Node.js Server)

1. **Build:**
```bash
cd frontend
pnpm install
pnpm build
```

2. **Start:**
```bash
pnpm start  # Runs on port 3000
```

3. **Behind Nginx:**
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Option C: Static Export (if no SSR needed)

1. **Update `next.config.ts`:**
```typescript
const nextConfig = {
  output: 'export',
  // ... other config
};
```

2. **Build and Deploy:**
```bash
cd frontend
pnpm build  # Creates 'out' directory
# Upload 'out' directory to any static hosting (S3, Netlify, etc.)
```

### Backend Deployment (Spring Boot)

1. **Build:**
```bash
cd comestag
mvn clean package -DskipTests
```

2. **Deploy JAR** (same as Option 1, Step 4)

3. **Configure CORS:**
```bash
export CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

## Option 3: Docker Deployment

**Best for:** Containerized environments, Kubernetes, Docker Swarm

### Step 1: Create Dockerfile

**Backend Dockerfile:**

```dockerfile
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn
RUN ./mvnw dependency:go-offline
COPY src ./src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/comestag-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Frontend Dockerfile (if separate):**

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install -g pnpm && pnpm install
COPY frontend .
RUN pnpm build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["pnpm", "start"]
```

### Step 2: Create docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: comestag
      POSTGRES_USER: comestag_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U comestag_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      SPRING_PROFILES_ACTIVE: prod
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/comestag
      SPRING_DATASOURCE_USERNAME: comestag_user
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
      APP_SECURITY_JWT_SECRET: ${JWT_SECRET}
      VERIFICATION_CODE_SECRET: ${VERIFICATION_SECRET}
      AUTH_TOKEN_USER_SECRET_KEY: ${AUTH_SECRET}
      APP_BASE_URL: ${APP_BASE_URL}
      CORS_ALLOWED_ORIGINS: ${CORS_ORIGINS}
      MAIL_HOST: ${MAIL_HOST}
      MAIL_PORT: ${MAIL_PORT}
      MAIL_USERNAME: ${MAIL_USERNAME}
      MAIL_PASSWORD: ${MAIL_PASSWORD}
      SENDGRID_API_KEY: ${SENDGRID_API_KEY}
      MAIL_FROM: ${MAIL_FROM}
      SUPABASE_URL: ${SUPABASE_URL}
      SUPABASE_SERVICE_KEY: ${SUPABASE_SERVICE_KEY}
    ports:
      - "8080:8080"
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

volumes:
  postgres_data:
```

### Step 3: Deploy

```bash
# Create .env file
cat > .env << EOF
DB_PASSWORD=your_strong_password
JWT_SECRET=$(openssl rand -base64 32)
VERIFICATION_SECRET=$(openssl rand -base64 32)
AUTH_SECRET=$(openssl rand -base64 32)
APP_BASE_URL=https://yourdomain.com
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your_sendgrid_key
SENDGRID_API_KEY=your_sendgrid_key
MAIL_FROM=noreply@yourdomain.com
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_key
EOF

# Build and start
docker-compose up -d

# View logs
docker-compose logs -f backend
```

---

## Option 4: Cloud Platform Deployment

### AWS Deployment

#### Backend (Elastic Beanstalk or ECS)

**Elastic Beanstalk:**
```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p java-21 comestag-app

# Create environment
eb create comestag-prod

# Set environment variables
eb setenv \
  SPRING_PROFILES_ACTIVE=prod \
  SPRING_DATASOURCE_URL=jdbc:postgresql://your-rds-endpoint:5432/comestag \
  SPRING_DATASOURCE_USERNAME=comestag_user \
  SPRING_DATASOURCE_PASSWORD=your_password \
  APP_SECURITY_JWT_SECRET=your_secret

# Deploy
eb deploy
```

**ECS (Docker):**
1. Build and push to ECR
2. Create ECS task definition
3. Deploy to ECS cluster

#### Frontend (S3 + CloudFront)

```bash
# Build static export
cd frontend
pnpm build

# Upload to S3
aws s3 sync out/ s3://your-bucket-name

# Create CloudFront distribution
# Configure in AWS Console
```

#### Database (RDS PostgreSQL)

1. Create RDS PostgreSQL instance
2. Configure security groups
3. Set connection string in backend env vars

### Google Cloud Platform

#### Backend (Cloud Run)

```bash
# Build and push to GCR
gcloud builds submit --tag gcr.io/your-project/comestag

# Deploy to Cloud Run
gcloud run deploy comestag \
  --image gcr.io/your-project/comestag \
  --platform managed \
  --region us-central1 \
  --set-env-vars SPRING_PROFILES_ACTIVE=prod
```

#### Frontend (Firebase Hosting)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Build
cd frontend
pnpm build

# Deploy
firebase deploy --only hosting
```

#### Database (Cloud SQL)

1. Create Cloud SQL PostgreSQL instance
2. Configure connection in Cloud Run
3. Use Cloud SQL Proxy if needed

### Azure Deployment

#### Backend (App Service)

```bash
# Build
mvn clean package -DskipTests

# Deploy via Azure CLI
az webapp deploy \
  --resource-group your-resource-group \
  --name comestag-app \
  --type jar \
  --src-path target/comestag-0.0.1-SNAPSHOT.jar
```

#### Frontend (Static Web Apps)

```bash
# Install Azure CLI
npm install -g @azure/static-web-apps-cli

# Deploy
swa deploy ./frontend/out
```

---

## Database Setup

### Production Database Checklist

- [ ] PostgreSQL 12+ installed/configured
- [ ] Database `comestag` created
- [ ] User `comestag_user` created with strong password
- [ ] All privileges granted
- [ ] SSL/TLS enabled (for remote connections)
- [ ] Backups configured
- [ ] Connection pooling configured (HikariCP is included)
- [ ] Migration strategy defined (Flyway runs automatically)

### Database Connection String Format

```
jdbc:postgresql://host:port/database?ssl=true&sslmode=require
```

### Remote Database Setup

If using managed database (RDS, Cloud SQL, etc.):

1. **Whitelist your application server IP**
2. **Enable SSL/TLS**
3. **Use connection string with SSL parameters**
4. **Test connection before deploying**

---

## Environment Variables

### Required for Production

See `PRODUCTION_ENV_VARIABLES.md` for complete list.

**Critical Variables:**
```bash
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:postgresql://...
SPRING_DATASOURCE_USERNAME=...
SPRING_DATASOURCE_PASSWORD=...
APP_SECURITY_JWT_SECRET=...  # Generate strong random value
VERIFICATION_CODE_SECRET=...  # Generate strong random value
AUTH_TOKEN_USER_SECRET_KEY=...  # Generate strong random value
CORS_ALLOWED_ORIGINS=https://yourdomain.com
NEXT_PUBLIC_DEV_MODE=false
```

### Generating Secrets

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Windows (PowerShell):**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

---

## Post-Deployment Checklist

### Backend Verification

- [ ] Health check: `https://api.yourdomain.com/actuator/health`
- [ ] API docs: `https://api.yourdomain.com/swagger-ui.html`
- [ ] Login endpoint works
- [ ] Database migrations completed
- [ ] Email sending works
- [ ] File uploads work (Supabase/media storage)

### Frontend Verification

- [ ] Homepage loads
- [ ] Login page works
- [ ] API calls succeed (check browser console)
- [ ] No CORS errors
- [ ] Images/assets load correctly
- [ ] Admin login works (if applicable)

### Security Checklist

- [ ] HTTPS enabled (SSL certificate installed)
- [ ] All secrets in environment variables (not in code)
- [ ] CORS configured correctly
- [ ] Database credentials secure
- [ ] JWT secrets are strong and unique
- [ ] Rate limiting enabled
- [ ] Actuator endpoints secured (production profile)

### Performance Checklist

- [ ] Database indexes created (Flyway migrations)
- [ ] Connection pooling configured
- [ ] CDN configured (for static assets)
- [ ] Caching configured (if applicable)
- [ ] Monitoring/logging set up

### Monitoring

- [ ] Application logs accessible
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Uptime monitoring (UptimeRobot, Pingdom, etc.)
- [ ] Database monitoring
- [ ] Performance metrics collection

---

## Troubleshooting

### Backend Won't Start

1. **Check logs:**
```bash
# Systemd
sudo journalctl -u comestag -f

# Docker
docker-compose logs -f backend
```

2. **Common issues:**
   - Database connection failed → Check credentials and network
   - Port already in use → Change port or stop conflicting service
   - Missing environment variables → Check all required vars are set
   - Migration failed → Check database permissions

### Frontend API Calls Fail

1. **CORS errors:**
   - Verify `CORS_ALLOWED_ORIGINS` includes frontend domain
   - Check browser console for actual error

2. **404 errors:**
   - Verify `NEXT_PUBLIC_API_BASE_URL` is correct
   - Check API endpoint paths

3. **Network errors:**
   - Verify backend is running and accessible
   - Check firewall rules
   - Verify SSL certificate is valid

### Database Connection Issues

1. **Connection refused:**
   - Verify database is running
   - Check firewall/security groups
   - Verify connection string is correct

2. **Authentication failed:**
   - Verify username/password
   - Check database user exists
   - Verify user has correct permissions

---

## Quick Start Commands

### Local Development
```bash
# Backend
cd comestag
mvn spring-boot:run

# Frontend (separate terminal)
cd frontend
pnpm dev
```

### Production Build
```bash
# Unified
./build-all.sh
java -jar target/comestag-0.0.1-SNAPSHOT.jar

# Separate
cd frontend && pnpm build && pnpm start
cd .. && mvn package && java -jar target/comestag-0.0.1-SNAPSHOT.jar
```

### Docker
```bash
docker-compose up -d
```

---

## Support

For issues or questions:
1. Check logs first
2. Review `PRODUCTION_ENV_VARIABLES.md`
3. Check `ADMIN_LOGIN_TROUBLESHOOTING.md` (if admin issues)
4. Review application logs and error messages

---

**Last Updated:** 2026-01-24
