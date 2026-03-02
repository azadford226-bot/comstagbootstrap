# Quick Start: Security & Testing

## 🚀 Quick Setup (5 minutes)

### 1. Set Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Generate secrets
echo "AUTH_TOKEN_USER_SECRET_KEY=$(openssl rand -base64 64)" >> .env
echo "VERIFICATION_CODE_SECRET=$(openssl rand -base64 32)" >> .env

# Edit .env and fill in your:
# - Database credentials
# - Email settings (SMTP or SendGrid)
# - CORS origins
```

### 2. Run Tests

```bash
# Run all tests
mvn test

# Run specific test suites
mvn test -Dtest=*UseCaseTest
mvn test -Dtest=*IntegrationTest
```

### 3. Start Application

```bash
# Development
export SPRING_PROFILES_ACTIVE=dev
mvn spring-boot:run

# Or use the build scripts
./build-all.sh  # Linux/Mac
.\build-all.ps1  # Windows
```

---

## ⚡ Key Features Implemented

### ✅ 1. Environment Variables
All secrets are now configurable via environment variables. **No hardcoded credentials!**

**Required Variables:**
- `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`
- `AUTH_TOKEN_USER_SECRET_KEY`, `VERIFICATION_CODE_SECRET`
- `MAIL_USERNAME`, `MAIL_PASSWORD` (or `SENDGRID_API_KEY`)

### ✅ 2. Rate Limiting
Automatic protection against brute force attacks:

| Endpoint | Limit | Window |
|----------|-------|--------|
| Login | 5 attempts | 15 min |
| Register | 3 attempts | 60 min |
| General API | 100 requests | 1 min |

**Configure:**
```bash
RATE_LIMIT_ENABLED=true
RATE_LIMIT_LOGIN_CAPACITY=5
```

### ✅ 3. CORS Protection
Production-ready CORS configuration:

```bash
CORS_ALLOWED_ORIGINS=https://yourapp.com,https://www.yourapp.com
CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,PATCH,OPTIONS
```

### ✅ 4. Comprehensive Tests
- **21 Unit Tests** - Use cases, services, rate limiting
- **10 Integration Tests** - REST endpoints, authentication
- **Test Coverage** - Authentication, RFQ, Security

---

## 📋 Pre-Production Checklist

```bash
# 1. Generate production secrets
openssl rand -base64 64  # For JWT
openssl rand -base64 32  # For verification codes

# 2. Set environment variables (see ENV_VARIABLES.md)

# 3. Run tests
mvn clean test

# 4. Build application
mvn clean package -DskipTests

# 5. Verify configuration
java -jar target/comestag-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

---

## 🔒 Security Endpoints

### Rate Limited Endpoints
- `POST /v1/auth/login` - 5 attempts / 15 min
- `POST /v1/auth/register` - 3 attempts / 60 min
- All `/v1/**` endpoints - 100 requests / min

### Response on Rate Limit
```json
{
  "statusCode": 429,
  "message": "Rate limit exceeded for login. Please try again later."
}
```

---

## 🧪 Testing Examples

### Run All Tests
```bash
mvn test
```

### Run Specific Test Class
```bash
mvn test -Dtest=AuthLoginUseCaseTest
mvn test -Dtest=RateLimitServiceTest
```

### Run Integration Tests Only
```bash
mvn test -Dtest=*IntegrationTest
```

### With Coverage Report
```bash
mvn test jacoco:report
# Report: target/site/jacoco/index.html
```

---

## 🛠️ Development Workflow

### Local Development
```bash
# 1. Set dev environment
export SPRING_PROFILES_ACTIVE=dev
export RATE_LIMIT_ENABLED=false  # Optional: disable for dev

# 2. Start backend
mvn spring-boot:run

# 3. Start frontend (in another terminal)
cd frontend
pnpm dev
```

### Test New Features
```bash
# 1. Write tests first (TDD)
# 2. Run tests
mvn test -Dtest=YourNewTest

# 3. Implement feature
# 4. Run all tests
mvn test
```

---

## 📚 Documentation

- **Environment Variables**: [ENV_VARIABLES.md](ENV_VARIABLES.md)
- **Security Setup**: [SECURITY_SETUP.md](SECURITY_SETUP.md)
- **API Documentation**: http://localhost:8080/swagger-ui.html

---

## 🐛 Troubleshooting

### Tests Failing?
```bash
# Clear and rebuild
mvn clean install

# Check H2 database
# Tests use in-memory H2, not PostgreSQL
```

### Rate Limiting Issues?
```bash
# Disable for development
export RATE_LIMIT_ENABLED=false

# Clear rate limit buckets (restart app)
```

### CORS Issues?
```bash
# Development - allow all
CORS_ALLOWED_ORIGINS=*

# Production - specific domains only
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### Missing Environment Variables?
```bash
# Check required variables
cat .env.example

# Verify they're loaded
env | grep SPRING
env | grep AUTH
```

---

## ✅ Success Criteria

Application is ready when:

- ✅ All tests pass (`mvn test`)
- ✅ Environment variables are set
- ✅ No hardcoded secrets in code
- ✅ Rate limiting works (test with curl)
- ✅ CORS configured for your domain
- ✅ Application starts without errors

---

**Need Help?**
- Review full documentation in `SECURITY_SETUP.md`
- Check environment variables in `ENV_VARIABLES.md`
- Run tests to verify: `mvn test`
