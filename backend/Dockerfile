FROM eclipse-temurin:17-jre
WORKDIR /app
COPY target/businessflow-api-0.0.1-SNAPSHOT.jar app.jar
ENV SERVER_PORT=8085
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
