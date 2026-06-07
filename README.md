# Dashlytics

Analytics-style dashboard for revenue, users, and orders. Built with Next.js App Router, typed data validation, cached server state, and a polished light/dark UI. Metrics are loaded from **PostgreSQL** (e.g. Neon) via **Prisma ORM 7** and a Next.js Route Handler.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)

## Features

- **Metrics overview** — Revenue (currency), users, and orders with period-over-period deltas.
- **Time ranges** — Switch between 7, 30, and 90 days; selection is persisted in the browser.
- **Revenue chart** — Responsive bar chart with gradients and formatted tooltips ([Recharts](https://recharts.org)).
- **Theming** — Light, dark, or system preference; persisted alongside other UI state.
- **Data safety** — API responses validated at runtime with [Zod](https://zod.dev); TypeScript types inferred from schemas.
- **Server state** — [TanStack Query](https://tanstack.com/query) for caching, loading/error states, and background updates.
- **Database** — Prisma 7 with `@prisma/adapter-pg`; `StatsSnapshot` rows keyed by date range.

## Tech stack

| Area | Libraries |
|------|-----------|
| Framework | Next.js (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Server state | TanStack React Query v5 |
| Client state | Zustand (with `persist` for preferences) |
| Validation | Zod |
| Charts | Recharts |
| Icons | Lucide React |
| ORM | Prisma 7, `pg` driver adapter |
| Database | PostgreSQL |

## Prerequisites

- **Node.js** 20+ (recommended)
- **npm** (ships with Node)
- A **PostgreSQL** database and `DATABASE_URL` (e.g. [Neon](https://neon.tech))

## Getting started

```bash
npm install
```

Create `.env.local` (or `.env`) with:

```bash
DATABASE_URL="postgresql://..."
```

Apply schema and seed demo data:

```bash
npx prisma migrate dev
npx prisma db seed
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | `prisma generate` + production build |
| `npm run start` | Run production server (after `build`) |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Regenerate Prisma Client |
| `npm run db:migrate` | Create/apply migrations (`prisma migrate dev`) |
| `npm run db:seed` | Upsert sample stats for all ranges |

## Project layout

```
app/                 # App Router — layout, page, providers, API routes
  api/stats/         # GET /api/stats?range=7d|30d|90d
components/        # UI — chart, stat cards, header, skeletons, errors
hooks/             # React Query hooks (e.g. useStats)
lib/schemas/       # Zod schemas and inferred types
lib/prisma.ts      # PrismaClient singleton (driver adapter)
prisma/            # schema.prisma, migrations, seed
stores/            # Zustand stores (date range, theme)
```

## Data layer

- **`GET /api/stats?range=…`** reads `StatsSnapshot` from Postgres and returns JSON validated with `statsSchema`.
- **`prisma/seed.ts`** inserts the same demo numbers previously hardcoded in the UI path.

## Deployment

Deploy on [Vercel](https://vercel.com). Set **`DATABASE_URL`** in the project environment to your hosted Postgres (Neon, etc.). Run **`npx prisma migrate deploy`** against production when you ship schema changes.
