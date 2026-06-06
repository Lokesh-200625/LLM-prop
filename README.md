# Band Gap Predictor

Predict the band gap (eV) of crystalline materials from plain-text descriptions using a fine-tuned DistilRoBERTa-base Transformer regression model.

- Best validation MAE: 0.3411 eV
- Training data: about 124k material descriptions from the LLM-Prop dataset
- Stack: PyTorch, Hugging Face Transformers, FastAPI, Next.js, NextAuth.js, PostgreSQL, Prisma, Tailwind CSS

## Project Structure

```text
.
|-- docker-compose.yml     Docker Compose configuration for worker and database
|-- next.config.mjs        Next.js configuration
|-- package.json           Node/Next.js dependencies and scripts
|-- postcss.config.mjs     Tailwind/PostCSS config
|-- prisma/                Prisma schema and migrations
|-- src/                   Next.js App Router frontend
|   |-- app/               Application pages and API routes
|   |-- components/        React UI components
|   |-- lib/               Frontend utilities and services
|   |-- styles/            CSS and shared types
|-- worker/                Python model worker service
|   |-- app/               FastAPI app, core logic, and services
|-- tests/                 Project tests and integration checks
```

## Model Storage

**The model is no longer stored locally.** It is downloaded from Hugging Face on startup:

- **Repository:** `ZahidHussain-1007/llm-prop-bandgap-model`
- **Download:** Automatic via `worker/app/core/model_downloader.py`
- **Cache Location:**
  - **Local/Docker:** Uses HF default cache (`~/.cache/huggingface/` or `/root/.cache/huggingface/`)
  - **Render:** `/app/.cache/huggingface` (persists across redeployments)
  - **Configurable via:** `MODEL_CACHE_DIR` environment variable

## Quick Start on Windows

Double-click:

```text
start-app.bat
```

The script creates `.venv`, installs dependencies, starts the FastAPI backend on `http://127.0.0.1:8000`, starts Next.js on `http://localhost:3000`, and opens the app.

## Prerequisites

| Tool | Version |
| --- | --- |
| Python | 3.10 or newer |
| Node.js | 18 or newer |
| npm | Included with Node.js |
| PostgreSQL | 12 or newer |
| Hugging Face Account | Free tier (for token) |

## Database Setup

Before running the app, set up PostgreSQL and Prisma:

```bash
# 1. Create .env.local with your database URL
cp .env.example .env.local

# 2. Update DATABASE_URL in .env.local
# For local: DATABASE_URL="postgresql://postgres:postgres@localhost:5432/llmprop"
# For Neon: Copy connection string from Neon dashboard

# 3. Install dependencies
npm install

# 4. Run Prisma migrations
npx prisma migrate dev

# 5. (Optional) View database in browser
npx prisma studio
```

For detailed local setup instructions, see [DATABASE_SETUP.md](DATABASE_SETUP.md)

## Environment Variables

Create or update `.env.local` in the project root:

```bash
cp .env.example .env.local
```

Key variables (see `.env.example` for complete list with descriptions):

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/llmprop

# Authentication (generate secret with: openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Hugging Face (optional for public repo, required for private)
HF_TOKEN=

# Backend
WORKER_API_URL=http://localhost:8000
WORKER_HOST=127.0.0.1
WORKER_PORT=8000
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

