# Tasks: Association Partner Platform

**Input**: Design documents from `/specs/001-association-partner-platform/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Not explicitly requested in spec. Test tasks omitted. Add via `/speckit.checklist` if needed.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Next.js project initialization and tooling configuration

- [ ] T001 Initialize Next.js project with TypeScript, ESLint, App Router, src directory using `npx -y create-next-app@latest ./ --typescript --eslint --app --src-dir --import-alias "@/*" --no-tailwind`
- [ ] T002 Install production dependencies: `mongoose next-auth@beta @auth/mongodb-adapter bcryptjs zod chart.js react-chartjs-2 jspdf jspdf-autotable`
- [ ] T003 Install dev dependencies: `@types/bcryptjs`
- [ ] T004 [P] Create `.env.local` with MONGODB_URI, NEXTAUTH_SECRET, NEXTAUTH_URL placeholders
- [ ] T005 [P] Create design system tokens and global styles in `src/app/globals.css` — CSS custom properties for colors (dark mode default), spacing, typography (Inter + Outfit via next/font), shadows, border-radii, and responsive breakpoints (320px, 640px, 768px, 1024px, 1440px)
- [ ] T006 [P] Create component styles in `src/styles/components.css` — reusable card, button, input, badge, table, modal, and toast component styles with hover/focus states and micro-animations
- [ ] T007 Create shared TypeScript type definitions in `src/types/index.ts` — interfaces for User, Association, FieldPartner, ServiceRequest, Invoice, QualityReview, PredictiveAlert, Notification, Dispute, and API response types

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T008 Create MongoDB connection singleton in `src/lib/db.ts` with connection caching for dev hot-reload
- [ ] T009 [P] Create User Mongoose model in `src/lib/models/User.ts` with email/passwordHash/name/phone/role/associationId/partnerId fields, email unique index, and timestamps
- [ ] T010 [P] Create Association Mongoose model in `src/lib/models/Association.ts` with name/registrationNumber/address/primaryContactId/memberCount/subscriptionTier fields, registrationNumber unique index, and text search index on name
- [ ] T011 [P] Create FieldPartner Mongoose model in `src/lib/models/FieldPartner.ts` with businessName/registrationNumber/accreditationStatus/serviceCategories/serviceAreas/certifications/aggregateRating/totalReviews/availability/pricingModel/description/accreditationHistory fields, indexes on registrationNumber, accreditationStatus, serviceCategories, serviceAreas, aggregateRating, and text search
- [ ] T012 Configure NextAuth in `src/lib/auth.ts` with Credentials provider (email/password), MongoDB adapter, JWT session strategy, role-based callbacks, and session timeout (30 min)
- [ ] T013 Create NextAuth API route in `src/app/api/auth/[...nextauth]/route.ts`
- [ ] T014 [P] Create auth registration API route in `src/app/api/auth/register/route.ts` — POST handler accepting email, password, name, phone, role, and optional associationData/partnerData; hash password with bcryptjs; create User + Association/Partner documents; validate with Zod
- [ ] T015 [P] Create Zod validation schemas in `src/lib/validators/auth.ts` — loginSchema, registerSchema (manager + partner variants)
- [ ] T016 [P] Create API auth middleware in `src/lib/middleware/auth.ts` — extract session, verify role, attach user to request context
- [ ] T017 [P] Create Zod validation middleware in `src/lib/middleware/validate.ts` — generic middleware that validates request body against a Zod schema and returns 400 on failure
- [ ] T018 [P] Create utility functions in `src/lib/utils/format.ts` — date formatters, currency formatter (SAR), relative time, number abbreviations
- [ ] T019 [P] Create constants and enums in `src/lib/utils/constants.ts` — urgency levels, request statuses, payment statuses, accreditation statuses, service categories, notification types
- [ ] T020 Create AuthProvider component in `src/components/providers/AuthProvider.tsx` wrapping NextAuth SessionProvider
- [ ] T021 [P] Create ThemeProvider component in `src/components/providers/ThemeProvider.tsx` with dark/light mode toggle persisted to localStorage
- [ ] T022 [P] Create ToastProvider component in `src/components/providers/ToastProvider.tsx` with context for showing success/error/info toasts with auto-dismiss
- [ ] T023 Create root layout in `src/app/layout.tsx` — wrap with AuthProvider, ThemeProvider, ToastProvider; load Inter + Outfit fonts via next/font/google; import globals.css
- [ ] T024 [P] Create base UI components — Button (`src/components/ui/Button.tsx`), Card (`src/components/ui/Card.tsx`), Input (`src/components/ui/Input.tsx`), Select (`src/components/ui/Select.tsx`), Badge (`src/components/ui/Badge.tsx`), Skeleton (`src/components/ui/Skeleton.tsx`) with proper ARIA attributes and keyboard support
- [ ] T025 [P] Create Modal component in `src/components/ui/Modal.tsx` with portal rendering, focus trap, escape-to-close, and backdrop click handling
- [ ] T026 [P] Create Table component in `src/components/ui/Table.tsx` with sortable columns, responsive scroll, and empty state
- [ ] T027 [P] Create Toast component in `src/components/ui/Toast.tsx` with success/error/info variants, slide-in animation, and auto-dismiss
- [ ] T028 Create Navbar component in `src/components/layout/Navbar.tsx` with logo, role-based navigation links, notification bell, user menu dropdown, and dark/light mode toggle
- [ ] T029 [P] Create Sidebar component in `src/components/layout/Sidebar.tsx` with collapsible nav items, active state highlighting, and role-based menu items (manager/partner/admin)
- [ ] T030 [P] Create MobileNav component in `src/components/layout/MobileNav.tsx` with hamburger menu, slide-out drawer, and touch-friendly navigation
- [ ] T031 Create login page in `src/app/(auth)/login/page.tsx` — email/password form, form validation, error display, link to register, responsive layout
- [ ] T032 Create registration page in `src/app/(auth)/register/page.tsx` — multi-step form with role selection (manager/partner), association or partner details, form validation, and submission to /api/auth/register

**Checkpoint**: Foundation ready — authentication works, base UI components available, MongoDB connected, design system applied. User story implementation can begin.

---

## Phase 3: User Story 1 — Submit a Service Request (Priority: P1) 🎯 MVP

**Goal**: Association managers can browse accredited partners, filter by category/location/rating, and submit service requests with full lifecycle tracking.

**Independent Test**: Log in as a manager → search partners → select one → fill request form → submit → verify partner receives notification → partner accepts/declines.

### Implementation for User Story 1

- [ ] T033 [P] [US1] Create ServiceRequest Mongoose model in `src/lib/models/ServiceRequest.ts` with all fields per data-model, auto-incrementing requestNumber (SR-XXXXX), status enum, statusHistory array, and indexes on associationId+status, partnerId+status, serviceCategory, createdAt
- [ ] T034 [P] [US1] Create Notification Mongoose model in `src/lib/models/Notification.ts` with userId/type/title/message/referenceType/referenceId/isRead fields, compound index on userId+isRead+createdAt, and 90-day TTL index
- [ ] T035 [P] [US1] Create Zod validation schemas in `src/lib/validators/request.ts` — createRequestSchema, updateRequestStatusSchema, partnerResponseSchema
- [ ] T036 [P] [US1] Create Zod validation schema in `src/lib/validators/partner.ts` — partnerSearchSchema (query params), updatePartnerSchema
- [ ] T037 [US1] Create notificationService in `src/lib/services/notificationService.ts` — createNotification(), getUnreadCount(), markAsRead(), markAllAsRead(), getUserNotifications() with pagination
- [ ] T038 [US1] Create requestService in `src/lib/services/requestService.ts` — createRequest() (validates partner is approved, generates requestNumber, creates statusHistory entry, triggers notification), updateStatus() (validates state transition, appends statusHistory), getRequestsForAssociation(), getRequestsForPartner(), getRequestById()
- [ ] T039 [US1] Create partner search/filter API route in `src/app/api/partners/route.ts` — GET handler with text search, category/area/availability/minRating filters, pagination, faceted counts; only returns approved partners for non-admin roles
- [ ] T040 [US1] Create partner detail API route in `src/app/api/partners/[id]/route.ts` — GET handler returning partner profile with recent reviews; PATCH for profile updates (partner or admin only)
- [ ] T041 [US1] Create service request API routes in `src/app/api/requests/route.ts` — GET (role-based filtered list with pagination) and POST (manager-only creation with validation, partner notification)
- [ ] T042 [US1] Create service request detail API route in `src/app/api/requests/[id]/route.ts` — GET (populated details) and PATCH (status updates, partner responses with state transition validation)
- [ ] T043 [US1] Create notification API routes in `src/app/api/notifications/route.ts` — GET (user's notifications paginated), PATCH (mark read), POST /mark-all-read
- [ ] T044 [P] [US1] Create usePartners hook in `src/hooks/usePartners.ts` — fetch partners with search/filter state, pagination, loading/error handling
- [ ] T045 [P] [US1] Create useRequests hook in `src/hooks/useRequests.ts` — fetch requests with status filter, pagination, create/update mutations
- [ ] T046 [P] [US1] Create useNotifications hook in `src/hooks/useNotifications.ts` — fetch notifications, unread count, mark as read, polling for new notifications
- [ ] T047 [P] [US1] Create PartnerCard component in `src/components/features/PartnerCard.tsx` — partner name, rating stars, categories as badges, availability indicator, service areas, pricing model, link to profile
- [ ] T048 [P] [US1] Create StarRating component in `src/components/features/StarRating.tsx` — display 1-5 filled/half/empty stars with rating number and review count
- [ ] T049 [P] [US1] Create RequestTimeline component in `src/components/features/RequestTimeline.tsx` — vertical timeline showing status changes with dates, notes, and actor names
- [ ] T050 [P] [US1] Create NotificationBell component in `src/components/features/NotificationBell.tsx` — bell icon with unread count badge, dropdown showing recent notifications, click to mark read
- [ ] T051 [US1] Create authenticated dashboard layout in `src/app/(dashboard)/layout.tsx` — sidebar + navbar + main content area, responsive (sidebar collapses to mobile nav on small screens)
- [ ] T052 [US1] Create manager dashboard page in `src/app/(dashboard)/dashboard/page.tsx` — summary cards (active requests, pending invoices, unread notifications), recent requests list, quick action buttons
- [ ] T053 [US1] Create partner directory page in `src/app/(dashboard)/partners/page.tsx` — search bar, category/area/rating filters, partner cards grid, pagination, responsive layout (1 col mobile → 3 col desktop)
- [ ] T054 [US1] Create partner profile page in `src/app/(dashboard)/partners/[id]/page.tsx` — full partner details, service categories, certifications, rating breakdown, recent reviews, "Request Service" CTA button
- [ ] T055 [US1] Create new service request page in `src/app/(dashboard)/requests/new/page.tsx` — multi-step form: select partner (pre-filled if from partner profile), description, location, category, urgency, schedule; form validation; submission with loading state
- [ ] T056 [US1] Create service requests list page in `src/app/(dashboard)/requests/page.tsx` — table/card view with status filter tabs, search, pagination, status badges, click to detail
- [ ] T057 [US1] Create service request detail page in `src/app/(dashboard)/requests/[id]/page.tsx` — request info, partner response, status timeline, action buttons (cancel, mark complete), status-dependent UI
- [ ] T058 [US1] Create partner dashboard layout in `src/app/(partner)/layout.tsx` — partner-specific sidebar navigation
- [ ] T059 [US1] Create partner dashboard page in `src/app/(partner)/partner-dashboard/page.tsx` — incoming requests summary, recent activity, rating overview
- [ ] T060 [US1] Create partner incoming requests page in `src/app/(partner)/requests/page.tsx` — list of requests assigned to partner with accept/decline/counter actions

**Checkpoint**: User Story 1 complete — managers can browse partners, submit requests, and track lifecycle. Partners can view and respond to requests. Notifications work. ✅

---

## Phase 4: User Story 2 — Manage Bills and Oversee Payments (Priority: P2)

**Goal**: Partners can generate invoices for completed services. Managers can view, approve, and track all bills with filtering and export.

**Independent Test**: Complete a service request → partner creates invoice → manager views billing dashboard → approves payment → exports report.

### Implementation for User Story 2

- [ ] T061 [P] [US2] Create Invoice Mongoose model in `src/lib/models/Invoice.ts` with all fields per data-model, auto-incrementing invoiceNumber (INV-XXXXX), lineItems subdocument array with calculated totalAmount, indexes on invoiceNumber, associationId+paymentStatus, partnerId, dueDate
- [ ] T062 [P] [US2] Create Zod validation schemas in `src/lib/validators/invoice.ts` — createInvoiceSchema (lineItems array, dueDate), updateInvoiceStatusSchema
- [ ] T063 [US2] Create billingService in `src/lib/services/billingService.ts` — createInvoice() (validates request is completed, calculates total, triggers notification), updatePaymentStatus() (validates transitions, triggers notifications), getInvoicesForAssociation(), getInvoicesForPartner(), getBillingSummary() (aggregate pending/paid/overdue totals)
- [ ] T064 [US2] Create exportService in `src/lib/services/exportService.ts` — generateCSV() (from invoice data with filters), generatePDF() (using jspdf + jspdf-autotable for formatted invoice/report)
- [ ] T065 [US2] Create invoice API routes in `src/app/api/invoices/route.ts` — GET (role-filtered list with pagination, status/date/partner filters, summary aggregation) and POST (partner-only creation with validation)
- [ ] T066 [US2] Create invoice detail API route in `src/app/api/invoices/[id]/route.ts` — GET (full invoice with populated references) and PATCH (status updates: approve, mark paid)
- [ ] T067 [US2] Create invoice export API route in `src/app/api/invoices/[id]/export/route.ts` — GET with format=csv|pdf query param, returns file download
- [ ] T068 [P] [US2] Create useInvoices hook in `src/hooks/useInvoices.ts` — fetch invoices with filters, pagination, summary stats, create/update mutations
- [ ] T069 [P] [US2] Create InvoiceTable component in `src/components/features/InvoiceTable.tsx` — sortable table with invoice number, partner name, amount, due date, status badge, action buttons
- [ ] T070 [P] [US2] Create ExportButton component in `src/components/features/ExportButton.tsx` — dropdown for CSV/PDF export with current filter context
- [ ] T071 [US2] Create billing dashboard page in `src/app/(dashboard)/billing/page.tsx` — summary cards (pending/paid/overdue totals), filter bar (status, date range, partner, category), invoice table, export button, responsive layout
- [ ] T072 [US2] Create invoice detail page in `src/app/(dashboard)/billing/[id]/page.tsx` — full invoice with line items table, payment status timeline, approve/dispute action buttons, PDF download
- [ ] T073 [US2] Create partner invoice management page in `src/app/(partner)/invoices/page.tsx` — partner's submitted invoices list with status tracking
- [ ] T074 [US2] Create partner invoice creation page in `src/app/(partner)/invoices/new/[requestId]/page.tsx` — form to create invoice for a completed request: add/remove line items, set due date, preview total, submit

**Checkpoint**: User Story 2 complete — full billing workflow functional. Managers can view, approve, filter, and export invoices. Partners can create and track invoices. ✅

---

## Phase 5: User Story 3 — Quality Assurance and Service Ratings (Priority: P3)

**Goal**: Managers can rate completed services on structured criteria. Ratings update partner aggregate scores. Low-rated partners are flagged.

**Independent Test**: Complete a service → manager submits quality review → partner's aggregate rating updates → partner responds to review → low-rating triggers admin alert.

### Implementation for User Story 3

- [ ] T075 [P] [US3] Create QualityReview Mongoose model in `src/lib/models/QualityReview.ts` with ratings subdocument (timeliness/quality/communication/value), calculated overallScore, unique index on serviceRequestId, post-save middleware to recalculate partner aggregateRating and totalReviews
- [ ] T076 [P] [US3] Create Zod validation schemas in `src/lib/validators/review.ts` — createReviewSchema (ratings 1-5 per criterion, comments), partnerResponseSchema
- [ ] T077 [US3] Create ratingService in `src/lib/services/ratingService.ts` — createReview() (validates request completed + no existing review, calculates overallScore, updates partner aggregate, checks threshold, triggers notifications), addPartnerResponse(), getReviewsForPartner(), getPartnerRatingBreakdown()
- [ ] T078 [US3] Create review API routes in `src/app/api/reviews/route.ts` — GET (filterable by partner, paginated) and POST (manager-only, one per request)
- [ ] T079 [US3] Create review detail API route in `src/app/api/reviews/[id]/route.ts` — PATCH (partner response only)
- [ ] T080 [P] [US3] Create ReviewForm component in `src/components/features/ReviewForm.tsx` — interactive rating form with clickable stars for each criterion (timeliness, quality, communication, value), comments textarea, overall score preview, submit with validation
- [ ] T081 [US3] Create reviews list page in `src/app/(dashboard)/reviews/page.tsx` — list of completed services pending review with "Write Review" CTA, and list of submitted reviews
- [ ] T082 [US3] Create new review page in `src/app/(dashboard)/reviews/new/[requestId]/page.tsx` — review form pre-populated with service request details, partner info, and acceptance scenarios
- [ ] T083 [US3] Update partner profile page `src/app/(dashboard)/partners/[id]/page.tsx` to display rating breakdown chart (radar chart of criteria averages) and paginated review list with partner responses

**Checkpoint**: User Story 3 complete — quality review workflow functional, partner ratings update in real-time, low-rating alerts trigger. ✅

---

## Phase 6: User Story 4 — AI-Powered Analytics and Predictive Maintenance (Priority: P4)

**Goal**: Managers access analytics dashboard with spending trends, service frequency, partner performance comparisons, and AI-driven predictive maintenance suggestions.

**Independent Test**: View analytics dashboard with historical data → see spending/frequency charts → view predictive maintenance alerts → act on a prediction (pre-fills service request).

### Implementation for User Story 4

- [ ] T084 [P] [US4] Create PredictiveAlert Mongoose model in `src/lib/models/PredictiveAlert.ts` with associationId/serviceCategory/predictedDate/confidence/suggestedPartnerIds/averageInterval/dataPointCount/status fields and indexes
- [ ] T085 [P] [US4] Create predictionService in `src/lib/services/predictionService.ts` — generatePredictions() (aggregate completed requests by category, calculate average days between services, predict next date, assign confidence based on data points, suggest top-rated partners), getPredictionsForAssociation(), updatePredictionStatus()
- [ ] T086 [US4] Create analytics API route in `src/app/api/analytics/route.ts` — GET with period filter (3m/6m/1y/all), returns spending by category/month, service frequency, top partners, avg response time, completion rate using MongoDB aggregation pipelines
- [ ] T087 [US4] Create predictions API routes in `src/app/api/analytics/predictions/route.ts` — GET (active predictions for association) and POST /generate (trigger prediction generation)
- [ ] T088 [US4] Create prediction update API route in `src/app/api/analytics/predictions/[id]/route.ts` — PATCH (update status: acted_on, dismissed)
- [ ] T089 [P] [US4] Create useAnalytics hook in `src/hooks/useAnalytics.ts` — fetch analytics data with period filter, predictions list, generate/dismiss/act actions
- [ ] T090 [P] [US4] Create AnalyticsChart component in `src/components/features/AnalyticsChart.tsx` — Chart.js wrapper supporting line (spending trends), bar (service frequency), doughnut (category distribution), and radar (partner comparison) charts with responsive sizing and accessible labels
- [ ] T091 [P] [US4] Create PredictiveAlertCard component in `src/components/features/PredictiveAlertCard.tsx` — card showing predicted service, date, confidence badge, suggested partners, "Schedule Now" and "Dismiss" action buttons
- [ ] T092 [US4] Create analytics dashboard page in `src/app/(dashboard)/analytics/page.tsx` — period selector, spending trend line chart, service frequency bar chart, category distribution doughnut, top partners comparison table, predictive maintenance alerts section with alert cards, responsive grid layout

**Checkpoint**: User Story 4 complete — analytics dashboard shows real data visualizations, predictive maintenance generates actionable alerts. ✅

---

## Phase 7: User Story 5 — Partner Accreditation and Profile Management (Priority: P5)

**Goal**: Partners can register and submit accreditation applications. Admins review, approve, or reject applications. Partners manage their profiles.

**Independent Test**: Register as partner → submit documentation → admin reviews queue → approves/rejects → partner receives notification → partner updates profile and availability.

### Implementation for User Story 5

- [ ] T093 [P] [US5] Create Dispute Mongoose model in `src/lib/models/Dispute.ts` with invoiceId/serviceRequestId/initiatedBy/reason/evidence/status/resolution fields, pre-save middleware to set associated invoice paymentStatus to "on_hold"
- [ ] T094 [US5] Create admin accreditation API route in `src/app/api/admin/accreditation/route.ts` — GET (pending/review queue) and POST (approve/suspend/revoke/reactivate with reason, updates partner status + accreditationHistory, triggers notification)
- [ ] T095 [US5] Create disputes API routes in `src/app/api/disputes/route.ts` — GET (admin: all; users: own disputes) and POST (create dispute on invoice, sets invoice on_hold)
- [ ] T096 [US5] Create dispute detail API route in `src/app/api/disputes/[id]/route.ts` — PATCH (admin resolution: full_payment/partial_payment/voided with note)
- [ ] T097 [US5] Create admin layout in `src/app/(admin)/layout.tsx` — admin-specific sidebar with accreditation queue count badge, disputes count badge
- [ ] T098 [US5] Create admin dashboard page in `src/app/(admin)/admin/page.tsx` — summary cards (pending accreditations, open disputes, platform stats), recent activity feed
- [ ] T099 [US5] Create accreditation management page in `src/app/(admin)/accreditation/page.tsx` — queue of pending/under_review partners, partner detail expandable rows with documentation, approve/suspend/revoke action buttons with reason modal
- [ ] T100 [US5] Create dispute resolution page in `src/app/(admin)/disputes/page.tsx` — open disputes list, dispute detail with invoice info + both party perspectives, resolution form (decision + amount + note), resolution history
- [ ] T101 [US5] Create partner profile management page in `src/app/(partner)/profile/page.tsx` — edit business details, service categories checkboxes, service areas, certifications, availability toggle, pricing model, performance metrics summary (rating, completed requests)
- [ ] T102 [US5] Create user/association profile page in `src/app/(dashboard)/profile/page.tsx` — edit user details, association info, manage associated managers, change password

**Checkpoint**: User Story 5 complete — full admin panel functional with accreditation workflow and dispute resolution. Partner profile management works. ✅

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T103 [P] Create notification center page in `src/app/(dashboard)/notifications/page.tsx` — full list of all notifications with filters by type, mark read/unread, bulk actions
- [ ] T104 [P] Create landing page in `src/app/page.tsx` — public landing with hero section, feature highlights, partner count stats, CTA buttons (login/register), responsive and visually stunning with gradients and micro-animations
- [ ] T105 [P] Create Footer component in `src/components/layout/Footer.tsx` — links, copyright, responsive layout
- [ ] T106 Add loading skeletons to all list/dashboard pages — consistent skeleton patterns matching actual content layouts
- [ ] T107 Add empty state illustrations and guidance messages to all list pages (no requests, no invoices, no reviews, etc.)
- [ ] T108 Implement responsive layout polish — verify all pages at 320px, 640px, 768px, 1024px, 1440px breakpoints; fix overflow, truncation, and touch target issues
- [ ] T109 Implement keyboard navigation audit — verify tab order, focus indicators, escape-to-close modals, Enter-to-submit forms across all interactive pages
- [ ] T110 [P] Create database seed script in `scripts/seed.ts` — generate demo data: 3 associations, 10 partners (varied accreditation statuses), 15 managers, 50 service requests (varied statuses), 30 invoices, 20 reviews, 5 predictive alerts, and an admin user
- [ ] T111 Cross-browser testing — verify on Chrome, Firefox, Safari (desktop) and iOS Safari, Chrome Android (mobile) per constitution quality gates
- [ ] T112 Performance audit — verify < 2s initial page load, code-split routes, optimized images via next/image, no unnecessary client-side JavaScript
- [ ] T113 Security hardening — verify all API routes check authentication, validate input with Zod, sanitize database queries, no secrets in client bundle

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — **BLOCKS** all user stories
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion — can start immediately after
- **User Story 2 (Phase 4)**: Depends on Phase 2 + ServiceRequest model from Phase 3 (T033)
- **User Story 3 (Phase 5)**: Depends on Phase 2 + ServiceRequest and FieldPartner models
- **User Story 4 (Phase 6)**: Depends on Phases 2–5 (needs historical data models to aggregate)
- **User Story 5 (Phase 7)**: Depends on Phase 2 + Invoice model from Phase 4 (for disputes)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: After Phase 2 — no other story dependencies — **MVP target**
- **US2 (P2)**: After Phase 2 — needs ServiceRequest model (shared from US1, can be built in Phase 2 foundational if US2 starts in parallel)
- **US3 (P3)**: After Phase 2 — needs ServiceRequest + FieldPartner models
- **US4 (P4)**: After Phase 2 — needs all prior data models for aggregation; best built after US1–US3 to have data variety
- **US5 (P5)**: After Phase 2 — needs Invoice model for disputes; admin features can start independently

### Within Each User Story

- Models before services
- Services before API routes
- API routes before hooks
- Hooks before pages/components
- Core implementation before integration

### Parallel Opportunities

- Phase 1: T004, T005, T006 can run in parallel
- Phase 2: T009, T010, T011 (models), T015–T019 (validators/utils), T021–T022 (providers), T024–T027 (UI components), T029–T030 (layout) all parallelizable
- Phase 3: T033–T036 (models/validators), T044–T050 (hooks/components) parallelizable
- Phase 4: T061–T062 (model/validators), T068–T070 (hooks/components) parallelizable
- Phase 5: T075–T076 parallelizable
- Phase 6: T084–T085 (model/service), T089–T091 (hooks/components) parallelizable
- Phase 8: T103–T105, T110 parallelizable

---

## Parallel Example: Phase 3 (User Story 1)

```bash
# Launch all models & validators together:
Task T033: Create ServiceRequest model in src/lib/models/ServiceRequest.ts
Task T034: Create Notification model in src/lib/models/Notification.ts
Task T035: Create request validation schemas in src/lib/validators/request.ts
Task T036: Create partner validation schemas in src/lib/validators/partner.ts

# After models complete, launch all hooks & components together:
Task T044: Create usePartners hook in src/hooks/usePartners.ts
Task T045: Create useRequests hook in src/hooks/useRequests.ts
Task T046: Create useNotifications hook in src/hooks/useNotifications.ts
Task T047: Create PartnerCard component in src/components/features/PartnerCard.tsx
Task T048: Create StarRating component in src/components/features/StarRating.tsx
Task T049: Create RequestTimeline component in src/components/features/RequestTimeline.tsx
Task T050: Create NotificationBell component in src/components/features/NotificationBell.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Managers can search partners and submit service requests
5. Deploy if ready — core marketplace functionality is live

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy (MVP!)
3. Add User Story 2 → Test independently → Deploy (billing live)
4. Add User Story 3 → Test independently → Deploy (ratings live)
5. Add User Story 4 → Test independently → Deploy (analytics live)
6. Add User Story 5 → Test independently → Deploy (admin panel live)
7. Polish → Final release

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Total: **113 tasks** across 8 phases
