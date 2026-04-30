# ScanRoll

ScanRoll is an open-source QR Code Attendance System for colleges. Teachers can create QR-based attendance sessions, students can scan the QR from their phone, and admins/HODs can review attendance dashboards and reports.

The project is designed to be easy to try first, then connect to a real backend later.

## What You Can Do

- Run a working local demo without creating any backend account.
- Open student, teacher, HOD, and admin dashboards.
- Simulate QR attendance sessions.
- Scan a real QR code with the camera on supported devices.
- Export attendance reports as CSV or PDF.
- Connect Supabase for real authentication, database storage, and server-side QR validation.

## Who This README Is For

This guide is written for non-technical users too. If you can install an app and copy-paste commands, you can run the demo.

If you get stuck, check [SETUP.md](./SETUP.md). It has slower step-by-step instructions and troubleshooting.

## Setup Option 1: Quick Demo

Use this if you only want to see the website working on your laptop.

### Step 1: Install Node.js

Install Node.js from:

```text
https://nodejs.org
```

Choose the LTS version if you are unsure.

### Step 2: Open The Project Folder

Open a terminal in the project folder.

On Windows, you can open the folder, click the address bar, type `powershell`, and press Enter.

### Step 3: Install The App

```bash
npm install
```

### Step 4: Start The App

```bash
npm run dev
```

### Step 5: Open The Website

Open this address in your browser:

```text
http://127.0.0.1:3000
```

## Demo Login Emails

In demo mode, no password is required.

| Role | Login Page | Demo Email |
|---|---|---|
| Student | `/login` | `student@scanroll.demo` |
| Teacher | `/teacherlogin` | `teacher@scanroll.demo` |
| HOD | `/hodlogin` | `hod@scanroll.demo` |
| Admin | `/admin/login` | `admin@scanroll.demo` |

Demo data is stored in your browser only. It is safe for testing, but it is not for real college attendance.

## Setup Option 2: Supabase Backend

Use this when you want real login, database persistence, and server-side QR validation.

Short version:

1. Create a Supabase project.
2. Run the SQL migration files from `supabase/migrations` in order.
3. Copy `.env.example` to `.env.local`.
4. Paste your Supabase URL, anon key, and service role key into `.env.local`.
5. Create real Supabase Auth users and matching rows in the `users` table.
6. Run `npm run dev`.

Detailed instructions are in [SETUP.md](./SETUP.md).

## Features

- QR-based attendance marking
- Student, Teacher, HOD, and Admin portals
- Role-checked login when Supabase is configured
- Server-side QR token validation
- Attendance logs and summaries
- Camera QR scanner
- CSV and PDF report exports
- Supabase database migrations
- Demo mode for easy local testing

## Product Preview

### Landing Page

![ScanRoll landing hero](docs/screenshots/landing-hero.png)

### Hero Section

![Landing hero section](docs/screenshots/landing-hero-section.png)

### Student Login

![Student login page](docs/screenshots/student-login.png)

### Student Attendance Dashboard

![Student dashboard attendance view](docs/screenshots/student-dashboard-attendance.png)

### Teacher Live QR Session

![Teacher live QR session page](docs/screenshots/teacher-live-qr-session.png)

### Teacher Reports

![Teacher reports page](docs/screenshots/teacher-reports-page.png)

## How It Works

1. Teacher starts an attendance session.
2. ScanRoll creates a QR token.
3. Student scans the QR code.
4. The server checks the token, user role, expiry, and duplicate status.
5. Attendance is recorded.
6. Teacher/HOD/Admin can review reports.

## Tech Stack

- Next.js 15
- React
- Tailwind CSS
- Supabase Auth and PostgreSQL
- `qrcode` for QR display
- `html5-qrcode` for camera scanning
- Recharts

## Common Commands

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Environment Variables

Create `.env.local` only when connecting Supabase.

```bash
copy .env.example .env.local
```

On macOS/Linux:

```bash
cp .env.example .env.local
```

See [.env.example](./.env.example) for the full list.

## Important Production Notice

Before using ScanRoll with real students, review:

- Supabase RLS policies
- Admin account creation process
- QR expiry settings
- Audit logs
- Rate limiting
- Backups
- College privacy requirements

Read [SECURITY.md](./SECURITY.md) before production use.

## Project Files To Know

| File/Folder | Purpose |
|---|---|
| `src/app` | Website pages and API routes |
| `src/components` | Reusable UI components |
| `src/lib` | Data, backend helpers, Supabase clients |
| `supabase/migrations` | Database schema files |
| `.env.example` | Environment variable template |
| `SETUP.md` | Detailed setup guide |
| `SECURITY.md` | Security notes |

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT License. See [LICENSE](./LICENSE).
