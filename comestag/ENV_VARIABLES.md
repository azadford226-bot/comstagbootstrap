# Environment Variables Configuration Guide

This document lists all required and optional environment variables for the Comestag application.

## 🔴 Required Environment Variables

These **MUST** be set before running the application in production.

### Database Configuration
```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-host:5432/comestag
SPRING_DATASOURCE_USERNAME=your_db_username
SPRING_DATASOURCE_PASSWORD=your_secure_db_password
```

### JWT Authentication
```bash
# Base64 encoded secret key (minimum 256 bits)
# Generate with: openssl rand -base64 32
AUTH_TOKEN_USER_SECRET_KEY=your_base64_encoded_secret_key_here

# Token expiration times (in seconds)
AUTH_TOKEN_ACCESS_DURATION=1800        # 30 minutes
AUTH_TOKEN_REFRESH_DURATION=18000      # 5 hours
```

### Email Configuration (Choose one)

**Option 1: SMTP (Gmail, etc.)**
```bash
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-specific-password
MAIL_FROM=noreply@yourcompany.com
MAIL_FROM_NAME=Your Company Name
```

**Option 2: SendGrid**
```bash
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
MAIL_FROM=noreply@yourcompany.com
MAIL_FROM_NAME=Your Company Name
```

### Verification Code Secret
```bash
# Secret for HMAC signing of verification codes
# Generate with: openssl rand -base64 32
VERIFICATION_CODE_SECRET=your_verification_code_secret_here
```

---

## 🟡 Optional Environment Variables

These have sensible defaults but can be customized.

### CORS Configuration
```bash
# Comma-separated list of allowed origins
CORS_ALLOWED_ORIGINS=https://yourfrontend.com,https://www.yourfrontend.com
CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,PATCH,OPTIONS
CORS_ALLOWED_HEADERS=*
CORS_ALLOW_CREDENTIALS=true
CORS_MAX_AGE=3600
```

### Rate Limiting
```bash
# Enable/disable rate limiting
RATE_LIMIT_ENABLED=true

# Login endpoint rate limits
RATE_LIMIT_LOGIN_CAPACITY=5               # Max 5 attempts
RATE_LIMIT_LOGIN_REFILL_TOKENS=5          # Refill 5 tokens
RATE_LIMIT_LOGIN_REFILL_DURATION=15       # Every 15 minutes

# Registration endpoint rate limits
RATE_LIMIT_REGISTER_CAPACITY=3            # Max 3 attempts
RATE_LIMIT_REGISTER_REFILL_TOKENS=3       # Refill 3 tokens
RATE_LIMIT_REGISTER_REFILL_DURATION=60    # Every 60 minutes

# General API rate limits (per IP)
RATE_LIMIT_API_CAPACITY=100               # Max 100 requests
RATE_LIMIT_API_REFILL_TOKENS=100          # Refill 100 tokens
RATE_LIMIT_API_REFILL_DURATION=1          # Every 1 minute
```

### Application URLs
```bash
APP_BASE_URL=https://api.yourcompany.com
```

### Spring Profile
```bash
SPRING_PROFILES_ACTIVE=prod  # Options: local, dev, stag, prod
```

---

## 📋 Environment Variable Templates

### Development Environment (.env.dev)
```bash
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/comestag_dev
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres

# JWT
AUTH_TOKEN_USER_SECRET_KEY=ZGV2LXNlY3JldC1rZXktZm9yLWRldmVsb3BtZW50LW9ubHktY2hhbmdlLWluLXByb2Q=
AUTH_TOKEN_ACCESS_DURATION=1800
AUTH_TOKEN_REFRESH_DURATION=18000

# Email (Development - use Mailtrap or similar)
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_FROM=dev@comestag.local
MAIL_FROM_NAME=Comestag Dev

# Verification
VERIFICATION_CODE_SECRET=dev-verification-secret-change-in-production

# CORS (allow localhost)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080

# Rate Limiting (relaxed for dev)
RATE_LIMIT_ENABLED=false

# Profile
SPRING_PROFILES_ACTIVE=dev
```

