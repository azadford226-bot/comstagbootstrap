# Production Environment Variables Guide

This document lists all environment variables required for production deployment of the Comestag platform.

## ⚠️ Critical Variables (Required)

These variables **MUST** be set in production. The application will fail to start if they are missing.

### Database Configuration

```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-host:5432/comestag
SPRING_DATASOURCE_USERNAME=comestag
SPRING_DATASOURCE_PASSWORD=<secure-password>
```

**Notes:**
- Replace `your-db-host` with your PostgreSQL server hostname or IP
- Use a strong, unique password (not the default `comestag`)
- Ensure the database exists and user has proper permissions

### Security Secrets

```bash
APP_SECURITY_JWT_SECRET=<min-32-character-random-string>
VERIFICATION_CODE_SECRET=<random-secret-string>
AUTH_TOKEN_USER_SECRET_KEY=<random-secret-string>
```

**Notes:**
- `APP_SECURITY_JWT_SECRET`: Minimum 32 characters, use a cryptographically secure random string
- `VERIFICATION_CODE_SECRET`: Used for HMAC signing of verification codes
- `AUTH_TOKEN_USER_SECRET_KEY`: Used for user token encryption
- **NEVER** use default values in production
- Generate secrets using: `openssl rand -base64 32` or similar

### CORS Configuration

```bash
CORS_ALLOWED_ORIGINS=https://app.comestag.com,https://www.comestag.com
```

**Notes:**
- Comma-separated list of allowed origins
- Must include your production frontend domain(s)
- Use HTTPS in production
- Application will fail to start in production profile if not set

### Application Base URL

```bash
APP_BASE_URL=https://api.comestag.com
```

**Notes:**
- Base URL of your API server
- Used for generating email verification links
- Should match your actual API domain

---

## 🔐 High Priority Variables (Strongly Recommended)

These variables should be set for proper functionality, but the application may start without them (with warnings).

### Email Configuration

```bash
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=<app-specific-password>
MAIL_FROM=noreply@comestag.com
MAIL_FROM_NAME=Comestag
MAIL_CONTACT=info@comestag.com
```

**Notes:**
- For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833)
- For other providers, use appropriate SMTP settings
- `MAIL_FROM` is the sender email address
- `MAIL_CONTACT` is where contact form messages are sent

### SendGrid Configuration (Alternative to SMTP)

```bash
SENDGRID_API_KEY=<your-sendgrid-api-key>
```

**Notes:**
- Alternative to SMTP email configuration
- If using SendGrid, you still need `MAIL_FROM` and `MAIL_FROM_NAME`

---

## 📦 Optional Variables

These variables have defaults but can be customized.

### Spring Profile

```bash
SPRING_PROFILES_ACTIVE=prod
```

**Notes:**
- Use `prod` for production
- Other profiles: `local`, `dev`, `stag`

### Token Expiration

```bash
AUTH_TOKEN_REFRESH_DURATION=864000
AUTH_TOKEN_ACCESS_DURATION=1800
APP_SECURITY_JWT_EXP_MINUTES=60
```

**Notes:**
- Durations in seconds (except JWT which is minutes)
- Defaults are reasonable for most use cases

### Rate Limiting

```bash
RATE_LIMIT_ENABLED=true
RATE_LIMIT_LOGIN_CAPACITY=5
RATE_LIMIT_LOGIN_REFILL_TOKENS=5
RATE_LIMIT_LOGIN_REFILL_DURATION=15
RATE_LIMIT_REGISTER_CAPACITY=3
RATE_LIMIT_REGISTER_REFILL_TOKENS=3
RATE_LIMIT_REGISTER_REFILL_DURATION=60
RATE_LIMIT_API_CAPACITY=100
RATE_LIMIT_API_REFILL_TOKENS=100
RATE_LIMIT_API_REFILL_DURATION=1
```

**Notes:**
- Capacity: Maximum tokens in bucket
- Refill tokens: Tokens added per refill period
- Refill duration: Minutes between refills

### Storage Configuration (Supabase)

```bash
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=<supabase-service-key>
SUPABASE_STORAGE_BUCKET=comestag-media
```

**Notes:**
- Required if using Supabase for media storage
- If not set, uses local file storage

### Monitoring & Tracing

```bash
MANAGEMENT_TRACING_ENABLED=false
MANAGEMENT_TRACING_SAMPLING=0.1
```

**Notes:**
- Set to `true` if using OpenTelemetry
- Sampling rate: 0.0 to 1.0 (10% = 0.1)

---

