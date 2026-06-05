# Cafe24 / Cloud Run — Spring Boot 3.5, JDK 21
# 빌드: docker build -t cama-doctor-web:local .
# 실행: docker run --rm -p 8081:8081 -e SPRING_PROFILES_ACTIVE=cafe24 ...

FROM gradle:8.12-jdk21 AS build
WORKDIR /app

COPY build.gradle settings.gradle ./
COPY gradle ./gradle
COPY gradlew gradlew.bat ./
COPY src ./src

RUN ./gradlew bootJar --no-daemon -x test

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

RUN groupadd --system spring && useradd --system --gid spring spring

COPY --from=build /app/build/libs/*.jar /app/app.jar
RUN chown spring:spring /app/app.jar

USER spring
EXPOSE 8081

ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75.0"
ENV SPRING_PROFILES_ACTIVE=cafe24
ENV DOCTOR_WEB_PORT=8081

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
