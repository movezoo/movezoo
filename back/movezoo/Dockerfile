FROM openjdk:17
ARG JAR_FILE=build/libs/movezoo-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} movezoo-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","/movezoo-0.0.1-SNAPSHOT.jar"]