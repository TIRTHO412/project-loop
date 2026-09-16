# PROJECT LOOP — AI Customer Feedback Intelligence Platform

> **Tagline:** "Turn Customer Feedback Into Business Intelligence."

LOOP is a real, production-ready full-stack B2B SaaS application designed to help product, customer success, and executive teams collect, analyze, and act on user feedback using AI-powered sentiment analysis, theme discovery, trend tracking, and Voice-of-Customer reporting.

---

## Part 5 Features — Voice-of-Customer Reports & PDF Export

- **Voice-of-Customer Reports Hub (`/dashboard/reports`)**:
  - **Date Range Selector & Generator**: Select custom start date and end date to analyze organization feedback within a specific reporting window.
  - **AI Executive Summary Engine**: Centralized AI service (`lib/reports/index.ts`) generating structured markdown summaries (`### Overall Customer Sentiment`, `### What Customers Like`, `### What Customers Dislike`, `### Emerging Signals & Key Observations`).
  - **Zero-Fake Data Empty State**: If no feedback exists in the selected date range, LOOP displays a clear message rather than generating a fake report.
  - **Reports Archive Table**: Lists all generated reports with title, date range, created date, author, status (`READY`, `GENERATING`, `FAILED`), and quick actions (`Inspect Preview` & `Download PDF`).
- **Interactive Report Inspection Page (`/dashboard/reports/[id]`)**:
  - **Multi-Tenant Security Scoping**: Strictly verifies report ownership against authenticated `session.organizationId` (returns `403` / `404` for unauthorized cross-tenant requests).
  - **Executive Summary Card**: Rendered markdown AI summary.
  - **Feedback Overview & Sentiment Breakdown**: KPI cards (Total Feedback, Positive %, CSAT Rating 0-5.0, Open Issues) and sentiment ratio bars.
  - **Top Customer Themes**: Theme volume table with average sentiment score (0-100).
  - **Anonymized Customer Voice**: Representative customer quotes ("Customer #101", "Customer #102") preserving privacy.
  - **Key Observations & Trends**: Factual trend signals.
- **Client-Side Vector PDF Export Engine (`lib/reports/pdf-export.ts`)**:
  - Built with `jspdf` & `jspdf-autotable`.
  - Produces vector PDFs featuring Project LOOP branding, executive summaries, formatted metrics tables, anonymized quotes, and confidential footers with page numbers.
- **PDF Download Security Endpoint (`/api/reports/[id]/pdf`)**:
  - Validates authentication and organization tenant keying before serving report PDF data.

---

## Complete Feature Matrix (Parts 1 – 5)

1. **Enterprise Landing Page**: Hero with interactive dynamic dashboard preview, feature matrix, 4-step workflow, multi-tenant security showcase, and CTA footer.
2. **Authentication & User Management**: Secure Signup & Login with salted `bcryptjs` password hashing, cookie-based JWT sessions (`jose`), `/api/auth/logout`, and quick one-click role demo selectors.
3. **Multi-Tenant Database Architecture**: PostgreSQL Prisma schema supporting Organizations, Users, Memberships, Feedback, FeedbackAnalysis, Themes, Reports, AIConversations, Notifications, and Integrations.
4. **Role-Based Access Control (RBAC)**: Server and client-enforced authorization scopes for `ADMIN`, `MANAGER`, `ANALYST`, and `SUPPORT`.
5. **Customer Feedback Collection**: Filterable/searchable Feedback Inbox, Add Feedback Flow, CSV Bulk Import, and Bulk AI Analysis.
6. **Centralized AI Intelligence**: Sentiment classification (`POSITIVE`, `NEUTRAL`, `NEGATIVE`), 0–100 sentiment score scale, model confidence %, category & theme tag extraction, interfacing OpenAI API (`gpt-4o-mini`) with intelligent NLP fallback.
7. **Advanced Analytics Dashboard**: Date range filter selector (7d, 30d, 90d, year, all time), Recharts timeline area chart, sentiment donut, top themes matrix, source channels, and CSV Analytics Export.
8. **LOOP AI Assistant**: Conversational agent for natural language feedback queries with multi-tenant data retrieval pipeline, quick suggested questions, and chat history persistence.
9. **Voice-of-Customer Reports & PDF Export**: Executive report generator, report preview, and vector PDF download.

---

## Technology Stack

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS, `next-themes`
- **UI Components**: shadcn/ui primitives, Lucide Icons, Recharts
- **PDF Generator**: `jspdf` & `jspdf-autotable`
- **Backend & Authentication**: Next.js Server Actions / API Routes, `bcryptjs`, `jose` JWT cookies, Middleware route protection
- **Database**: Prisma ORM v5, PostgreSQL schema foundation, in-memory fallback store
- **AI Engine**: Centralized AI Service Abstraction (`lib/ai/index.ts`) interfacing OpenAI API (`gpt-4o-mini`) with intelligent NLP fallback
- **Deployment**: Vercel ready

---

## Environment Variables

Copy `.env.example` to `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/project_loop?schema=public"
AUTH_SECRET="your-super-secret-32-byte-hex-or-jwt-key-here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
OPENAI_API_KEY="sk-proj-your-openai-api-key-here"
```

---

## Running Locally

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Run Dev Server
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## Verification Commands

```bash
npx tsc --noEmit
npm run build
```
