# VLSI Attendance Management System

Full-stack rebuild of the VLSI department attendance/labs/projects/placements
dashboard. Two deployables in this repo:

- `backend/` — Node.js + Express REST API, PostgreSQL via Prisma, JWT auth with
  refresh-token cookie rotation, role-based access control (RBAC).
- `frontend/` — Vite + React SPA (ported from the original mockup), talks to
  the API over `fetch`.

## Architecture

```
frontend (Vercel)  --->  backend (Render)  --->  PostgreSQL (Render/Neon/Supabase)
   Vite + React          Express + Prisma
```

Roles: `STUDENT`, `FACULTY`, `HOD`, `LAB`, `ADMIN`, `PARENT`. Every API route
is gated by JWT + role middleware (`backend/src/middleware/auth.js`).

## Local setup

### 1. Database

Create a free Postgres instance (Render, Neon, or Supabase all work) and
grab its connection string.

### 2. Backend

```bash
cd backend
cp .env.example .env     # fill in DATABASE_URL and a random JWT_SECRET
npm install
npx prisma migrate dev --name init
npm run seed              # creates demo accounts + sample data
npm run dev                # http://localhost:4000
```

Demo accounts (password printed by the seed script, default `Passw0rd!`):

| Role | Email |
|---|---|
| Student | student@vlsi.ac.in |
| Faculty | faculty@vlsi.ac.in |
| HOD | hod@vlsi.ac.in |
| Lab Instructor | lab@vlsi.ac.in |
| Department Admin | admin@vlsi.ac.in |
| Parent | parent@vlsi.ac.in |

### 3. Frontend

```bash
cd frontend
cp .env.example .env     # VITE_API_URL=http://localhost:4000/api
npm install
npm run dev                # http://localhost:5173
```

Login screen has demo-account buttons that pre-fill the credentials above.

## Deploying

### Backend → Render

1. Push this repo to GitHub (see below).
2. On Render: **New → Web Service**, connect the repo, set root directory to
   `backend`.
3. Build command: `npm install`. Start command: `npm run start`.
4. Add a Render PostgreSQL instance (or external one) and set environment
   variables: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN` (your Vercel URL,
   e.g. `https://vlsi-ams.vercel.app`), `SEED_DEFAULT_PASSWORD`.
5. After first deploy, run migrations + seed once via Render's shell:
   ```bash
   npx prisma migrate deploy
   npm run seed
   ```

### Frontend → Vercel

1. On Vercel: **New Project**, import the same repo, set root directory to
   `frontend`.
2. Framework preset: Vite. Build command: `npm run build`. Output dir: `dist`.
3. Set env var `VITE_API_URL` to your Render backend URL + `/api`
   (e.g. `https://vlsi-ams-backend.onrender.com/api`).
4. Deploy. Update the backend's `CORS_ORIGIN` to match the resulting Vercel
   URL once it's known, and redeploy the backend.

## Pushing to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## Notes

- The historical multi-year placement trend chart is illustrative until the
  `Placement` table accumulates more than one admission cycle — the rest of
  the Placement Analytics screen (recent placements, top recruiters) is fully
  live from the database.
- Auth uses a short-lived JWT access token (kept in memory on the client) plus
  an httpOnly refresh-token cookie rotated on `/api/auth/refresh`.
- `npx prisma studio` (run inside `backend/`) is the fastest way to inspect or
  hand-edit seeded data during development.