### Production Environment (.env.prod)
```bash
# Database (use strong credentials!)
SPRING_DATASOURCE_URL=jdbc:postgresql://prod-db-host:5432/comestag_prod
SPRING_DATASOURCE_USERNAME=${DB_USERNAME}
SPRING_DATASOURCE_PASSWORD=${DB_PASSWORD}

# JWT (MUST change these!)
AUTH_TOKEN_USER_SECRET_KEY=${JWT_SECRET}
AUTH_TOKEN_ACCESS_DURATION=1800
AUTH_TOKEN_REFRESH_DURATION=18000

# Email (Production - use SendGrid recommended)
SENDGRID_API_KEY=${SENDGRID_KEY}
MAIL_FROM=noreply@yourcompany.com
MAIL_FROM_NAME=Your Company

# Verification
VERIFICATION_CODE_SECRET=${VERIFICATION_SECRET}

# CORS (production domains only)
CORS_ALLOWED_ORIGINS=https://yourcompany.com,https://www.yourcompany.com

# Rate Limiting (strict for production)
RATE_LIMIT_ENABLED=true
RATE_LIMIT_LOGIN_CAPACITY=5
RATE_LIMIT_LOGIN_REFILL_DURATION=15
RATE_LIMIT_REGISTER_CAPACITY=3
RATE_LIMIT_REGISTER_REFILL_DURATION=60

# Profile
SPRING_PROFILES_ACTIVE=prod
```

---

## 🔐 Security Best Practices

### 1. Generate Strong Secrets
```bash
# Generate JWT secret
openssl rand -base64 64

# Generate verification code secret
openssl rand -base64 32
```

### 2. Never Commit Secrets
- Add `.env*` to `.gitignore`
- Use environment variables or secret management systems
- Rotate secrets regularly

### 3. Use Secret Management
- **AWS**: AWS Secrets Manager
- **Azure**: Azure Key Vault
- **GCP**: Google Secret Manager
- **Kubernetes**: Kubernetes Secrets
- **Docker**: Docker Secrets

### 4. Environment-Specific Secrets
- Use different secrets for dev, staging, and production
- Never use development secrets in production

---

## 🚀 Deployment Examples

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    image: comestag:latest
    environment:
      - SPRING_DATASOURCE_URL=${DB_URL}
      - SPRING_DATASOURCE_USERNAME=${DB_USER}
      - SPRING_DATASOURCE_PASSWORD=${DB_PASS}
      - AUTH_TOKEN_USER_SECRET_KEY=${JWT_SECRET}
      - SENDGRID_API_KEY=${SENDGRID_KEY}
    env_file:
      - .env.prod
```

### Kubernetes Secret
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: comestag-secrets
type: Opaque
stringData:
  db-password: your-db-password
  jwt-secret: your-jwt-secret
  sendgrid-api-key: your-sendgrid-key
```

### AWS Elastic Beanstalk
Set environment variables in the EB console or via `.ebextensions/`:
```yaml
option_settings:
  - namespace: aws:elasticbeanstalk:application:environment
    option_name: SPRING_DATASOURCE_URL
    value: jdbc:postgresql://...
  - namespace: aws:elasticbeanstalk:application:environment
    option_name: AUTH_TOKEN_USER_SECRET_KEY
    value: ${JWT_SECRET}
```

### Heroku
```bash
heroku config:set SPRING_DATASOURCE_URL="jdbc:postgresql://..."
heroku config:set AUTH_TOKEN_USER_SECRET_KEY="your-secret"
heroku config:set SENDGRID_API_KEY="your-key"
```

---

## ✅ Verification Checklist

Before deploying to production, ensure:

- [ ] All required environment variables are set
- [ ] Strong, unique secrets are generated
- [ ] Database credentials are secure
- [ ] JWT secret is at least 256 bits
- [ ] Email service is configured and tested
- [ ] CORS origins are restricted to your domains
- [ ] Rate limiting is enabled
- [ ] No secrets are hardcoded in properties files
- [ ] Secrets are not committed to version control
- [ ] Production and development secrets are different

---

## 📞 Support

For questions about environment configuration:
- Check `application.properties` for default values
- Review security documentation in `SECURITY_SETUP.md`
- Contact DevOps team for secret management access
