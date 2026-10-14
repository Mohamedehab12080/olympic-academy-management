# Run Stage - using pre-built JAR from deployments
FROM eclipse-temurin:17-jre
WORKDIR /app

COPY ./service/ms/olympic/deployments/_ver_0.0.1/-mgt.jar app.jar

EXPOSE 7002
ENTRYPOINT ["java" , "-jar", "app.jar"]