FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=builder /app/target/MuniPayBack-0.0.1-SNAPSHOT.jar app.jar

ENV PROFILES_ACTIVE=dev \
    DATA_URL="" \
    DATA_USER="" \
    DATA_PASSWORD=""

EXPOSE 8090
ENTRYPOINT ["java", "-jar", "app.jar"]
