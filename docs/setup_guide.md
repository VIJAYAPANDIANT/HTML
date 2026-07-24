# Setup Guide

Follow these steps to set up, configure, and run IntelliSphere on your local development environment.

## System Prerequisites

Ensure you have the following installed:
- **Node.js** (v18.0.0 or higher) & **npm**
- **Java SE Development Kit (JDK)** 17 or 21 (JDK 26 is supported)
- **Docker** and **Docker Compose**

---

## 1. Database & Services Setup
We use Docker Compose to run PostgreSQL and Redis locally without requiring native installation.

Run the following command from the project root:
```bash
docker-compose up -d
```

Verify that the containers are running:
```bash
docker ps
```

---

## 2. Spring Boot Backend Setup

1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```

2. Set the `JAVA_HOME` environment variable to point to your JDK installation (e.g., JDK 21 or 26).
   - **PowerShell**:
     ```powershell
     $env:JAVA_HOME = "C:\Program Files\Java\jdk-26.0.1"
     ```
   - **Bash**:
     ```bash
     export JAVA_HOME="/usr/lib/jvm/java-21"
     ```

3. Run Maven clean and start the app:
   ```bash
   ./mvnw spring-boot:run
   ```

---

## 3. React Frontend Setup

1. Navigate to the `client/` directory:
   ```bash
   cd client
   ```

2. Install the package dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`.
