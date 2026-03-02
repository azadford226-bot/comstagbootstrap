# Production Readiness Guide

This document outlines the production readiness checklist and deployment requirements for the Comestag application.

## ✅ Production Readiness Checklist

### Security
- [x] Security headers configured (XSS protection, CSP, HSTS, etc.)
- [x] CORS properly configured for production domains
- [x] JWT secrets validated (minimum 32 characters)
- [x] Password encryption (BCrypt)
- [x] Rate limiting enabled
- [x] Input validation on all endpoints
- [x] SQL injection protection (JPA/Hibernate)
- [x] Error handling without sensitive information leakage
- [x] Swagger/API docs disabled in production (via profile)

### Configuration
- [x] All secrets via environment variables (no hardcoded values)
- [x] Production profile configuration
- [x] Database connection validation
- [x] Startup validation for critical configs
- [x] Logging levels appropriate for production

### Database
- [x] Flyway migrations configured
- [x] Database connection pooling
- [x] Transaction management
- [x] No DDL auto-update in production (validate only)

### Frontend
- [x] Production build optimizations
- [x] Static asset serving
- [x] SPA routing support
- [x] Dev mode components disabled in production
- [x] Environment debugger disabled in production

### Error Handling
- [x] Global exception handler
- [x] No stack traces exposed to clients
- [x] Proper error logging
- [x] Graceful error responses

### Performance
- [x] Virtual threads enabled
- [x] Connection pooling
- [x] Static resource caching
- [x] Rate limiting

## Required Environment Variables

### Critical (Application will fail to start if missing)
```bash
# Security
APP_SECURITY_JWT_SECRET=<min-32-char-random-string>
VERIFICATION_CODE_SECRET=<random-secret>
AUTH_TOKEN_USER_SECRET_KEY=<random-secret>

# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://<host>:<port>/<database>
SPRING_DATASOURCE_USERNAME=<username>
SPRING_DATASOURCE_PASSWORD=<password>

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Application URL
APP_BASE_URL=https://yourdomain.com
```

### Important (Application will work but features may be limited)
```bash
# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=<your-email>
MAIL_PASSWORD=<app-password>
MAIL_FROM=noreply@yourdomain.com
MAIL_FROM_NAME=Comestag

# SendGrid (alternative to SMTP)
SENDGRID_API_KEY=<sendgrid-api-key>

# Supabase (for media storage)
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_KEY=<service-key>
SUPABASE_STORAGE_BUCKET=comestag-media
```

### Optional
```bash
# JWT Expiration
APP_SECURITY_JWT_EXP_MINUTES=60

# Token Durations
AUTH_TOKEN_REFRESH_DURATION=864000
AUTH_TOKEN_ACCESS_DURATION=1800

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_LOGIN_CAPACITY=5
RATE_LIMIT_REGISTER_CAPACITY=3
RATE_LIMIT_API_CAPACITY=100

# Management/Monitoring
MANAGEMENT_TRACING_ENABLED=false
MANAGEMENT_TRACING_SAMPLING=0.1
```

## Deployment Steps

### 1. Pre-Deployment Checklist
- [ ] All environment variables set
- [ ] Database migrations tested
- [ ] SSL/TLS certificate configured
- [ ] Domain DNS configured
- [ ] Email service configured
- [ ] Media storage (Supabase) configured

### 2. Build Process
```bash
# Build frontend
cd frontend
pnpm build

# Copy frontend files to backend resources
# (This is handled by the build script)

# Build backend
mvn clean package -DskipTests

# Output: target/comestag-0.0.1-SNAPSHOT.jar
```

### 3. Database Setup
```bash
# Ensure PostgreSQL is running
# Database will be created/migrated automatically by Flyway
# Make sure SPRING_DATASOURCE_URL points to production database
```

### 4. Run Application
```bash
# Set all required environment variables
export SPRING_PROFILES_ACTIVE=prod
export APP_SECURITY_JWT_SECRET=<your-secret>
# ... (all other variables)

# Run the application
java -jar target/comestag-0.0.1-SNAPSHOT.jar
```

### 5. Verification
- [ ] Application starts without errors
- [ ] Health endpoint responds: `/actuator/health`
- [ ] Frontend loads correctly
- [ ] API endpoints respond
- [ ] Authentication works
- [ ] Email sending works (if configured)

## Security Best Practices

1. **Never commit secrets** - All secrets must be in environment variables
2. **Use strong JWT secrets** - Minimum 32 characters, use cryptographically secure random
3. **Restrict CORS origins** - Only allow your production domain(s)
4. **Enable HTTPS** - Always use HTTPS in production
5. **Regular updates** - Keep dependencies updated
6. **Monitor logs** - Set up log monitoring and alerting
7. **Backup database** - Regular automated backups

## Monitoring

### Health Checks
- `/actuator/health` - Application health status
- `/actuator/metrics` - Application metrics
- `/actuator/prometheus` - Prometheus metrics endpoint

### Logging
- Application logs are in JSON format
- Log levels: WARN for root, INFO for application code
- Errors are logged with full stack traces (server-side only)

## Troubleshooting

### Application fails to start
- Check environment variables are set correctly
- Verify database connectivity
- Check logs for validation errors

### CORS errors
- Verify `CORS_ALLOWED_ORIGINS` includes your frontend domain
- Check that origins match exactly (including protocol and port)

### Email not sending
- Verify `MAIL_USERNAME` and `MAIL_PASSWORD` are correct
- For Gmail, use App Password, not regular password
- Check email service logs

### Database connection errors
- Verify `SPRING_DATASOURCE_URL` is correct
- Check database is accessible from application server
- Verify credentials are correct

## Production Profile Features

When `SPRING_PROFILES_ACTIVE=prod`:
- Production validation runs on startup
- Swagger/API docs are disabled
- Logging levels set to WARN/INFO
- Tracing disabled by default
- Only safe actuator endpoints exposed
- Security headers enabled
- CORS validation enforced

## Support

For issues or questions, check:
- Application logs
- `/actuator/health` endpoint
- Database connection status
- Environment variable configuration