## 🔄 Frontend Environment Variables

For the frontend (Next.js), set these in your deployment platform:

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.comestag.com
NEXT_PUBLIC_DEV_MODE=false
```

**Notes:**
- `NEXT_PUBLIC_API_BASE_URL`: Your backend API URL
- `NEXT_PUBLIC_DEV_MODE`: Must be `false` in production

---

## 📋 Complete Production Example

Here's a complete example for a production deployment:

```bash
# Spring Profile
SPRING_PROFILES_ACTIVE=prod

# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://db.production.com:5432/comestag
SPRING_DATASOURCE_USERNAME=comestag
SPRING_DATASOURCE_PASSWORD=<strong-password>

# Security
APP_SECURITY_JWT_SECRET=<32+char-random-string>
VERIFICATION_CODE_SECRET=<random-secret>
AUTH_TOKEN_USER_SECRET_KEY=<random-secret>

# CORS
CORS_ALLOWED_ORIGINS=https://app.comestag.com,https://www.comestag.com

# Application
APP_BASE_URL=https://api.comestag.com

# Email
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=<sendgrid-api-key>
MAIL_FROM=noreply@comestag.com
MAIL_FROM_NAME=Comestag
MAIL_CONTACT=info@comestag.com

# Storage (if using Supabase)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=<service-key>
SUPABASE_STORAGE_BUCKET=comestag-media

# Frontend (set in frontend deployment)
NEXT_PUBLIC_API_BASE_URL=https://api.comestag.com
NEXT_PUBLIC_DEV_MODE=false
```

---

## 🔍 Validation

The application includes a `StartupValidator` that checks critical configuration in production:

- ✅ CORS origins are set
- ✅ JWT secret is set and not using default
- ✅ Database credentials are set
- ⚠️ Email configuration (warns if missing)

If validation fails, the application will **not start** and log detailed error messages.

---

## 🔐 Security Best Practices

1. **Never commit secrets to version control**
   - Use environment variables or secret management services
   - Use `.env` files locally (and add to `.gitignore`)

2. **Use strong, unique secrets**
   - Minimum 32 characters for JWT secret
   - Generate using cryptographically secure random generators
   - Different secrets for each environment

3. **Rotate secrets regularly**
   - Plan for secret rotation
   - Update secrets without downtime when possible

4. **Limit access to secrets**
   - Only grant access to necessary personnel
   - Use secret management services (AWS Secrets Manager, HashiCorp Vault, etc.)

5. **Monitor for exposed secrets**
   - Use tools to scan for accidentally committed secrets
   - Set up alerts for suspicious activity

---

## 🚀 Deployment Platforms

### Docker

```bash
docker run -d \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://... \
  -e APP_SECURITY_JWT_SECRET=... \
  # ... other variables
  comestag:latest
```

### Kubernetes

Use ConfigMaps and Secrets:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: comestag-secrets
type: Opaque
stringData:
  SPRING_DATASOURCE_PASSWORD: <password>
  APP_SECURITY_JWT_SECRET: <secret>
  # ... other secrets
```

### Environment Files

Some platforms support `.env` files or environment variable files. Ensure they're not committed to version control.

---

## 📝 Checklist

Before deploying to production, ensure:

- [ ] All critical variables are set
- [ ] Secrets are strong and unique (not defaults)
- [ ] CORS origins match your frontend domain(s)
- [ ] Database credentials are correct
- [ ] Email configuration is working (test sending)
- [ ] Frontend environment variables are set
- [ ] `NEXT_PUBLIC_DEV_MODE=false` in frontend
- [ ] Secrets are stored securely (not in code)
- [ ] Application starts successfully (check logs)
- [ ] Startup validation passes (check logs)

---

## 🆘 Troubleshooting

### Application won't start

1. Check logs for validation errors
2. Verify all critical variables are set
3. Ensure JWT secret is at least 32 characters
4. Verify CORS origins are set (in production profile)

### CORS errors in browser

1. Verify `CORS_ALLOWED_ORIGINS` includes your frontend domain
2. Check that frontend domain matches exactly (including protocol)
3. Ensure no trailing slashes in CORS origins

### Database connection errors

1. Verify database is accessible from application server
2. Check credentials are correct
3. Ensure database exists and user has permissions
4. Check firewall rules allow connection

### Email not sending

1. Verify email credentials are correct
2. For Gmail, use App Password (not regular password)
3. Check SMTP port and host are correct
4. Verify firewall allows outbound SMTP connections

---

**Last Updated:** January 24, 2026
