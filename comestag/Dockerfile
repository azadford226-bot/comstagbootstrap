# ========== Multi-stage build for unified application ==========

# Stage 1: Build Frontend (Next.js)
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy package files
COPY frontend/package.json frontend/pnpm-lock.yaml* frontend/pnpm-workspace.yaml* ./

# Install pnpm if pnpm-lock.yaml exists, otherwise use npm
RUN if [ -f pnpm-lock.yaml ]; then \
        npm install -g pnpm && pnpm install --frozen-lockfile; \
    else \
        npm ci; \
    fi

# Copy frontend source
COPY frontend/ ./

# Build Next.js application
RUN if [ -f pnpm-lock.yaml ]; then \
        pnpm build; \
    else \
        npm run build; \
    fi

# Stage 2: Build Backend (Java/Spring Boot)
FROM maven:3.9-eclipse-temurin-21 AS backend-builder

WORKDIR /app

# Copy Maven descriptor first (cache deps)
COPY pom.xml .
RUN mvn -q -e -DskipTests dependency:go-offline

# Copy backend source
COPY src ./src

# Copy frontend build output to static resources
COPY --from=frontend-builder /app/frontend/.next/static ./src/main/resources/static/_next/static
COPY --from=frontend-builder /app/frontend/public ./src/main/resources/static/

# For standalone output, we need to handle it differently
# Copy standalone server files if they exist (though we'll serve from Spring Boot)
RUN mkdir -p ./src/main/resources/static

# Build the JAR with frontend static files included
RUN mvn -q -DskipTests clean package

# ========== Runtime stage ==========
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy the fat jar from the build stage
COPY --from=backend-builder /app/target/comestag-0.0.1-SNAPSHOT.jar app.jar

# Default profile (can be overridden)
ENV SPRING_PROFILES_ACTIVE=prod

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
