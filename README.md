# 🌌 IntelliSphere

> **AI-Powered Decision Intelligence Platform**

IntelliSphere is a state-of-the-art Decision Intelligence Platform designed to help enterprise leaders make complex, data-driven decisions through advanced AI analytics, simulations, and predictive modeling.

---

## 🏗️ Monorepo Architecture

IntelliSphere is organized as a unified monorepo for seamless integration, testing, and deployment:

```
intellisphere/
├── client/          # React Frontend (Vite, TypeScript, Tailwind CSS v4, shadcn/ui)
├── server/          # Spring Boot Backend (Java 21, Maven)
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
- **Form Libraries**: React Hook Form, Zod validation
- **Query & Fetching**: TanStack Query, Axios (configured with bearer token headers)
- **Styling**: Tailwind CSS v4, shadcn/ui (Radix UI core & Nova preset)
- **Data Visualization**: Apache ECharts (`echarts-for-react`)
- **Geospatial Mapping**: SVG Region Heatmaps with pulsating nodes

### Backend (`server/`)
- **Framework**: Spring Boot 3.3.1 (Java 21)
- **Build System**: Maven (via `./mvnw` wrapper, Lombok version 1.18.46)
- **Database Access**: Spring Data JPA / Hibernate
- **Security**: Spring Security & JWT (using `jjwt` 0.12.5) with stateless filters
- **AI Integrations**: Spring AI (with OpenAI Starter)
- **REST Documentation**: SpringDoc OpenAPI Swagger UI

### Database & DevOps
- **Relational DB**: PostgreSQL 15+ (comprehensive 13-table schema)
- **Caching & Messaging**: Redis 7+
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions workflows validating client packages and Maven compilations under JDK 21.

---

## 📄 Database Architecture (`database/`)

The PostgreSQL relational database is structured around 13 core tables:
1. **`roles`**: User authorization levels (`SUPER_ADMIN`, `ORG_ADMIN`, `ANALYST`, `OPERATOR`) and permissions arrays.
2. **`users`**: Identity credentials and role mappings with BCrypt hashing.
3. **`organizations`**: Workspace management and tenant groupings.
4. **`user_sessions`**: Session tokens logging, IP addresses, client agents, and expiration.
5. **`industry_modules`**: Registrations for domain-expert AI setups.
6. **`assets`**: Client hardware assets (Tractors, Turbines, CT Scanners, etc.).
7. **`sensors`**: IoT sensor registrations, units, and readings.
8. **`reports`**: Log trackers for documents and sheet uploads.
9. **`alerts`**: System alarm states and severities.
10. **`predictions`**: Simulation parameters and outcomes produced by the AI engine.
11. **`recommendations`**: Prioritized recommendations derived from AI models.
12. **`notifications`**: Active notifications for users.
13. **`audit_logs`**: Audit trail of system actions and network IPs.

---

## 🚀 Shared AI Engine

The platform implements a unified, central AI engine service (`AIService.java`) that drives core decision capabilities across all industry modules:
- **Report Summary**: Compiles and summarizes uploaded enterprise documents.
- **Risk Prediction**: Assesses risk levels and identifies system failure modes.
- **Recommendation Engine**: Generates prioritized mitigation suggestions.
- **Executive Summary**: Creates concise briefs of simulated outcomes.
- **AI Chat**: Exposes conversational analysis playground.
- **Trend Forecast**: Calculates linear probability trends from historical datasets.

---

## 📂 Core UI Pages Layout

The frontend SPA maps the following user paths:
- `/` - Public premium landing page featuring 9 sections: Hero, Features, Industries (tabbed selection), AI Engine, Architecture log diagrams, Pricing tier calculator, Star-rated Testimonials, FAQ accordion, and Footer.
- `/login` - Secure login page validated via Zod schemas.
- `/register` - Workspace registration page.
- `/dashboard` - Enterprise landing cockpit featuring KPI metrics, interactive ECharts line/donut graphs, SVG regional hotspot maps, filterable activity feeds, and websocket toast simulators.
- `/agriculture` - Crop yield and irrigation schedule optimizations.
- `/healthcare` - Clinic staffing and patient load optimizations.
- `/manufacturing` - Predictive maintenance schedule optimizations.
- `/smart-city` - Grid load-balancing and traffic optimizations.
- `/ai-center` - Chat playground to query the AI service.
- `/analytics` - Probability distribution and graph analytics sandboxes.
- `/reports` - Table tracking exported PDF/Excel sheets.
- `/notifications` - Alarm log feeds.
- `/profile` - User access keys, MFA configurations, and profile parameters.
- `/settings` - Workspace settings and API gateway configuration.

---

## 🛡️ Project Polish & Standards

IntelliSphere follows production-ready enterprise standards:
- **Error Boundaries**: Standalone `<ErrorBoundary>` wraps the router shell to intercept rendering crashes and present recovery instructions.
- **Custom 404 Pages**: Wildcard routes display a custom `<NotFoundPage />` directing traffic back to safety.
- **Empty States**: Reusable `<EmptyState>` loaders display center vector indicators for resolved feeds.
- **Skeleton Loaders**: Reusable `<Skeleton>` animations overlay loading frames.
- **Interceptors**: Axios client config automatically appends JWT bearer tokens to requests and handles 401 redirect shunts.

---

## 🏁 Quick Start Guide

### Prerequisites
Before running the platform, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **Java SE Development Kit** (JDK 21 or higher)
- **Docker & Docker Compose**

### 1. Database & Infrastructure Setup
Spin up the required database and cache containers:
```bash
docker-compose up -d
```

### 2. Backend Setup
Navigate to the backend directory, set JDK 21, and compile/start:
```bash
cd server
$env:JAVA_HOME = "C:\Program Files\Java\jdk-26.0.1" # Using compatible compiler settings
./mvnw spring-boot:run
```

### 3. Frontend Setup
Navigate to the frontend directory, install dependencies, and start the development server:
```bash
cd client
npm install --legacy-peer-deps
npm run dev
```
Open `http://localhost:5173` to explore the platform.
