# Production Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment

### Environment Variables
- [ ] `APP_SECURITY_JWT_SECRET` - Set to strong random string (min 32 chars)
- [ ] `VERIFICATION_CODE_SECRET` - Set to strong random string
- [ ] `AUTH_TOKEN_USER_SECRET_KEY` - Set to strong random string
- [ ] `SPRING_DATASOURCE_URL` - Production database URL
- [ ] `SPRING_DATASOURCE_USERNAME` - Production database username
- [ ] `SPRING_DATASOURCE_PASSWORD` - Production database password
- [ ] `CORS_ALLOWED_ORIGINS` - Comma-separated list of production domains
- [ ] `APP_BASE_URL` - Production application URL
- [ ] `MAIL_HOST` - SMTP server host
- [ ] `MAIL_USERNAME` - Email username
- [ ] `MAIL_PASSWORD` - Email password
- [ ] `MAIL_FROM` - From email address
- [ ] `SUPABASE_URL` - Supabase project URL
- [ ] `SUPABASE_SERVICE_KEY` - Supabase service key
- [ ] `SPRING_PROFILES_ACTIVE=prod` - Set to production profile

### Security
- [ ] All secrets are in environment variables (not hardcoded)
- [ ] JWT secret is at least 32 characters
- [ ] Database password is strong
- [ ] CORS origins are restricted to production domains only
- [ ] HTTPS is enabled
- [ ] SSL certificate is valid

### Database
- [ ] Production database is created
- [ ] Database user has appropriate permissions
- [ ] Flyway migrations are tested
- [ ] Database backups are configured

### Infrastructure
- [ ] Server has sufficient resources (CPU, RAM, disk)
- [ ] Firewall rules are configured
- [ ] Monitoring is set up
- [ ] Log aggregation is configured

## Build & Deploy

### Build
- [ ] Frontend is built: `cd frontend && pnpm build`
- [ ] Frontend files are copied to `src/main/resources/static/`
- [ ] Backend is built: `mvn clean package -DskipTests`
- [ ] JAR file is created: `target/comestag-0.0.1-SNAPSHOT.jar`

### Deploy
- [ ] JAR file is uploaded to server
- [ ] Environment variables are set on server
- [ ] Application is started with production profile
- [ ] Application starts without errors

## Post-Deployment Verification

### Application Health
- [ ] Application responds to requests
- [ ] Health endpoint works: `GET /actuator/health`
- [ ] Frontend loads correctly
- [ ] No errors in application logs

### Functionality
- [ ] User registration works
- [ ] User login works
- [ ] Email verification works (if configured)
- [ ] API endpoints respond correctly
- [ ] File uploads work (if using Supabase)
- [ ] Email sending works (if configured)

### Security
- [ ] Security headers are present (check response headers)
- [ ] CORS is working correctly
- [ ] Authentication is required for protected endpoints
- [ ] Rate limiting is active
- [ ] No sensitive information in error messages

### Performance
- [ ] Response times are acceptable
- [ ] No memory leaks
- [ ] Database queries are optimized
- [ ] Static assets are cached

## Monitoring

- [ ] Application logs are being collected
- [ ] Error tracking is configured
- [ ] Performance monitoring is active
- [ ] Database monitoring is set up
- [ ] Uptime monitoring is configured

## Rollback Plan

- [ ] Previous version JAR is backed up
- [ ] Database migration rollback script is ready
- [ ] Rollback procedure is documented
- [ ] Team knows how to execute rollback

## Documentation

- [ ] Production deployment guide is updated
- [ ] Environment variables are documented
- [ ] Troubleshooting guide is available
- [ ] Contact information for support is available
