# 🌌 IntelliSphere

> **AI-Powered Decision Intelligence Platform**

IntelliSphere is a state-of-the-art Decision Intelligence Platform designed to help enterprise leaders make complex, data-driven decisions through advanced AI analytics, simulations, and predictive modeling.

---

> [!NOTE]
> **Day 4 Milestone Achieved**: The **Healthcare Module** and **Shared AI Clinical Features** have been successfully added to the platform, equipping operators with patient roster grids, ECharts admissions metrics, AI triage analyzers, and dynamic medical brief PDF exports.

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

## 🏗️ System Architecture

IntelliSphere follows a secure, decoupled full-stack architectural paradigm. The data flow from UI interactions to external service overlays is modeled below:

```mermaid
graph TD
    Client[React 19 Frontend SPA] -->|HTTP REST + Bearer JWT| API[Spring Boot REST Gateway]
    API -->|Authentication Verification| Sec[Spring Security & JWT Filter]
    Sec -->|Entity Mapping| DB[(PostgreSQL 16 Tables)]
    API -->|Query Conditions| Weather[Open-Meteo REST Caching Service]
    API -->|Generative Prompts| AIService[Shared AI Service]
    AIService -->|Rest client payload| Gemini[Google Gemini API]
    API -->|Binary compilation| PDF[OpenPDF Engine]
    PDF -->|Byte stream file download| Client
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
- **GIS Mapping**: Leaflet Map Integration with OpenStreetMap standard tiles

### Backend (`server/`)
- **Framework**: Spring Boot 3.3.1 (Java 21)
- **Build System**: Maven (via `./mvnw` wrapper, Lombok version 1.18.46)
- **Database Access**: Spring Data JPA / Hibernate
- **Security**: Spring Security & JWT (using `jjwt` 0.12.5) with stateless filters
- **AI Engine**: Google Gemini API integration (`v1beta/models/gemini-1.5-flash`)
- **Document Export**: PDF generation using `openpdf` (v1.3.30)
- **REST Documentation**: SpringDoc OpenAPI Swagger UI

### Database & DevOps
- **Relational DB**: PostgreSQL 15+ (comprehensive 16-table schema)
- **Caching & Messaging**: Redis 7+
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions workflows validating client packages (legacy peer dependency bypasses) and Maven compilation under JDK 21.

---

## 📄 Database Architecture (`database/`)

The PostgreSQL relational database is structured around 32 core tables:
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
14. **`farms`**: Tracks location, organization ties, and acreage.
15. **`crops`**: Logs growth stages, active health index ratios, and target farm references.
16. **`diseases`**: Logs localized disease names, probability risks, and mitigation advice.
17. **`hospitals`**: Tracks healthcare institutions.
18. **`departments`**: Clinical departments (ER, ICU).
19. **`patients`**: Patient diagnostic history logs.
20. **`beds`**: Room bed statuses.
21. **`medical_reports`**: Direct digital patient consult charts.
22. **`healthcare_alerts`**: Alarm triggers for clinical environments.
23. **`healthcare_recommendations`**: AI clinical recommendations.
24. **`mfg_factories`**: Plant names, OEE percentages, active machines, and daily target metrics.
25. **`mfg_production_lines`**: Assembly line targets, outputs, and OEE performance trackers.
26. **`mfg_machines`**: Telemetry sensor boundaries (temp, vibration, spindle speed, hydraulic PSI, age).
27. **`mfg_production_metrics`**: Target vs completed units, scrap log values, and yield rates.
28. **`mfg_maintenance_logs`**: Work orders schedule logs, severities, and assigned technicians.
29. **`mfg_energy_usage`**: Energy consumption levels, peak loads, and cost tracking logs.
30. **`mfg_alerts`**: Alarm categories (Machine Failure, Safety curtains, temperature spikes) and statuses.
31. **`mfg_predictions`**: Equipment failure probabilities, confidence parameters, and diagnostics.
32. **`mfg_recommendations`**: Preventative repair guidance cards and estimated financial savings.

---

## 🤖 AI Engine & Report Generator

The platform implements a unified, central AI engine service (`AIService.java` & `GeminiService.java`) that drives core decision capabilities across all industry modules:
- **Google Gemini API**: Processes parameter DTOs, evaluates risk indexes, and generates suggestions via the official Gemini endpoint (`gemini-1.5-flash`). Supports realistic fallback mocks for local testing.
- **On-the-fly PDF Generation**: Integrates OpenPDF (`com.lowagie.text`) to compile metrics, alarm feeds, and operator notes into styled corporate PDF sheets on the fly.
- **AI Chat Assistant**: Interactive conversation playground using context-aware prompts.
- **Live Weather Cache**: Queries Open-Meteo REST parameters for farm coords and caches results in a thread-safe synchronized ConcurrentHashMap with a 15-minute TTL.

---

## 📂 Core UI Pages Layout

The frontend SPA maps the following user paths:
- `/` - Public marketing landing page.
- `/login` / `/register` - Secure authentication gateways.
- `/dashboard` - Operational cockpit containing animated KPI cards, live weather overlay widget, smart alerts list with dismiss triggers, recent predictions list, recent uploads list, and ECharts risk heatmaps.
- `/agriculture` - Agriculture cockpit containing:
  - **Overview Metrics**: Active area, water consumption, and soil hydration ratios.
  - **Soil Health Cards**: Real-time NPK levels, pH ratios, temperature, and moisture.
  - **Crop Monitoring**: Cultivated crop statuses, growth stages, and health status indicators.
  - **Field Map Selector**: Toggle system supporting sector grid schematics and Leaflet GIS mapping layer overlays.
  - **Diagnostics Scanner**: Visual foliage computer vision scan simulation logs.
  - **Report Modal**: Dialog interface to write operator action notes and download decision PDFs.
- `/healthcare` - Healthcare cockpit containing:
  - **Overview Metrics**: Patients count, bed counts, emergency cases, doctors.
  - **Triage Simulator**: Textbox to query Gemini triage priority levels.
  - **SVG wing map vs Leaflet GIS branches map toggler**.
  - **ECharts Department Admissions donut chart**.
  - **AI Patient Brief Summarizer**: dropdown selector providing direct AI patient chart summaries.
  - **Medical PDF brief download overlay**.
- `/manufacturing` - Manufacturing cockpit containing:
  - **Overview Metrics**: Factories counts, active machinery utilities, overall plant OEE rates, daily targets completed.
  - **Machine Monitoring Center**: Side-by-side interactive machinery registry list with filter options (Assembly lines A/B/C and warning status select boxes). Renders detailed temperature, vibration, spindle speeds, hydraulic PSI, age months, last maintenance, and failure risks.
  - **AI Predictive Maintenance**: Diagnostics simulator with 4 IoT range sliders (temp, vibration, speed, pressure) running automated neural predictive scan simulations and timeline logs.
- `/uploads` - Drag-and-drop Upload Center supporting CSV, Excel, PDF, and image uploads, file validation, progress bars, and upload history logs.
- `/analytics` - Analytics dashboard toggling dynamically between Agriculture (6 charts) and Manufacturing analytics (7 interactive ECharts: Production trend, Machine Utilization, Downtime analysis, Grid Peak energy draw, OEE indices, Monthly Target completion, and Maintenance Cost allocations).
- `/notifications` - Alert Center toggling between System Log notifications and Mfg Smart Alerts (Machine Failure, Safety Warning, Temperature spike, Production Delays) with red flashing warning pings.
- `/ai-center` / `/reports` / `/settings` - Standard operational panels.

---

## 🌐 Conceptual REST APIs

To support the UI layout, the backend controllers expose the following endpoint structures:
- `GET /api/agriculture/dashboard` - Fetches overall crop stats, soil matrices, and Alerts.
- `GET /api/agriculture/farms` - Fetches active farm entities.
- `GET /api/agriculture/weather` - Fetches live weather conditions from Open-Meteo.
- `GET /api/agriculture/predictions` - Fetches recent AI predictions.
- `POST /api/agriculture/upload` - Logs telemetry uploads.
- `POST /api/ai/chat` - Submits prompts to the Gemini conversation engine.
- `POST /api/ai/report` - Requests a compiled PDF report document binary.
- `GET /api/healthcare/dashboard` - Fetches clinical KPIs, bed structures, alerts.
- `GET /api/healthcare/patients` - Fetches admitted patient rosters.
- `GET /api/healthcare/alerts` - Fetches clinical critical alert logs.
- `POST /api/healthcare/report` - Generates healthcare PDF briefs.
- `POST /api/ai/healthcare-summary` - Direct patient consult diagnosis briefs.
- `POST /api/healthcare/simulate-triage` - Submits triage diagnostic symptoms.
- `GET /api/manufacturing/dashboard` - Fetches overall factory KPIs, OEE indices, alerts.
- `GET /api/manufacturing/machines` - Lists active machines telemetry parameters.
- `GET /api/manufacturing/analytics` - Fetches yield scores, downtime allocations, and cost values.
- `GET /api/manufacturing/alerts` - Fetches pending smart alerts array.
- `POST /api/manufacturing/report` - Compiles and downloads styled Industrial Production briefs.
- `POST /api/ai/manufacturing-summary` - Generates Gemini AI executive production summary briefings.
- `POST /api/ai/manufacturing/predictive-maintenance` - Runs diagnostic anomaly risk models.

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
$env:JAVA_HOME = "C:\Program Files\Java\jdk-26.0.1"
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

### 4. Running Test Suites
To run the automated backend test suites (which execute against H2 in-memory databases and exclude external API dependencies):
```bash
cd server
./mvnw test
```
