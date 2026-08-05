# 🚀 IntelliSphere Production Deployment Guide

A comprehensive architectural checklist and configuration manual to deploy the IntelliSphere monorepo to production.

---

## 🏗️ Production Infrastructure Topology

```mermaid
graph LR
    User([End User]) -->|HTTPS| Vercel[Vercel SPA Hosting]
    Vercel -->|REST API Mappings| Koyeb[Koyeb Web Service]
    Koyeb -->|Queries| Supabase[(Supabase PostgreSQL)]
    Koyeb -->|Ingested files| Cloudinary[Cloudinary CDN]
    Koyeb -->|Generative Prompts| Gemini[Google Gemini AI Engine]
```

---

## 🔑 Environment Variables Matrix

### 1. Frontend SPA (Vercel)
Set these variables in the **Vercel Project Settings > Environment Variables**:

| Variable Key | Purpose | Suggested Value |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base API target URL for Koyeb instance | `https://intellisphere-xxxx.koyeb.app` |

---

### 2. Backend API (Koyeb)
Set these variables in the **Koyeb Service > Environment Variables**:

| Variable Key | Purpose | Example Value |
| :--- | :--- | :--- |
| `SPRING_PROFILES_ACTIVE` | Target Spring profile | `prod` |
| `SPRING_DATASOURCE_URL` | Supabase PostgreSQL pooled URL connection string | `jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require` |
| `SPRING_DATASOURCE_USERNAME` | Database owner | `postgres.ogkusmyyovoizvdnoain` |
| `SPRING_DATASOURCE_PASSWORD` | Database secret key password | `9nCJHf9TfaC6epWF` |
| `GEMINI_API_KEY` | Google AI Studio Developer Key | `AIzaSyD-YOUR-GEMINI-API-KEY-HERE` |
| `INTELLISPHERE_JWT_SECRET` | 256-bit Hex signature signing JWTs | `9a4f2c8d3e7b1a5f6c8d9e2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c` |
| `CLOUDINARY_URL` | Cloudinary Storage CDN key | `cloudinary://12345:abcde@my-cloud-name` |

---

## 🛠️ Step-by-Step Deployment Instructions

### 1. Database Deployment (Supabase PostgreSQL)
1. Sign up on [Supabase.com](https://supabase.com/) and create a free project.
2. Select PostgreSQL 15+ engine.
3. In the Supabase dashboard, navigate to the **SQL Editor**, create a new query, paste the contents of `database/schema.sql`, and execute it to compile the 42 tables.
4. Go to **Project Settings > Database** to copy the PostgreSQL host, username, and password parameters.

### 2. File Storage Setup (Cloudinary)
1. Create a free account on [Cloudinary](https://cloudinary.com/).
2. Copy the **API Environment Variable** string (`CLOUDINARY_URL`) from your dashboard.
3. Keep this URL ready for the Koyeb environment setups.

### 3. Backend Deployment (Koyeb)
1. Sign up on [Koyeb.com](https://koyeb.com/).
2. Click **Create Service**.
3. Select **GitHub** as the deployment source and link your `intellisphere` repository.
4. Configure these parameters:
   - **Builder**: Select **Docker** (not Buildpack).
   - **Dockerfile Path**: `docker/Dockerfile.server`
   - **Docker Context**: `.` *(Leave as default/root)*
   - **Instance Size**: Select **Nano** (free tier instance with 512 MB RAM).
5. Scroll down to the **Environment Variables** section and add the keys as listed in the matrix above.
6. Click **Deploy**. Koyeb will compile the Dockerfile and expose a public URL (e.g., `https://intellisphere-xxxx.koyeb.app`).

### 4. Frontend Deployment (Vercel)
1. Sign up on [Vercel.com](https://vercel.com/).
2. Click **Add New > Project** and select your GitHub repository.
3. Set the following build configurations:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the `VITE_API_URL` environment variable pointing to your deployed Koyeb service URL.
5. Create a `vercel.json` inside `client/` to handle SPA route redirection fallbacks:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```
6. Press **Deploy**.
