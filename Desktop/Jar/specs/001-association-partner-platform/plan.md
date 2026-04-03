# Implementation Plan: Association Partner Platform

**Branch**: `001-association-partner-platform` | **Date**: 2026-03-30 | **Spec**: [spec.md](file:///Users/thameraljohani/Jar/specs/001-association-partner-platform/spec.md)
**Input**: Feature specification from `/specs/001-association-partner-platform/spec.md`

## Summary

Build a full-stack web application using Next.js (static site generation) and MongoDB that serves as the Association Partner Platform — a marketplace connecting owners'/residents' associations with accredited field partners. The app covers all five user stories (service requests, billing, quality assurance, AI analytics, partner management) with persistent server-side data, real authentication, and a responsive mobile-ready design.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18+, Node.js 20+  
**Framework**: Next.js 14+ (App Router, static site generation where possible, API routes for server operations)  
**Primary Dependencies**: next, react, mongoose (MongoDB ODM), next-auth (authentication), chart.js + react-chartjs-2 (analytics), bcryptjs (password hashing), zod (validation)  
**Database**: MongoDB (Atlas or local) via Mongoose  
**Testing**: Jest + React Testing Library (unit/component), Playwright (E2E)  
**Target Platform**: Modern web browsers (desktop + mobile), deployed to Vercel/Netlify or self-hosted Node.js  
**Project Type**: Full-stack web application (Next.js)  
**Performance Goals**: < 2s initial page load; < 200ms API response time; fully responsive down to 320px width  
**Constraints**: Secrets in environment variables only; API routes validate auth + input; mobile-first responsive design  
**Scale/Scope**: Production-ready for up to 500 concurrent users, 1000+ associations, 5000+ partners

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Constitution Principle | Status | Notes |
|---|---|---|
| I. Static-First with Server Functions | ✅ PASS | Next.js SSG for public pages (landing, partner directory). API routes for CRUD/auth operations. No SSR unless justified. |
| II. Managed Dependencies | ✅ PASS | Each dependency justified: mongoose (MongoDB), next-auth (auth), chart.js (analytics), zod (validation), bcryptjs (security). No redundancy. |
| III. Responsive Design | ✅ PASS | Mobile-first CSS, flexbox/grid layouts, responsive breakpoints at 320px, 768px, 1024px, 1440px. |
| IV. Accessibility | ✅ PASS | WCAG 2.1 AA target. Semantic HTML, ARIA labels, keyboard nav, screen reader support. |
| V. Core Performance | ✅ PASS | SSG for cacheable pages, Next.js Image optimization, route-based code splitting. |
| Framework Constraint | ✅ PASS | Next.js with API routes for MongoDB operations. |
| Database Constraint | ✅ PASS | MongoDB via Mongoose ODM. |
| Security | ✅ PASS | Env vars for secrets, next-auth for sessions, API route auth middleware, input validation with zod. |

## Project Structure

### Documentation (this feature)

```text
specs/001-association-partner-platform/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API contracts)
│   ├── auth.md
│   ├── service-requests.md
│   ├── invoices.md
│   ├── reviews.md
│   ├── partners.md
│   └── analytics.md
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx                  # Root layout (nav, providers, fonts)
│   ├── page.tsx                    # Landing / login page
│   ├── globals.css                 # Design system tokens, global styles
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login page
│   │   └── register/page.tsx       # Registration (manager + partner)
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Authenticated layout (sidebar nav)
│   │   ├── dashboard/page.tsx      # Manager main dashboard
│   │   ├── partners/
│   │   │   ├── page.tsx            # Partner directory (search/filter)
│   │   │   └── [id]/page.tsx       # Partner profile detail
│   │   ├── requests/
│   │   │   ├── page.tsx            # Service requests list
│   │   │   ├── new/page.tsx        # New request form
│   │   │   └── [id]/page.tsx       # Request detail + lifecycle
│   │   ├── billing/
│   │   │   ├── page.tsx            # Billing dashboard
│   │   │   └── [id]/page.tsx       # Invoice detail
│   │   ├── reviews/
│   │   │   ├── page.tsx            # Reviews list
│   │   │   └── new/[requestId]/page.tsx  # Submit review form
│   │   ├── analytics/page.tsx      # Analytics + predictive maintenance
│   │   ├── notifications/page.tsx  # Notification center
│   │   └── profile/page.tsx        # User/org profile settings
│   ├── (partner)/
│   │   ├── layout.tsx              # Partner-specific layout
│   │   ├── partner-dashboard/page.tsx  # Partner main dashboard
│   │   ├── requests/page.tsx       # Incoming requests
│   │   ├── invoices/
│   │   │   ├── page.tsx            # Partner's invoices
│   │   │   └── new/[requestId]/page.tsx  # Create invoice
│   │   └── profile/page.tsx        # Partner profile management
│   ├── (admin)/
│   │   ├── layout.tsx              # Admin layout
│   │   ├── admin/page.tsx          # Admin dashboard
│   │   ├── accreditation/page.tsx  # Partner accreditation queue
│   │   └── disputes/page.tsx       # Dispute resolution panel
│   └── api/
│       ├── auth/[...nextauth]/route.ts  # NextAuth API
│       ├── associations/route.ts        # Association CRUD
│       ├── partners/route.ts            # Partner CRUD + search
│       ├── requests/route.ts            # Service request CRUD
│       ├── requests/[id]/route.ts       # Single request operations
│       ├── invoices/route.ts            # Invoice CRUD
│       ├── invoices/[id]/route.ts       # Single invoice operations
│       ├── reviews/route.ts             # Quality review CRUD
│       ├── analytics/route.ts           # Analytics data aggregation
│       ├── analytics/predictions/route.ts  # Predictive maintenance
│       ├── notifications/route.ts       # Notification CRUD
│       ├── disputes/route.ts            # Dispute CRUD
│       └── admin/
│           ├── accreditation/route.ts   # Accreditation management
│           └── users/route.ts           # User management
├── components/
│   ├── ui/                         # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── Table.tsx
│   │   ├── Badge.tsx
│   │   ├── Toast.tsx
│   │   └── Skeleton.tsx            # Loading skeletons
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── MobileNav.tsx           # Mobile hamburger menu
│   │   └── Footer.tsx
│   ├── features/
│   │   ├── PartnerCard.tsx         # Partner directory card
│   │   ├── RequestTimeline.tsx     # Service request lifecycle
│   │   ├── InvoiceTable.tsx        # Billing table component
│   │   ├── ReviewForm.tsx          # Quality rating form
│   │   ├── StarRating.tsx          # Star display component
│   │   ├── AnalyticsChart.tsx      # Chart.js wrapper
│   │   ├── PredictiveAlertCard.tsx # Maintenance alert card
│   │   ├── NotificationBell.tsx    # Nav notification badge
│   │   └── ExportButton.tsx        # CSV/PDF export
│   └── providers/
│       ├── AuthProvider.tsx        # NextAuth session provider
│       ├── ThemeProvider.tsx        # Dark/light mode
│       └── ToastProvider.tsx        # Toast notification context
├── lib/
│   ├── db.ts                       # MongoDB connection singleton
│   ├── auth.ts                     # NextAuth configuration
│   ├── models/                     # Mongoose models
│   │   ├── User.ts
│   │   ├── Association.ts
│   │   ├── FieldPartner.ts
│   │   ├── ServiceRequest.ts
│   │   ├── Invoice.ts
│   │   ├── QualityReview.ts
│   │   ├── PredictiveAlert.ts
│   │   ├── Notification.ts
│   │   └── Dispute.ts
│   ├── validators/                 # Zod schemas
│   │   ├── auth.ts
│   │   ├── request.ts
│   │   ├── invoice.ts
│   │   ├── review.ts
│   │   └── partner.ts
│   ├── services/                   # Business logic
│   │   ├── requestService.ts       # Request lifecycle logic
│   │   ├── billingService.ts       # Invoice + payment logic
│   │   ├── ratingService.ts        # Rating calculation
│   │   ├── predictionService.ts    # Predictive maintenance heuristics
│   │   ├── notificationService.ts  # Notification dispatch
│   │   └── exportService.ts        # CSV/PDF generation
│   ├── middleware/
│   │   ├── auth.ts                 # API auth middleware
│   │   └── validate.ts             # Zod validation middleware
│   └── utils/
│       ├── format.ts               # Date, currency formatters
│       └── constants.ts            # Enums, config constants
├── hooks/                          # Custom React hooks
│   ├── useRequests.ts
│   ├── usePartners.ts
│   ├── useInvoices.ts
│   ├── useNotifications.ts
│   └── useAnalytics.ts
├── styles/
│   └── components.css              # Component-specific styles
└── types/
    └── index.ts                    # Shared TypeScript interfaces

public/
├── icons/                          # SVG icons
├── images/                         # Static images
└── fonts/                          # Web fonts (if self-hosted)

.env.local                          # Environment variables (secrets)
next.config.js                      # Next.js configuration
tailwind.config.ts                  # NOT USED (vanilla CSS per constitution)
```

**Structure Decision**: Next.js App Router with route groups for role-based layouts (`(dashboard)` for managers, `(partner)` for partners, `(admin)` for admins). MongoDB models in `lib/models/`, business logic in `lib/services/`, API routes in `app/api/`. Component library split into `ui/` (generic), `layout/` (structure), and `features/` (domain-specific).

## Complexity Tracking

| Decision | Why Needed | Simpler Alternative Rejected Because |
|----------|------------|--------------------------------------|
| Mongoose ODM | Provides schema validation, middleware hooks, and query building for MongoDB | Raw MongoDB driver would require manual validation and relationship management across 9 entity types |
| NextAuth.js | Handles session management, CSRF protection, secure cookie handling | Custom JWT implementation would be error-prone and miss security edge cases |
| Chart.js | Analytics dashboard requires 4+ chart types with responsive, accessible rendering | Custom SVG/Canvas charts would require 1000+ lines for inferior results |
| Zod validation | Type-safe request validation across 15+ API routes | Manual validation would be inconsistent and miss edge cases |
