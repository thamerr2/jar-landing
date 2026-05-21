# Jar — Property Management Platform: Design Spec
**Date:** 2026-05-21  
**Status:** Approved  
**Author:** Brainstorming session with Claude

---

## 1. Overview

Jar is a Saudi-market property management platform connecting four user types: HOA Managers, Residents, Service Providers, and Property Owners. It combines AI-powered service matching, HyperPay escrow payments (Mada / STC Pay / credit cards), real-time job tracking, and predictive maintenance in a single bilingual (Arabic RTL + English) web app.

**Tech stack:**
- Frontend: React 18 + TypeScript + Vite + TailwindCSS + shadcn/ui (Radix UI) — fresh project at `/Users/thameraljohani/Desktop/NewJar/`
- Backend: Node.js Express + Drizzle ORM + PostgreSQL (NeonDB) — reused from `/Users/thameraljohani/Desktop/Jar/backend/`
- i18n: i18next + react-i18next (Arabic RTL + English)
- State: TanStack Query v5
- Design: Glassmorphism — dark `#0D1F1A` base, mint `#7FD4A0` accent, frosted glass cards

---

## 2. Architecture

### 2.1 Frontend Structure

```
src/
├── components/          # Shared UI components (shadcn/ui wrappers)
├── lib/
│   ├── ai-matching.ts   # Rule-based provider scoring engine
│   └── hyperpay.ts      # HyperPay checkout helpers
├── pages/
│   ├── Landing.tsx      # Marketing + auth (combined scrollable page)
│   ├── hoa/             # HOA Manager portal (lazy-loaded)
│   ├── resident/        # Resident portal (lazy-loaded)
│   ├── provider/        # Service Provider portal (lazy-loaded)
│   └── owner/           # Property Owner portal (lazy-loaded)
├── i18n/
│   ├── ar.json
│   └── en.json
└── hooks/               # Shared hooks (useAuth, useStickyScroll, etc.)
```

### 2.2 Role-Based Routing

| Role | Path prefix | Portal |
|------|-------------|--------|
| `union_admin` | `/hoa/*` | HOA Manager |
| `tenant` | `/resident/*` | Resident |
| `contractor` | `/provider/*` | Service Provider |
| `owner` | `/owner/*` | Property Owner |

Each portal is a React lazy-loaded chunk — split at build time, loaded on first navigation.

### 2.3 Backend API (Reused from Jar)

Existing routes at `/api/*`:
- `/api/auth` — login, register, JWT
- `/api/properties` — CRUD
- `/api/units` — CRUD
- `/api/maintenance-requests` — full lifecycle (submitted → assigned → in_progress → completed → under_review → closed)
- `/api/contractors` — provider directory
- `/api/quotes` — quote management
- `/api/payments` — payment records
- `/api/ratings` — post-job ratings

**New additions needed:**
- `/api/hyperpay/checkout` — initiate HyperPay session
- `/api/hyperpay/webhook` — payment result webhook
- `/api/ai-match` — (optional server-side) provider matching endpoint

### 2.4 Database Schema (Reused from Jar)

Core tables: `users`, `properties`, `units`, `leases`, `contractors`, `maintenanceRequests`, `quotes`, `payments`, `ratings`

User roles enum: `super_admin | owner | tenant | contractor | union_admin`

Payment currency: SAR. Existing Stripe columns repurposed/replaced for HyperPay checkout IDs.

---

## 3. Landing Page

Matches existing Jar landing page design exactly:

- **Background:** `#0D1F1A` (dark forest green)
- **Brand colors:** Mint `#7FD4A0`, Teal `#0D9488`, Text `#F8FAFC`, Muted `#94A3B8`
- **Font:** `'DM Sans', 'IBM Plex Sans Arabic', 'Cairo', sans-serif`
- **Animation:** `AntiGravityCanvas` — 80 particles with mint/teal/purple palette
- **Hero:** Sticky scroll (300vh) with `MockDashboard` glassmorphism card revealing on scroll
- **Sections:** Sticky hero → Features (4 glassmorphism cards) → Contact form → Footer
- **Auth:** Login/Register modals accessible from the floating navbar (not a separate page)

---

## 4. AI Provider Matching

