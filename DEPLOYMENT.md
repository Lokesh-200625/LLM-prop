# Deployment Guide

This project is split into three parts:

- Frontend: Next.js on Vercel
- Backend: FastAPI worker on Render
- Model artifacts: Hugging Face Hub

## 1. Hugging Face

Create a public Hugging Face repository that contains the model files used by the worker:

- `bandgapquantized.onnx`
- `tokenizer/`

Use a repo name such as `your-huggingface-username/llm-prop-bandgap`.

The worker can load these files directly from Hugging Face when `BANDGAP_HF_REPO_ID` is set.

## 2. Render backend

Deploy the worker from the `worker/` directory as a Docker web service.

Important environment variables:

- `BANDGAP_HF_REPO_ID` = your Hugging Face repo id
- `BANDGAP_HF_REVISION` = `main`
- `CORS_ORIGINS` = your Vercel app URL, for example `https://your-app.vercel.app`

The worker binds to Render's assigned port automatically through `PORT`.

## 3. Vercel frontend

Deploy the Next.js app from the repository root.

Set these environment variables in Vercel:

- `DATABASE_URL`
- `NEXTAUTH_URL` = your Vercel app URL
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` if you use GitHub login
- `WORKER_API_URL` = your Render worker URL, for example `https://llm-prop-worker.onrender.com`

The frontend prediction route proxies requests to `WORKER_API_URL`, so this must point at Render.

## 4. Local parity

Local development still works the same way:

- `npm run dev`
- `python -m uvicorn worker.app.main:app --host 127.0.0.1 --port 8000`

## Free-tier notes

- Render free services can sleep when idle.
- Vercel free tier is suitable for the frontend.
- Hugging Face Hub is suitable for public model artifacts.
- You still need a PostgreSQL provider for `DATABASE_URL`; the app currently depends on Postgres for auth and prediction history.