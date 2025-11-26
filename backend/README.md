# 🚀 Backend — Spring Boot API

This backend exposes a Pokémon API using Spring Boot.

## Prerequisites

### 1. Install Java 17+
- Download from: https://www.oracle.com/java/technologies/downloads/

### 2. Install Maven
- Download: https://maven.apache.org/download.cgi
- Extract `apache-maven-3.x.x-bin.zip` to `C:\Maven`
- Set environment variables:
  - `MAVEN_HOME` = `C:\Maven\apache-maven-3.x.x`
  - Add `C:\Maven\apache-maven-3.x.x\bin` to PATH
- Verify: `mvn -v`

## Run the Backend

```bash
mvn spring-boot:run
```

Server runs on `http://localhost:8080`

**Test:** `http://localhost:8080/api/pokemon/pikachu`

## 🌐 Alternative: GitHub Codespaces

1. Open repo → **Code** → **Create codespace on main**
2. Run `mvn spring-boot:run` in terminal
