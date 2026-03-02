# Comestag - B2B Networking Platform

A full-stack B2B networking platform that connects organizations and consumers, built with Spring Boot and Next.js.

## 🚀 Quick Start

### Prerequisites

- **Java 21+**
- **Maven 3.9+**
- **Node.js 20+** and **pnpm** (or npm)
- **PostgreSQL 12+**

### Build and Run

**Windows:**
```powershell
cd comestag
.\build-all.ps1
java -jar target/comestag-0.0.1-SNAPSHOT.jar
```

**Linux/Mac:**
```bash
cd comestag
chmod +x build-all.sh
./build-all.sh
java -jar target/comestag-0.0.1-SNAPSHOT.jar
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/v1/*
- **Swagger UI**: http://localhost:3000/swagger-ui.html

## 📁 Project Structure

```
comestag/
├── frontend/              # Next.js frontend application
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   └── lib/              # Utilities and API clients
├── src/                   # Spring Boot backend
│   ├── main/
│   │   ├── java/         # Java source code
│   │   └── resources/    # Configuration files
│   └── test/             # Test files
├── build-all.sh/.ps1     # Unified build scripts
├── Dockerfile            # Docker configuration
└── pom.xml               # Maven configuration
```

## 🏗️ Architecture

- **Backend**: Spring Boot 3.5.6 (Java 21) with Clean Architecture
- **Frontend**: Next.js 16 (React 19, TypeScript)
- **Database**: PostgreSQL with Flyway migrations
- **Security**: JWT authentication with Spring Security
- **API Documentation**: OpenAPI/Swagger

## 📚 Documentation

- **[Main README](comestag/README.md)** - Detailed documentation
- **[Deployment Guide](comestag/VERCEL_DEPLOYMENT.md)** - Vercel deployment instructions
- **[Quick Start](comestag/QUICK_START.md)** - Quick reference guide

## 🔧 Configuration

### Environment Variables

Set these environment variables before running:

```bash
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/comestag
SPRING_DATASOURCE_USERNAME=comestag
DB_PASSWORD=your-password

# JWT Security
APP_SECURITY_JWT_SECRET=your-jwt-secret-key

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-key
MAIL_FROM=your-email@example.com
```

See `comestag/README.md` for complete configuration details.

## 🐳 Docker

```bash
cd comestag
docker build -t comestag:latest .
docker run -p 3000:3000 comestag:latest
```

## 🌐 Deployment

### Frontend (Vercel)

The frontend can be deployed to Vercel. See [VERCEL_DEPLOYMENT.md](comestag/VERCEL_DEPLOYMENT.md) for detailed instructions.

### Backend (Separate Platform Required)

Since Vercel doesn't support Java/Spring Boot, deploy the backend separately:

**Recommended: Railway** (Easiest)
- Quick setup with GitHub integration
- Built-in PostgreSQL database
- Free tier available

**Quick Start**: See [BACKEND_DEPLOYMENT_QUICK.md](comestag/BACKEND_DEPLOYMENT_QUICK.md)

**Full Guide**: See [BACKEND_DEPLOYMENT.md](comestag/BACKEND_DEPLOYMENT.md) for:
- Railway (Recommended)
- Render
- Fly.io
- Docker deployments

## 📝 License

Copyright © 2026 Hive Control Solutions

## 🤝 Contributing

This is a private project. For questions or issues, please contact the development team.
