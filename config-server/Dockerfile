FROM openjdk:17-jdk-slim
# Install curl
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
ARG JAR_FILE=target/config-server-*.jar
COPY ${JAR_FILE} app.jar
COPY config-repo /config-repo
ENTRYPOINT ["java", "-jar", "/app.jar"]
