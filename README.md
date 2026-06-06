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
|   |-- models/            Saved model weights and tokenizer files
|-- tests/                 Project tests and integration checks
```

## Note

This repository includes a separate Python worker service under `worker/` that serves model inference and health endpoints. The frontend proxy route at `src/app/api/predict/route.ts` forwards requests to the worker API and preserves backend metadata for prediction responses.

## Quick Start on Windows

Double-click:

```text
start-app.bat
```

The script creates `.venv`, installs Python dependencies from `requirements.txt`, installs npm dependencies when needed, starts the FastAPI backend on `http://127.0.0.1:8000`, starts Next.js on `http://localhost:3000`, and opens the app.

## Prerequisites

| Tool | Version |
| --- | --- |
| Python | 3.10 or newer |
| Node.js | 18 or newer |
| npm | Included with Node.js |
| PostgreSQL | 12 or newer |

The model files should exist at:

```text
models/
  best_bandgap_model.pt
  tokenizer/
```

## Database Setup

Before running the app, set up PostgreSQL and Prisma:

```bash
# 1. Create .env.local with your database URL
cp .env.example .env.local

# 2. Update DATABASE_URL in .env.local
# DATABASE_URL="postgresql://user:password@localhost:5432/bandgap_ml"

# 3. Install dependencies
npm install

# 4. Run Prisma migrations
npx prisma migrate dev

# 5. (Optional) View database in browser
npx prisma studio
```

For detailed setup instructions, see [DATABASE_SETUP.md](DATABASE_SETUP.md)

## Environment Variables

Create or update `.env.local` in the project root:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/bandgap_ml

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-random-string-here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth (optional, for future use)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

For Google OAuth, add this redirect URI in Google Cloud Console:

```text
http://localhost:3000/api/auth/callback/google
```

Optional backend variables:

| Variable | Default | Description |
| --- | --- | --- |
| `MODEL_PATH` | `models/best_bandgap_model.pt` | Path to model weights |
| `TOKENIZER_DIR` | `models/tokenizer` | Path to tokenizer directory |
| `MODEL_DEVICE` | auto | Force `cpu`, `cuda`, etc. |
| `LOG_LEVEL` | `INFO` | Backend logging level |
| `CORS_ORIGINS` | set by `start-app.bat` | Allowed frontend origins |

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
- **Integration:** JSON API with frontend


## Manual Backend Start

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
$env:CORS_ORIGINS="http://localhost:3000,http://127.0.0.1:3000"
python -m uvicorn server.app:app --host 127.0.0.1 --port 8000
```

Health check:

```powershell
curl http://127.0.0.1:8000/health
```

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
