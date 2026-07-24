# 🌌 IntelliSphere

> **AI-Powered Decision Intelligence Platform**

IntelliSphere is a state-of-the-art Decision Intelligence Platform designed to help enterprise leaders make complex, data-driven decisions through advanced AI analytics, simulations, and predictive modeling.

---

## 🏗️ Monorepo Architecture

IntelliSphere is organized as a unified monorepo for seamless integration, testing, and deployment:

```
intellisphere/
├── client/          # React Frontend (Vite, TypeScript, Tailwind CSS v4, shadcn/ui)
├── server/          # Spring Boot Backend (Java 17+, Maven)
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
- **Core**: React 19, TypeScript, React Router
- **Build Tool**: Vite
- **State Management**: Zustand
- **Query & Fetching**: TanStack Query, Axios
- **Styling**: Tailwind CSS v4, shadcn/ui (Radix UI core & Nova preset)
- **Data Visualization**: Apache ECharts (`echarts-for-react`)
- **Geospatial Mapping**: Leaflet (`react-leaflet`)

### Backend (`server/`)
- **Framework**: Spring Boot 3.3.1 (Java 17)
- **Build System**: Maven (via `./mvnw` wrapper)
- **Database Access**: Spring Data JPA / Hibernate
- **Security**: Spring Security & JWT (using `jjwt` 0.12.5)
- **AI Integrations**: Spring AI (with OpenAI Starter)
- **Real-Time Communication**: WebSocket

### Database & DevOps
- **Relational DB**: PostgreSQL 15+ (comprehensive 12-table schema)
- **Caching & Messaging**: Redis 7+
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions

---

## 📄 Database Architecture (`database/`)

The PostgreSQL relational database is structured around 12 core tables:
1. **`roles`**: User authorization permissions.
2. **`users`**: Identity credentials and role mappings.
3. **`organizations`**: Workspace management and tenant groupings.
4. **`industry_modules`**: Registrations for domain-expert AI setups.
5. **`assets`**: Client hardware assets (Tractors, Turbines, CT Scanners, etc.).
6. **`sensors`**: IoT sensor registrations, units, and readings.
7. **`reports`**: Log trackers for documents and sheet uploads.
8. **`alerts`**: System alarm states and severities.
9. **`predictions`**: Simulation parameters and outcomes produced by the AI engine.
10. **`recommendations`**: Prioritized recommendations derived from AI models.
11. **`notifications`**: Active notifications for users.
12. **`audit_logs`**: Audit trail of system actions and network IPs.

---

## 🚀 Shared AI Engine

The platform implements a unified, central AI engine service (`AIService.java`) that drives core decision capabilities across all industry modules:
- **Report Summary**: Compiles and summarizes uploaded enterprise documents.
- **Risk Prediction**: Assesses risk levels and identifies system failure modes.
- **Recommendation Engine**: Generates prioritized mitigation suggestions.
- **Executive Summary**: Creates concise briefs of simulated outcomes.
- **AI Chat**: Exposes conversational analysis playgound.
- **Trend Forecast**: Calculates linear probability trends from historical datasets.

---

## 📂 Core UI Pages Layout

The frontend SPA maps the following user paths:
- `/` - Public platform landing page with glowing gradient visuals.
- `/login` - Secure login page.
- `/register` - Workspace registration page.
- `/dashboard` - Enterprise landing cockpit featuring KPI metrics, ECharts line graphs, and interactive SVG global hotspot maps.
- `/industry` - Tabbed simulation workspace hosting specialized industry modules:
  - **🌾 Agriculture**: Crop yield and irrigation schedule optimizations.
  - **🏥 Healthcare**: Clinic staffing and patient load optimizations.
  - **🏭 Manufacturing**: Predictive maintenance schedule optimizations.
  - **🏙 Smart City**: Grid load-balancing and traffic optimizations.
- `/ai-center` - Chat playground to query the AI service.
- `/analytics` - Probability distribution and graph analytics sandboxes.
- `/reports` - Table tracking exported PDF/Excel sheets.
- `/notifications` - Alarm log feeds.
- `/profile` - User access keys, MFA configurations, and profile parameters.
- `/settings` - Workspace settings and API gateway configuration.

---

## 🏁 Quick Start Guide

### Prerequisites
Before running the platform, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **Java SE Development Kit** (JDK 17 or higher)
- **Docker & Docker Compose**

### 1. Database & Infrastructure Setup
Spin up the required database and cache containers:
```bash
docker-compose up -d
```

### 2. Backend Setup
Navigate to the backend directory, set the appropriate JDK version, and compile/start:
```bash
cd server
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17" # Windows PowerShell
./mvnw spring-boot:run
```

### 3. Frontend Setup
Navigate to the frontend directory, install dependencies, and start the development server:
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:5173` to explore the platform.
