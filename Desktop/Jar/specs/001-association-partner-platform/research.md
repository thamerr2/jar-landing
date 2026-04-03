# Research: Association Partner Platform

**Date**: 2026-03-30  
**Feature**: 001-association-partner-platform  
**Stack**: Next.js 14+ (App Router) + MongoDB + TypeScript

## Research Tasks & Findings

### R1: Next.js Rendering Strategy

**Decision**: Static Site Generation (SSG) for public pages, Server Components + API routes for dynamic content  
**Rationale**: Public pages (landing, partner directory listing) can be statically generated at build time for fast load times and CDN caching. Dashboard pages use React Server Components to fetch data server-side on request. API routes handle all CRUD mutations. This balances performance with dynamic functionality.  
**Alternatives considered**:
- Full SSR for all pages — Unnecessary server load for static content like landing pages.
- Full static export (`output: 'export'`) — Incompatible with API routes and server components; would require external API server.
- Client-side only (SPA) — Poor SEO for public pages; slower initial load.

### R2: MongoDB ODM Choice

**Decision**: Mongoose 8.x  
**Rationale**: Mongoose provides schema definition with built-in validation, middleware hooks (pre/post save for audit trails), populate for references, and TypeScript support. Well-documented, widely adopted, and stable. Supports MongoDB Atlas and local installations.  
**Alternatives considered**:
- Prisma with MongoDB — Good TypeScript integration but MongoDB support is less mature than PostgreSQL support; limited aggregation pipeline access.
- Native MongoDB driver — Maximum flexibility but requires manual schema validation, relationship management, and type definitions for 9 entity types.
- Drizzle ORM — No MongoDB support.

### R3: Authentication Solution

**Decision**: NextAuth.js (Auth.js) v5 with Credentials provider  
**Rationale**: NextAuth integrates natively with Next.js App Router. Credentials provider supports email/password login stored in MongoDB. Handles secure session management (JWT or database sessions), CSRF protection, and middleware-based route protection. Can easily add OAuth providers (Google, Microsoft) in v2 without architecture changes.  
**Alternatives considered**:
- Custom JWT implementation — Higher security risk; must handle token rotation, CSRF, secure cookies manually.
- Clerk/Auth0 — Third-party dependency with usage costs; adds vendor lock-in for a core feature.
- Firebase Auth — Ties to Google ecosystem; adds complexity vs. self-managed auth.

### R4: Input Validation

**Decision**: Zod for schema validation on both API routes and client forms  
**Rationale**: Zod provides TypeScript-first schema definitions that can be shared between client and server. Integrates with React Hook Form for client-side validation. Generates TypeScript types from schemas, ensuring API request/response contracts are type-safe. ~12 KB gzipped.  
**Alternatives considered**:
- Yup — Older API design; less TypeScript-native.
- Joi — Node.js only; doesn't work client-side.
- Manual validation — Inconsistent across 15+ API routes; error-prone.

### R5: Analytics Visualization

**Decision**: Chart.js v4 + react-chartjs-2  
**Rationale**: Chart.js provides line, bar, doughnut, and radar charts needed for spending trends, service frequency, partner performance, and rating distributions. react-chartjs-2 wraps it as React components. ~60 KB gzipped total. Responsive and accessible by default (ARIA labels, keyboard navigation).  
**Alternatives considered**:
- Recharts — React-native but larger bundle; less chart type variety.
- D3.js — Far more powerful than needed; steep learning curve; much larger payload.
- Tremor — Attractive but adds Tailwind dependency.

### R6: CSV/PDF Export

**Decision**: Client-side CSV via Blob API; PDF via server-side generation with `@react-pdf/renderer` or `jspdf`  
**Rationale**: CSV can be generated client-side from table data with zero dependencies. PDF generation for formal billing reports uses `jspdf` with `jspdf-autotable` for clean tabular output, called from an API route. Both formats include all active filter criteria.  
**Alternatives considered**:
- Browser print stylesheet only — Insufficient for branded PDF reports with headers/footers.
- Puppeteer server-side rendering — Heavy dependency; overkill for tabular reports.

### R7: Predictive Maintenance Logic

**Decision**: Rule-based heuristic service running on API route, triggered on schedule or on-demand  
**Rationale**: For each association, analyze service request history by category. Calculate average interval between recurring services. If current date approaches the predicted next window (±20%), generate a PredictiveAlert document in MongoDB. Confidence levels: "high" (>5 historical data points), "medium" (3–5), "low" (<3, no prediction generated). This can run as a cron-triggered API route or on-demand when user views analytics dashboard.  
**Alternatives considered**:
- TensorFlow.js — Massive dependency; insufficient training data at launch; overkill for interval prediction.
- Pre-seeded static predictions — Wouldn't adapt to real user data.
- External ML service — Adds infrastructure complexity and cost prematurely.

### R8: Notification System

**Decision**: MongoDB-backed in-app notifications + email via Resend API  
**Rationale**: Notifications stored in MongoDB with userId, type, read status. In-app: NotificationBell component polls or uses Server-Sent Events for real-time updates. Email: Resend API (or SendGrid) for transactional emails triggered from server-side services. Email sending is optional config — app works without it.  
**Alternatives considered**:
- WebSockets — Over-engineered for notification updates; adds persistent connection management.
- Firebase Cloud Messaging — Mobile push focus; vendor lock-in.
- No email — Would miss a key spec requirement (FR-016); Resend has a generous free tier.

### R9: Design System

**Decision**: Custom CSS design system with CSS custom properties (no Tailwind, per constitution)  
**Rationale**: CSS custom properties (variables) define design tokens for colors, spacing, typography, shadows, and border radii. Mobile-first responsive design with breakpoints at 320px, 768px, 1024px, 1440px. Dark mode default with light mode toggle. Google Fonts (Inter for body, Outfit for headings) loaded via `next/font`. Glassmorphism accents and subtle micro-animations for premium feel.  
**Alternatives considered**:
- Tailwind CSS — Constitution specifies vanilla CSS; would add build complexity.
- CSS Modules — Possible but fragments the design system; harder to maintain consistency.
- Styled Components — Runtime CSS-in-JS adds bundle weight and performance overhead.

### R10: MongoDB Connection Management

**Decision**: Singleton connection pattern with connection caching in development  
**Rationale**: In production, Mongoose connects once and reuses. In development with Next.js hot reload, a cached global connection prevents creating new connections on each reload. Standard pattern: `lib/db.ts` exports a `connectDB()` function that caches the connection promise.  
**Alternatives considered**:
- Connection per request — Would exhaust connection pool rapidly.
- Connection pool via separate service — Over-engineered for a single-app deployment.

## All NEEDS CLARIFICATION: Resolved

No unresolved technical unknowns remain. All decisions align with Constitution v2.0.0 (Next.js + MongoDB).
