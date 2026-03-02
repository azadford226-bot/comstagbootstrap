# Quick Start Guide - Unified Comestag Application

## Prerequisites

- Java 21+
- Maven 3.9+
- Node.js 20+
- pnpm (recommended) or npm
- PostgreSQL 12+

## Quick Build & Run

### Windows
```powershell
cd comestag
.\build-all.ps1
java -jar target/comestag-0.0.1-SNAPSHOT.jar
```

### Linux/Mac
```bash
cd comestag
chmod +x build-all.sh
./build-all.sh
java -jar target/comestag-0.0.1-SNAPSHOT.jar
```

## What This Does

1. **Builds Frontend**: Compiles Next.js app and copies to Spring Boot static resources
2. **Builds Backend**: Creates JAR with frontend included
3. **Single JAR**: Everything runs from one executable file

## Access the Application

- **Frontend**: http://localhost:8080
- **API**: http://localhost:8080/v1/*
- **Swagger**: http://localhost:8080/swagger-ui.html

## Database Setup

```sql
CREATE DATABASE comestag;
CREATE USER comestag WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE comestag TO comestag;
```

Flyway migrations run automatically on startup.

## Environment Variables

```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/comestag
export SPRING_DATASOURCE_USERNAME=comestag
export SPRING_DATASOURCE_PASSWORD=your_password
export SPRING_PROFILES_ACTIVE=local
```

## Docker

```bash
docker build -t comestag:latest .
docker run -p 8080:8080 comestag:latest
```

## Troubleshooting

**Frontend not loading?**
- Rebuild: `./build-all.sh`
- Check: `ls src/main/resources/static/`

**API calls failing?**
- Ensure API base URL is empty (uses relative paths)
- Check browser console for errors

**Build fails?**
- Clean: `cd frontend && rm -rf node_modules && pnpm install`
- Rebuild: `cd .. && ./build-all.sh`

For detailed documentation, see `README.md` and `UNIFIED_APPLICATION_GUIDE.md`.


