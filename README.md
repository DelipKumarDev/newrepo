# Logistics ERP — Multi-tenant SaaS (Demo)

[![e2e tests](https://github.com/DelipKumarDev/newrepo/actions/workflows/e2e.yml/badge.svg)](https://github.com/DelipKumarDev/newrepo/actions/workflows/e2e.yml) [![coverage](https://github.com/DelipKumarDev/newrepo/actions/workflows/coverage.yml/badge.svg)](https://github.com/DelipKumarDev/newrepo/actions/workflows/coverage.yml)

Production-ready, multi-tenant Logistics ERP (backend + admin dashboard + mobile app) — starter implementation using free-tier services.

## Features
- NestJS backend (multi-tenant aware)
- React + Vite + Tailwind admin dashboard (skeleton)
- React Native + Expo mobile app (skeleton)
- AI ETA prediction (simple heuristic)
- JWT auth with refresh tokens
- Tenant isolation via middleware + request context
- Swagger docs: `/api/docs`
- Dockerized + `docker-compose`
- CI (GitHub Actions) with optional Render deploy

---

## Quick start (local)
1. Copy `.env.example` to `.env` and set `MONGO_URI` (use MongoDB Atlas free tier or local Mongo)
2. Install & run backend
   - cd backend
   - npm install
   - npm run start:dev
3. API docs: http://localhost:3001/api/docs

Default admin credentials (development):
- email: admin@example.com
- password: Admin@1234

---

## MongoDB Atlas (free tier)
1. Create a free cluster at https://cloud.mongodb.com/
2. Create a database user and whitelist your IP (or allow access from anywhere for dev)
3. Copy connection string into `MONGO_URI` in `.env`

---

## Docker
- Start services: `docker compose up --build`
- Backend: http://localhost:3001
- Frontend (admin): http://localhost:5173

---

## Deploy to Render (free tier)
1. Create a new Web Service on Render and connect your GitHub repo
2. Add `MONGO_URI`, `JWT_SECRET`, `REFRESH_SECRET` to Render environment
3. (Optional) Add `RENDER_API_KEY` and `RENDER_SERVICE_ID` to GitHub secrets to enable workflow-triggered deploys

---

## Mobile app (Expo)
- See `mobile-app/` — run with `expo start` (Expo free tier)

---

## Environment variables (.env.example)
- MONGO_URI
- JWT_SECRET
- REFRESH_SECRET
- PORT
- NODE_ENV
- CORS_ORIGIN

---

## Tests
- Backend unit tests: `cd backend && npm test`

---

## Notes
- This is a starter platform with core functionality implemented for demo and local development.
- AI module uses historical averages and is intentionally simple (can be replaced by ML models later).