For Google OAuth setup, see the [Architecture](#architecture) section below.

## Architecture

### Authentication
- **Provider:** NextAuth.js with Google OAuth
- **Session Strategy:** JWT (JSON Web Tokens)
- **Database Integration:** Prisma ORM
- **Security:** HTTPS, secure cookies, CSRF protection

### Database
- **System:** PostgreSQL
- **ORM:** Prisma for type-safe database access
- **Models:** Users, PredictionHistory, SharedPredictions
- **Migrations:** Version-controlled with Prisma Migrate

### Frontend
- **Framework:** Next.js 15 with App Router
- **Styling:** Tailwind CSS
- **Components:** Radix UI, custom components
- **State:** React hooks, NextAuth sessions

### Backend
- **API:** FastAPI with CORS support
- **Model:** Fine-tuned DistilRoBERTa
- **Inference:** PyTorch
- **Storage:** Models downloaded from Hugging Face on startup
- **Integration:** JSON API with frontend

## Production Deployment

Deploy the application to **Vercel** (frontend), **Render** (backend), and **Neon** (database).

### Step 1: Database (Neon)

1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project and database
3. Copy the **connection string** (includes credentials and host)
4. Save as `NEON_CONNECTION_STRING` for later use

### Step 2: Backend (Render)

1. Go to [render.com](https://render.com) and sign up
2. Create a new **Web Service**
3. Connect your GitHub repository
4. Configure the service:
   - **Name:** `bandgap-ml-worker`
   - **Environment:** `Python 3.11`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn worker.app.main:app --host 0.0.0.0 --port 8000`
   - **Plan:** Starter (free tier, CPU-only)

5. Add environment variables:
   ```
   DATABASE_URL=<your-neon-connection-string>
   WORKER_HOST=0.0.0.0
   WORKER_PORT=8000
   CORS_ORIGINS=https://<your-vercel-domain>.vercel.app
   MODEL_CACHE_DIR=/app/.cache/huggingface
   HF_TOKEN=<optional-huggingface-token>
   LOG_LEVEL=INFO
   MODEL_DEVICE=cpu
   ```

6. Deploy and note the URL (e.g., `https://bandgap-ml-worker.onrender.com`)

### Step 3: Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) and sign up
2. Create a new project from your GitHub repository
3. Configure build settings:
   - **Framework:** `Next.js`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

4. Add environment variables:
   ```
   DATABASE_URL=<your-neon-connection-string>
   NEXTAUTH_URL=https://<your-vercel-domain>.vercel.app
   NEXTAUTH_SECRET=<generate-with: openssl-rand-base64-32>
   GOOGLE_CLIENT_ID=<from-google-cloud-console>
   GOOGLE_CLIENT_SECRET=<from-google-cloud-console>
   NEXT_PUBLIC_WORKER_API_URL=https://<your-render-backend-url>
   ```

5. Deploy

### Google OAuth Setup (Required for Login)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or use an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials (Web application type)
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (local dev)
   - `https://<your-vercel-domain>.vercel.app/api/auth/callback/google` (production)
6. Copy the **Client ID** and **Client Secret**
7. Add to both `.env.local` (local dev) and Vercel environment variables (production)


## Manual Backend Start (Local Development)

```powershell
# Create and activate virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip

# Install Python dependencies
pip install -r worker/requirements.txt

# Set environment variables
$env:CORS_ORIGINS="http://localhost:3000,http://127.0.0.1:3000"
$env:WORKER_HOST="127.0.0.1"
$env:WORKER_PORT="8000"

# Start FastAPI backend (model downloads automatically on first startup)
python -m uvicorn worker.app.main:app --host 127.0.0.1 --port 8000 --reload
```

Health check:

```powershell
curl http://127.0.0.1:8000/health
```

### Model Download

The first startup will download the model from Hugging Face (≈1-2 GB). This happens automatically via `worker/app/core/model_downloader.py`. Subsequent startups use the cached model.

## Manual Frontend Start

Open a second terminal:

```powershell
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

## API Reference

### `GET /health`

Returns model status.

```json
{ "status": "ok", "model_ready": true, "device": "cpu" }
```

### `POST /predict-bandgap`

Single-text inference.

```json
{ "text": "Silicon crystallizes in diamond cubic structure and is an indirect semiconductor." }
```

### `POST /batch-predict`

Batch inference, up to 100 texts per request.

```json
{ "texts": ["Si description...", "GaAs description..."] }
```

## Useful Commands

```powershell
npm run dev
npm run build
python -m uvicorn server.app:app --host 127.0.0.1 --port 8000
```
