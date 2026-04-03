# Quickstart: Association Partner Platform

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **MongoDB** — either MongoDB Atlas (cloud) or local MongoDB 7+
- **npm** or **yarn** package manager

## Setup

### 1. Create the Next.js project

```bash
npx -y create-next-app@latest ./ --typescript --eslint --app --src-dir --import-alias "@/*" --no-tailwind
```

### 2. Install dependencies

```bash
npm install mongoose next-auth@beta @auth/mongodb-adapter bcryptjs zod chart.js react-chartjs-2 jspdf jspdf-autotable
npm install -D @types/bcryptjs
```

### 3. Configure environment variables

Create `.env.local` at the project root:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/association-platform?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_SECRET=your-random-secret-here-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# Email (optional — Resend)
RESEND_API_KEY=re_xxxxxxxx
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Seed the database (first run)

```bash
# Create a seed script at scripts/seed.ts and run:
npx tsx scripts/seed.ts
```

## Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest unit tests |
| `npx playwright test` | Run E2E tests |

## Project Conventions

- **Pages**: Next.js App Router in `src/app/`
- **Models**: Mongoose schemas in `src/lib/models/`
- **API Routes**: `src/app/api/` — all routes validate auth + input via middleware
- **Components**: `src/components/` — split by `ui/`, `layout/`, `features/`
- **Styles**: Vanilla CSS with custom properties in `src/app/globals.css`
- **Types**: Shared TypeScript types in `src/types/index.ts`
- **Validation**: Zod schemas in `src/lib/validators/` — shared between client and API

## Mobile Responsive Breakpoints

| Breakpoint | Width | Target |
|-----------|-------|--------|
| xs | 320px | Small phones |
| sm | 640px | Large phones |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1440px | Desktops |

Use mobile-first approach: base styles target smallest screens, use `min-width` media queries to scale up.
