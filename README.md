# 🌌 IntelliSphere

> **AI-Powered Decision Intelligence Platform**

IntelliSphere is a state-of-the-art Decision Intelligence Platform designed to help enterprise leaders make complex, data-driven decisions through advanced AI analytics, simulations, and predictive modeling.

---

## 🏗️ Monorepo Architecture

IntelliSphere is organized as a unified monorepo for seamless integration, testing, and deployment:

```
intellisphere/
├── client/          # React Frontend (Vite, TypeScript, Tailwind)
├── server/          # Spring Boot Backend (Java 21+, Maven)
├── docs/            # Platform & Architecture Documentation
├── assets/          # Brand Assets, Logos, and Media
├── database/        # SQL Schemas, Migrations & Database Seeds
├── api/             # API Documentation & Postman Collections
├── docker/          # Dockerfiles & Multi-stage Build Configs
└── docker-compose.yml
```

---

## 🛠️ Tech Stack & Technologies

### Frontend (`client/`)
- **Core**: React 18 / 19, TypeScript
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (highly polished custom design system)
- **State Management**: React Context / Redux Toolkit
- **Data Visualization**: Recharts / Chart.js

### Backend (`server/`)
- **Framework**: Spring Boot 3.x
- **Build System**: Maven (via `./mvnw` wrapper)
- **Database Access**: Spring Data JPA / Hibernate
- **Security**: Spring Security & JWT
- **AI Integrations**: Spring AI / LangChain4j

### Database & DevOps
- **Relational DB**: PostgreSQL
- **Caching & Messaging**: Redis
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions

---

## 🚀 Quick Start Guide

### Prerequisites
Before running the platform, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **Java SE Development Kit** (JDK 17 or higher)
- **Docker & Docker Compose** (for localized database/service containers)

### 1. Database & Infrastructure Setup
Spin up the required database and cache containers:
```bash
docker-compose up -d
```

### 2. Backend Setup
Navigate to the backend directory and launch the Spring Boot application:
```bash
cd server
./mvnw spring-boot:run
```

### 3. Frontend Setup
Navigate to the frontend directory, install dependencies, and start the development server:
```bash
cd client
npm install
npm run dev
```

---

## 📄 Documentation

For full guides, database schemas, and API references, check out:
- [Platform Docs](file:///c:/Intellisphere/docs/)
- [Postman API Spec](file:///c:/Intellisphere/api/)
- [Database Schema & Migrations](file:///c:/Intellisphere/database/)
