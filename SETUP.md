# RetroTimeCo (V1) - Setup & Deployment Guide

This repository contains the complete V1 codebase for the RetroTimeCo platform, consisting of a Next.js 15 storefront and a custom Node.js Express REST API backend.

## Architecture Overview
- **Frontend (`apps/storefront`)**: A Next.js 15 application utilizing Tailwind CSS and React for the customer-facing storefront and admin console UI.
- **Backend (`apps/backend`)**: A Node.js/Express server written in TypeScript. It handles API requests, authentication, and manages the timepiece catalog.
- **Database**: V1 uses local JSON file storage (`apps/backend/data/watches.json`) for persistence, ensuring simple setup without external database dependencies.

---

## 🛠️ Local Development Setup

To run the project locally on your machine for development or testing, follow these steps:

### 1. Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (v18 or higher)
- **npm** (Node Package Manager)

### 2. Install Dependencies
Open a terminal in the root directory of the project and install dependencies for both the frontend and backend:

```bash
# Install backend dependencies
cd apps/backend
npm install

# Install storefront dependencies
cd ../storefront
npm install
```

### 3. Start the Backend Server
The backend API needs to run on port 9000 to serve data to the frontend.

```bash
# From the project root, navigate to the backend
cd apps/backend

# Start the development server (runs on http://localhost:9000)
npm run dev
```
*Note: The backend will automatically create the `data/watches.json` file if it doesn't exist.*

### 4. Start the Storefront Server
Open a **new, separate terminal window**, navigate to the storefront directory, and start the Next.js development server:

```bash
# From the project root, navigate to the storefront
cd apps/storefront

# Start the development server (runs on http://localhost:3000)
npm run dev
```

### 5. Access the Platform
- **Storefront**: Open your browser and go to `http://localhost:3000`
- **Admin Console**: Go to `http://localhost:3000/admin`
- **Admin Security Key**: Use `88875` or `rtc2026` to unlock the console.

---

## 🚀 Production Deployment Guide

To host RetroTimeCo live on the internet, you will need to deploy the backend and frontend separately.

### Phase 1: Deploying the Backend API (Render.com)

Because V1 uses a local file (`watches.json`) to store your catalog, the backend requires a host that supports **Persistent Disks** (so your inventory isn't erased when the server restarts). We recommend **Render.com** for this.

1. Create a free account at [Render.com](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select this repository (`rtcin`).
4. Configure the Web Service:
   - **Name**: `rtc-backend` (or similar)
   - **Root Directory**: `apps/backend`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. **Configure Persistent Storage (CRITICAL)**:
   - Scroll down and click on **Advanced**.
   - Find the **Disks** section and click **Add Disk**.
   - **Name**: `rtc-data`
   - **Mount Path**: `/opt/render/project/src/apps/backend/data`
   - **Size**: 1 GB (the minimum)
6. Click **Create Web Service**. 
7. Once deployed, Render will provide a live URL (e.g., `https://rtc-backend.onrender.com`). **Copy this URL** for the next phase.

### Phase 2: Deploying the Storefront (Vercel.com)

Vercel provides lightning-fast edge hosting, which is perfect for the Next.js storefront.

1. Create a free account at [Vercel.com](https://vercel.com/).
2. Click **Add New Project** and import this repository (`rtcin`) from GitHub.
3. Configure the Project:
   - **Project Name**: `retrotimeco`
   - **Root Directory**: Click "Edit" and select `apps/storefront`.
4. **Environment Variables**:
   - Expand the Environment Variables section.
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: Paste the Render URL you copied in Phase 1 (e.g., `https://rtc-backend.onrender.com`).
   - Click **Add**.
5. Click **Deploy**. Vercel will build and launch your storefront.
6. Once deployed, you can access your site via the Vercel-provided domain (e.g., `https://retrotimeco.vercel.app`).

### Phase 3: Connect a Custom Domain
1. In your Vercel project dashboard, go to **Settings > Domains**.
2. Enter your custom domain (e.g., `www.retrotimeco.in`).
3. Vercel will display DNS records (usually an A Record or CNAME).
4. Log into your domain registrar (GoDaddy, Namecheap, etc.) and add these DNS records to point your domain to Vercel.
5. Vercel will automatically provision a free SSL certificate.

---

## 🔒 Security & Operations
- **Admin Access**: Protect your Admin Console key (`88875` or `rtc2026`). Do not share this key.
- **Data Backups**: Since your catalog is stored in `watches.json` on Render's persistent disk, it is recommended to periodically download the file via a custom endpoint or SSH if you upgrade your Render plan, ensuring you have local backups of your inventory.
