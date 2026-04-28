# College QR Attendance

College QR Attendance is an open-source attendance platform for one college deployment. Teachers start secure QR sessions, students scan from mobile browsers, and HOD/admin teams monitor attendance health with clean role-based dashboards.

The app is built for Vercel + Supabase with a mobile-first scan flow, rotating QR token architecture, geofence-ready validation, realtime-ready teacher sessions, and open-source setup files.

## Features

- Student, teacher, HOD, and admin portals with separate route trees.
- QR attendance session UI with live counter, rotating-token copy, and projector-friendly display.
- Mobile scan landing page for `/scan/[token]`.
- Student attendance summary, subject breakdowns, and profile UX.
- Teacher session, roster, and report screens.
- HOD department visibility, low-attendance alerts, and teacher performance views.
- Admin setup screens for departments, teachers, students, subjects, timetable, config, backups, and audit logs.
- Supabase schema migration, seed data, RLS policy foundation, and Edge Function stubs.
- Vercel-ready Next.js 14 App Router project structure.

## Stack

- Next.js 14 App Router
- Supabase Auth, PostgreSQL, Realtime, Storage, Edge Functions
- Tailwind CSS with shadcn-style UI primitives
- Lucide icons, Recharts, qrcode, html5-qrcode
- Vercel deployment

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and fill your Supabase project values.

```bash
cp .env.example .env.local
```

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/migrations/0001_initial_schema.sql`.
3. Run `supabase/migrations/0002_operational_workflows.sql`.
4. Optionally load `supabase/seed.sql` for demo data.
5. Enable email/password auth.
6. Add storage buckets for profile photos and exports.

## Backend Workflows

See `BACKEND_WORKFLOWS.md` for API route paths, Supabase function paths, dashboard data flows, and rollout sequencing.

## Vercel Setup

1. Import the repository in Vercel.
2. Add the environment variables from `.env.example`.
3. Set the build command to `npm run build`.
4. Deploy.

## First Admin Workflow

1. Configure college details in `/admin/config`.
2. Create departments and assign HODs.
3. Import teachers and students.
4. Create subjects and subject assignments.
5. Add timetable slots.
6. Teachers can start QR sessions from `/teacher/attendance`.

## Project Structure

```text
src/app        Next.js routes and layouts
src/components Shared application and UI components
src/lib        Config, mock data, Supabase helpers, attendance utilities
src/styles     Global CSS entry
supabase       Migrations, seed data, Edge Function stubs
```

## Status

This rebuild provides a production-ready frontend architecture and Supabase-ready backend contract. The next step is connecting the UI actions to a live Supabase project and completing server-side token validation.

## License

MIT
