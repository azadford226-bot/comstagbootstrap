# Unified Application Setup Guide

## Overview

The Comestag application has been unified into a single deployable application where:
- **Backend**: Spring Boot serves both API endpoints and static frontend files
- **Frontend**: Next.js is built and its static output is served from Spring Boot
- **Single JAR**: Everything is packaged into one executable JAR file

## Key Changes Made

### 1. Frontend Integration
- Next.js frontend copied to `comestag/frontend/`
- API clients updated to use relative paths (no proxy needed)
- Next.js configured for standalone output

### 2. Backend Configuration
- `WebMvcConfig.java`: Configures Spring Boot to serve static files
- `SecurityConfig.java`: Updated to allow static resource access
- Static files served from `src/main/resources/static/`

### 3. Build Process
- `build-frontend.sh/ps1`: Builds Next.js and copies to Spring Boot resources
- `build-all.sh/ps1`: Unified build script for both frontend and backend
- Updated Dockerfile: Multi-stage build for frontend + backend

## Building the Unified Application

### Windows
```powershell
cd comestag
.\build-all.ps1
```

### Linux/Mac
```bash
cd comestag
chmod +x build-all.sh
./build-all.sh
```

### What Happens During Build

1. **Frontend Build**
   - Installs dependencies (pnpm/npm)
   - Builds Next.js application
   - Copies static assets to `src/main/resources/static/`

2. **Backend Build**
   - Maven builds Spring Boot application
   - Includes static files in JAR
   - Creates executable JAR: `target/comestag-0.0.1-SNAPSHOT.jar`

## Running the Application

### Local Development

**Option 1: Run Built JAR**
```bash
java -jar target/comestag-0.0.1-SNAPSHOT.jar
```

**Option 2: Spring Boot Dev Mode**
```bash
mvn spring-boot:run
```

The application will be available at:
- **Frontend**: http://localhost:8080
- **API**: http://localhost:8080/v1/*
- **Swagger**: http://localhost:8080/swagger-ui.html

### Docker

```bash
docker build -t comestag:latest .
docker run -p 8080:8080 comestag:latest
```

## File Structure After Build

```
comestag/
├── frontend/                      # Next.js source
├── src/main/resources/
│   └── static/                   # Frontend build output (generated)
│       ├── _next/
│       │   └── static/          # Next.js static assets
│       ├── index.html           # Main HTML file
│       └── [public files]       # Public assets
└── target/
    └── comestag-0.0.1-SNAPSHOT.jar  # Unified JAR (contains everything)
```

## How It Works

### Request Flow

1. **Static Files** (CSS, JS, images):
   - Request: `GET /_next/static/...`
   - Served by: Spring Boot static resource handler
   - Location: `src/main/resources/static/_next/static/`

2. **API Requests**:
   - Request: `GET /v1/auth/login`
   - Served by: Spring Boot REST controllers
   - Authenticated via JWT filters

3. **SPA Routes** (React Router):
   - Request: `GET /dashboard` or `/profile`
   - Handled by: Spring Boot serves `index.html`
   - Client-side routing takes over

### Static File Serving

Spring Boot's `WebMvcConfig`:
- Serves files from `classpath:/static/`
- Handles SPA routing (serves index.html for non-API routes)
- Allows all static file extensions (js, css, images, fonts)

### Security Configuration

- Static resources: Publicly accessible
- API endpoints: Protected by JWT authentication
- Auth endpoints: Public (login, register, etc.)

## Development Workflow

### Frontend Development

For active frontend development, run Next.js dev server separately:

```bash
cd frontend
pnpm dev  # Runs on port 3000
```

Then configure API calls to point to backend on port 8080.

### Backend Development

For backend-only development:

```bash
mvn spring-boot:run  # Runs on port 8080
```

### Full Stack Development

1. Build once: `./build-all.sh`
2. Run JAR: `java -jar target/comestag-0.0.1-SNAPSHOT.jar`
3. Make changes
4. Rebuild affected parts

## Troubleshooting

### Frontend Not Loading

**Issue**: White screen or 404 errors

**Solutions**:
1. Rebuild frontend: `cd frontend && pnpm build`
2. Check static files exist: `ls src/main/resources/static/`
3. Rebuild everything: `./build-all.sh`

### API Calls Failing

**Issue**: CORS errors or 404s on API calls

**Solutions**:
1. Check API base URL is empty (relative paths)
2. Verify no `/api/proxy` prefix in API calls
3. Check browser console for actual request URLs

### Build Errors

**Frontend Build Fails**:
```bash
cd frontend
rm -rf node_modules .next
pnpm install
pnpm build
```

**Backend Build Fails**:
```bash
mvn clean
mvn package -DskipTests
```

## Configuration

### Environment Variables

Set these when running:

```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/comestag
export SPRING_DATASOURCE_USERNAME=comestag
export SPRING_DATASOURCE_PASSWORD=password
export SPRING_PROFILES_ACTIVE=local
```

### Frontend Environment Variables

Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_DEV_MODE=false
```

## Production Deployment

### Single JAR Deployment

1. Build: `./build-all.sh`
2. Deploy JAR: `target/comestag-0.0.1-SNAPSHOT.jar`
3. Run: `java -jar comestag-0.0.1-SNAPSHOT.jar`

### Docker Deployment

1. Build image: `docker build -t comestag:latest .`
2. Run container: `docker run -p 8080:8080 comestag:latest`

### Environment Setup

Ensure these environment variables are set:
- Database connection
- JWT secrets
- Email configuration
- Other application settings

## Advantages of Unified Application

✅ **Single Deployment**: One JAR contains everything
✅ **No CORS Issues**: Same origin for frontend and backend
✅ **Simpler Infrastructure**: One server, one port
✅ **Easier Scaling**: Single application to scale
✅ **Reduced Complexity**: No need for API gateway or proxy

## Limitations

⚠️ **Static Files**: Frontend is built at build time (not dynamic)
⚠️ **SSR**: Server-side rendering not available (client-side only)
⚠️ **Build Time**: Must rebuild frontend when UI changes
⚠️ **File Size**: JAR includes all frontend assets (larger file)

## Next Steps

1. ✅ Unified build process
2. ✅ Static file serving
3. ✅ SPA routing support
4. ⏭️ Add build optimizations
5. ⏭️ Implement CDN for static assets (optional)
6. ⏭️ Add health checks
7. ⏭️ Configure production settings


