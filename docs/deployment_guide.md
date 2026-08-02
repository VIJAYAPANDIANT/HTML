# 🚀 IntelliSphere Production Deployment Guide

A comprehensive architectural checklist and configuration manual to deploy the IntelliSphere monorepo to production.

---

## 🏗️ Production Infrastructure Topology

```mermaid
graph LR
    User([End User]) -->|HTTPS| Vercel[Vercel SPA Hosting]
    Vercel -->|REST API Mappings| Render[Render Web Service]
    Render -->|Queries| Neon[(Neon Serverless PostgreSQL)]
    Render -->|Ingested files| Cloudinary[Cloudinary CDN]
    Render -->|Generative Prompts| Gemini[Google Gemini AI Engine]
```

---

## 🔑 Environment Variables Matrix

### 1. Frontend SPA (Vercel)
Set these variables in the **Vercel Project Settings > Environment Variables**:

| Variable Key | Purpose | Suggested Value |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base API target URL for Render instance | `https://intellisphere-api.onrender.com` |

---

### 2. Backend API (Render)
Set these variables in the **Render Web Service > Environment Variables**:

| Variable Key | Purpose | Example Value |
| :--- | :--- | :--- |
| `SPRING_PROFILES_ACTIVE` | Target Spring profile | `prod` |
| `SPRING_DATASOURCE_URL` | Neon PostgreSQL pooled URL connection string | `jdbc:postgresql://ep-cool-breeze-123.us-east-2.aws.neon.tech/intellisphere?sslmode=require` |
| `SPRING_DATASOURCE_USERNAME` | database owner | `admin` |
| `SPRING_DATASOURCE_PASSWORD` | database secret key password | `my-neon-db-password` |
| `GEMINI_API_KEY` | Google AI Studio Developer Key | `AIzaSyD-1234567890-abcdef` |
| `INTELLISPHERE_JWT_SECRET` | 256-bit Hex signature signing JWTs | `9a4f2c8d3e7b1a5f6c8d9e2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c` |
| `CLOUDINARY_URL` | Cloudinary Storage CDN key | `cloudinary://12345:abcde@my-cloud-name` |

---

## 🛠️ Step-by-Step Deployment Instructions

### 1. Database Deployment (Neon PostgreSQL)
1. Sign up on [Neon.tech](https://neon.tech/) and create a new project.
2. Select PostgreSQL 15+ engine.
3. In the Neon dashboard, click **Connection Details** and copy the connection parameters.
4. Execute `database/schema.sql` inside the Neon SQL editor or using `psql`:
   ```bash
   psql -h ep-cool-breeze-123.us-east-2.aws.neon.tech -U admin -d intellisphere -f database/schema.sql
   ```

### 2. File Storage Setup (Cloudinary)
1. Create a free account on [Cloudinary](https://cloudinary.com/).
2. Copy the **API Environment Variable** string (`CLOUDINARY_URL`) from your dashboard.
3. Keep this URL ready for the Render environment setups.

### 3. Backend Deployment (Render)
1. Sign up on [Render.com](https://render.com/).
2. Click **New + > Web Service**.
3. Link your GitHub repository.
4. Set the following parameters:
   - **Name**: `intellisphere-api`
   - **Language**: `Docker`
   - **Docker Context**: `.`
   - **Dockerfile Path**: `docker/Dockerfile.server`
5. Click **Advanced** and populate the Environment Variables list mapping database, Gemini, and Cloudinary keys as listed in the matrix above.
6. Press **Deploy Web Service**.

### 4. Frontend Deployment (Vercel)
1. Sign up on [Vercel.com](https://vercel.com/).
2. Click **Add New > Project** and select your GitHub repository.
3. Set the following build configurations:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the `VITE_API_URL` environment variable pointing to your deployed Render service.
5. Create a `vercel.json` inside `client/` to handle SPA route redirection fallbacks:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```
6. Press **Deploy**.
