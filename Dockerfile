# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Stage 1: Build the full application (React frontend + Spring Boot backend).
# The backend's pom.xml drives the frontend build via frontend-maven-plugin
# and copies the production bundle into src/main/resources/static, so the
# resulting JAR serves both the API and the UI from a single process.
# ---------------------------------------------------------------------------
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app
COPY backend/pom.xml backend/pom.xml
COPY backend/src backend/src
COPY frontend frontend

WORKDIR /app/backend
RUN mvn -B clean package -DskipTests

# ---------------------------------------------------------------------------
# Stage 2: Minimal runtime image
# ---------------------------------------------------------------------------
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app
RUN mkdir -p /app/uploads

COPY --from=build /app/backend/target/petcare-hub.jar ./app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