Rule-based scoring engine in `src/lib/ai-matching.ts`:

```
score = 
  (categoryMatch ? 40 : 0)
  + locationProximityScore(0–30)
  + ratingScore(0–20)        // rating / 5 * 20
  + costScore(0–10)          // cheaper = higher score
```

Returns top 3 providers sorted by score. Displayed to HOA Manager as "AI Recommended" cards before manual assignment. No external ML API — fully deterministic and auditable.

---

## 5. HyperPay Payments

Saudi-market payment gateway. Supports: **Mada**, **STC Pay**, **Visa/Mastercard**.

Flow:
1. Resident or HOA triggers payment → backend calls HyperPay `/v1/checkouts` → returns `checkoutId`
2. Frontend renders HyperPay hosted payment form (JS widget)
3. HyperPay webhooks payment result → backend updates `payments` table
4. Escrow hold: funds held until HOA marks job `completed`
5. Provider payout: triggered when job moves to `closed`

Backend: `src/lib/hyperpay.ts` handles API calls, webhook signature verification.

---

## 6. The Four Portals

### 6.1 HOA Manager Portal (`/hoa/*`)

**MVP screens:**
- Dashboard — KPI cards (open requests, pending payments, active providers), activity feed
- AI Match Dispatch — request card + top 3 provider recommendations with scores
- Request Tracking Board — Kanban-style (submitted / assigned / in_progress / completed)
- Announcements — post to all residents or specific units
- Financial Overview — payment history, pending escrow

**Phase 2:** Facility booking management, voting/polls, document library

### 6.2 Resident Portal (`/resident/*`)

**MVP screens:**
- Home — active request status, announcements, quick actions
- New Request — category picker, description, photo upload, unit auto-filled
- Request Detail — real-time status timeline, provider info, live tracking link
- Payments — HyperPay checkout (Mada / STC Pay), receipt history
- Notifications — push + in-app

**Phase 2:** Amenity booking, neighbor directory (opt-in), community noticeboard

### 6.3 Service Provider Portal (`/provider/*`)

**MVP screens:**
- Job Queue — AI-matched incoming jobs, accept/decline, SLA timer
- Active Job — step-by-step status updates, photo evidence upload, completion submit
- Earnings — completed jobs, pending payout, payment release status
- Profile — skills, certifications, coverage area, ratings

**Phase 2:** Team/subcontractor management, scheduling calendar, route optimization

### 6.4 Property Owner Portal (`/owner/*`)

**MVP screens:**
- Multi-Property Overview — all properties + units on one dashboard
- Property Detail — units list, lease status, occupancy rate
- Financial Summary — rent collected, maintenance costs, net yield per property
- Maintenance History — all requests per property, cost breakdown
- Reports — monthly PDF export

**Phase 2:** Owner-initiated maintenance requests, owner-to-tenant messaging, lease renewal workflow

---

## 7. Bilingual / RTL

- `i18next` + `react-i18next` with `ar.json` and `en.json`
- Language toggle in navbar → saves to localStorage
- Arabic: `dir="rtl"` on `<html>`, font switches to `'IBM Plex Sans Arabic', 'Cairo'`
- TailwindCSS `rtl:` variants for layout mirroring

---

## 8. Build Order

1. **Shell** — Vite project setup, TailwindCSS, shadcn/ui, i18next, React Router, TanStack Query, auth context
2. **Landing page** — replicate Jar landing (particles, sticky scroll, MockDashboard, auth modals)
3. **HOA Manager portal** — highest complexity, establishes patterns for other portals
4. **Resident portal** — request submission + HyperPay payment flow
5. **Service Provider portal** — job queue + active job management
6. **Owner portal** — read-heavy, multi-property views
7. **HyperPay integration** — new backend `src/lib/hyperpay.ts` + checkout/webhook routes
8. **AI matching engine** — `src/lib/ai-matching.ts` wired into HOA dispatch screen

---

## 9. Out of Scope (v1)

- Native mobile apps (web only, mobile-responsive)
- External ML/AI APIs (rule-based matching is sufficient for v1)
- Multi-language beyond Arabic + English
- Complex lease management / rent collection (separate future module)
- Push notifications via FCM (in-app notifications only for v1)
