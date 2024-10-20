# Stage 1: Build the project
FROM openjdk:11-jdk AS builder
WORKDIR /build

# Copy the Maven wrapper and pom.xml to the container
COPY .mvn/ .mvn
COPY mvnw .
COPY pom.xml .

RUN chmod +x mvnw

# Download dependencies (this step will be cached as long as pom.xml doesn't change)
RUN ./mvnw dependency:go-offline

COPY src/ src/

# Build the project
RUN ./mvnw clean install

# Stage 2: Create the final image
FROM openjdk:11-jdk
WORKDIR /demo

# Copy the built jar and sdk.properties from the builder stage
COPY --from=builder /build/target/*.jar /demo/app.jar
COPY --from=builder /build/target/classes/sdk.properties /demo/sdk.properties

ENTRYPOINT ["java","-jar","/demo/app.jar"]