# Backend Deployment - Quick Start

## 🚀 Recommended: Railway (5 minutes)

1. **Sign up**: https://railway.app (GitHub login)

2. **Create Project**:
   - Click "New Project"
   - Add PostgreSQL database
   - Add GitHub repo: `azadford226-bot/comstagbootstrap`
   - **Set Root Directory**: `comestag`

3. **Set Environment Variables**:
   ```
   APP_SECURITY_JWT_SECRET=your-long-random-secret-32-chars-minimum
   SENDGRID_API_KEY=your-sendgrid-key
   MAIL_FROM=your-email@example.com
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```

4. **Link Database**:
   - In backend service → Variables
   - Reference PostgreSQL variables

5. **Deploy**: Railway auto-deploys on git push

6. **Get URL**: `https://your-app.up.railway.app`

7. **Update Frontend**: In Vercel, set:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-app.up.railway.app
   ```

## 📋 Required Environment Variables

```bash
# Database (Railway auto-provides if linked)
SPRING_DATASOURCE_URL=jdbc:postgresql://host:port/db
SPRING_DATASOURCE_USERNAME=user
DB_PASSWORD=password

# Security (REQUIRED)
APP_SECURITY_JWT_SECRET=minimum-32-characters-random-string

# Email
SENDGRID_API_KEY=your-key
MAIL_FROM=email@example.com
MAIL_FROM_NAME=Comestag

# CORS (REQUIRED)
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

## 🔗 Other Options

- **Render**: https://render.com (Free tier, spins down)
- **Fly.io**: https://fly.io (Docker-based, global)
- **AWS/Heroku**: Enterprise options

See `BACKEND_DEPLOYMENT.md` for detailed instructions.
