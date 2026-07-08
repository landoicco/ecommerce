# Compile and package Spring app
FROM maven:3.9.8-eclipse-temurin-21-alpine AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src/ ./src/
RUN mvn package -DskipTests

# Run packaged Spring app
FROM eclipse-temurin:21-jre-alpine AS runner
COPY --from=builder /app/target/ecommerce-backend.jar ecommerce-backend.jar
ENTRYPOINT ["java", "-jar", "ecommerce-backend.jar"]
