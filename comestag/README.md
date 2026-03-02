# Comestag - Unified Application

A full-stack B2B networking platform combining Spring Boot backend and Next.js frontend in a single application.

## Architecture

- **Backend**: Spring Boot 3.5.6 (Java 21)
- **Frontend**: Next.js 16 (React 19, TypeScript)
- **Database**: PostgreSQL
- **Build**: Unified build process - frontend is built and served as static files from Spring Boot

## Project Structure

```
comestag/
├── frontend/              # Next.js frontend application
├── src/                   # Spring Boot backend source
│   ├── main/
│   │   ├── java/         # Java source code
│   │   └── resources/    # Configuration and static files
│   │       └── static/   # Frontend build output (generated)
└── pom.xml               # Maven configuration
```

## Prerequisites

- Java 21+
- Maven 3.9+
- Node.js 20+
- pnpm (recommended) or npm
- PostgreSQL 12+

## Building the Application

### Option 1: Build Scripts (Recommended)

**Windows:**
```powershell
.\build-all.ps1
```

**Linux/Mac:**
```bash
chmod +x build-all.sh
./build-all.sh
```

This will:
1. Build the Next.js frontend
2. Copy static files to Spring Boot resources
3. Build the Spring Boot JAR

### Option 2: Manual Build

**Step 1: Build Frontend**
```bash
cd frontend
pnpm install  # or npm install
pnpm build    # or npm run build
cd ..
```

**Step 2: Copy Frontend Build Output**
```bash
# Copy static assets
mkdir -p src/main/resources/static/_next/static
cp -r frontend/.next/static/* src/main/resources/static/_next/static/

# Copy public assets
cp -r frontend/public/* src/main/resources/static/
```

**Step 3: Build Backend**
```bash
mvn clean package
```

### Option 3: Docker Build

```bash
docker build -t comestag:latest .
```

## Running the Application

### Local Development

**Backend Only (for API development):**
```bash
mvn spring-boot:run
```

**Full Stack (recommended):**
1. Build the application (see above)
2. Run the JAR:
```bash
java -jar target/comestag-0.0.1-SNAPSHOT.jar
```

The application will be available at:
- Frontend: http://localhost:8080
- API: http://localhost:8080/v1
- Swagger UI: http://localhost:8080/swagger-ui.html

### Docker

```bash
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/comestag \
  -e SPRING_DATASOURCE_USERNAME=comestag \
  -e SPRING_DATASOURCE_PASSWORD=password \
  comestag:latest
```

## Configuration

### Environment Variables

- `SPRING_PROFILES_ACTIVE`: Active Spring profile (default: `prod`)
- `SPRING_DATASOURCE_URL`: PostgreSQL connection URL
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password
- `NEXT_PUBLIC_API_BASE_URL`: Frontend API base URL (default: empty for relative paths)

### Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE comestag;
CREATE USER comestag WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE comestag TO comestag;
```

2. Flyway will automatically run migrations on startup.

## Development

### Frontend Development

For frontend-only development (without building):
```bash
cd frontend
pnpm dev
```

This runs Next.js dev server on port 3000 (separate from backend).

### Backend Development

For backend-only development:
```bash
mvn spring-boot:run
```

API will be available on port 8080.

### Full Stack Development

For full stack development, it's recommended to:
1. Run backend on port 8080: `mvn spring-boot:run`
2. Run frontend dev server on port 3000: `cd frontend && pnpm dev`
3. Configure frontend to proxy API calls (already configured in dev mode)

## API Documentation

When running, Swagger UI is available at:
- http://localhost:8080/swagger-ui.html
- API Docs: http://localhost:8080/v3/api-docs

## Static File Serving

The application serves the Next.js frontend as static files from Spring Boot:
- Static assets: `/_next/static/`
- Public files: Root path
- API endpoints: `/v1/*`
- SPA routing: All non-API routes serve `index.html` for client-side routing

## Troubleshooting

### Frontend Not Loading

1. Ensure frontend was built: `cd frontend && pnpm build`
2. Check that static files exist: `ls src/main/resources/static/`
3. Rebuild: `./build-all.sh`

### CORS Errors

CORS is disabled since frontend and backend are on the same origin. If you see CORS errors:
1. Check that API calls use relative paths (no `/api/proxy` prefix)
2. Verify `NEXT_PUBLIC_API_BASE_URL` is empty or not set

### Build Failures

**Frontend build fails:**
- Check Node.js version (requires 20+)
- Try: `cd frontend && rm -rf node_modules && pnpm install`

**Backend build fails:**
- Ensure Java 21 is installed: `java -version`
- Check Maven: `mvn -version`
- Clean and rebuild: `mvn clean install`

## Production Deployment

1. Build the application: `./build-all.sh`
2. The JAR file contains everything: `target/comestag-0.0.1-SNAPSHOT.jar`
3. Deploy the JAR to your server
4. Configure environment variables
5. Run: `java -jar comestag-0.0.1-SNAPSHOT.jar`

Or use Docker:
```bash
docker build -t comestag:latest .
docker push your-registry/comestag:latest
```

## License

[Your License Here]


