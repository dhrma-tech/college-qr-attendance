# ScanRoll Setup Guide

This guide is written for people who are not full-time developers. Follow it slowly from top to bottom.

## Choose Your Setup

| Goal | Choose This |
|---|---|
| I only want to see the website working | Demo setup |
| I want real login and saved attendance | Supabase setup |
| I want to put it online | Vercel deployment |

Start with the demo setup first. It confirms your laptop can run the project.

---

## Part A: Demo Setup

Demo setup does not need Supabase, database setup, or passwords.

### 1. Install Node.js

1. Go to `https://nodejs.org`.
2. Download the LTS version.
3. Install it using the default options.
4. Restart your terminal after installing.

To check it worked:

```bash
node -v
npm -v
```

If both commands show version numbers, continue.

### 2. Open The Project Folder

Open the ScanRoll folder in a terminal.

Windows shortcut:

1. Open the project folder.
2. Click the folder address bar.
3. Type `powershell`.
4. Press Enter.

### 3. Install Project Dependencies

Run:

```bash
npm install
```

This may take a few minutes.

### 4. Start The Website

Run:

```bash
npm run dev
```

You should see something like:

```text
Local: http://127.0.0.1:3000
```

### 5. Open ScanRoll

Open:

```text
http://127.0.0.1:3000
```

### 6. Try The Demo Login

No password is needed in demo mode.

| Role | URL | Email |
|---|---|---|
| Student | `http://127.0.0.1:3000/login` | `student@scanroll.demo` |
| Teacher | `http://127.0.0.1:3000/teacherlogin` | `teacher@scanroll.demo` |
| HOD | `http://127.0.0.1:3000/hodlogin` | `hod@scanroll.demo` |
| Admin | `http://127.0.0.1:3000/admin/login` | `admin@scanroll.demo` |

### 7. Stop The Website

Go back to the terminal and press:

```text
Ctrl + C
```

---

## Part B: Supabase Setup

Use this when you want real login, database storage, and server-side QR validation.

### 1. Create A Supabase Project

1. Go to `https://supabase.com`.
2. Create an account or sign in.
3. Click `New project`.
4. Enter a project name, for example `scanroll-college`.
5. Choose a database password and save it somewhere private.
6. Wait for Supabase to finish creating the project.

### 2. Run Database Migrations

In Supabase:

1. Open your project.
2. Go to `SQL Editor`.
3. Open the first migration file in this repo:

```text
supabase/migrations/0001_initial_schema.sql
```

4. Copy the full file content.
5. Paste it into Supabase SQL Editor.
6. Click `Run`.
7. Repeat the same steps for:

```text
supabase/migrations/0002_operational_workflows.sql
supabase/migrations/0003_signup_approval_structure.sql
```

Run them in that exact order.

### 3. Optional Demo Seed

If you want sample college data, run:

```text
supabase/seed.sql
```

This is optional.

### 4. Get Supabase Keys

In Supabase:

1. Go to `Project Settings`.
2. Go to `API`.
3. Copy these values:
   - Project URL
   - anon public key
   - service_role key

Keep the `service_role` key private. Do not share it publicly.

### 5. Create `.env.local`

In the project folder, copy the example file.

Windows:

```bash
copy .env.example .env.local
```

macOS/Linux:

```bash
cp .env.example .env.local
```

Open `.env.local` and paste your values:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Keep the other values as they are unless you want to customize them.

### 6. Create Real Login Users

Supabase Auth users and ScanRoll profile rows must match.

In Supabase:

1. Go to `Authentication`.
2. Click `Add user`.
3. Create an email and password for a test student.
4. Copy the new user's ID.
5. Go to `SQL Editor`.
6. Insert a matching profile row.

Example student profile:

```sql
insert into users (
  id,
  role,
  name,
  email,
  roll_number,
  is_active
) values (
  'PASTE_AUTH_USER_ID_HERE',
  'student',
  'Test Student',
  'student@example.com',
  'CSE-001',
  true
);
```

For a teacher, use:

```sql
insert into users (
  id,
  role,
  name,
  email,
  employee_id,
  is_active
) values (
  'PASTE_AUTH_USER_ID_HERE',
  'teacher',
  'Test Teacher',
  'teacher@example.com',
  'FAC-001',
  true
);
```

For HOD and Admin, change `role` to:

```text
hod
admin
```

### 7. Restart The App

Stop the dev server with `Ctrl + C`, then run:

```bash
npm run dev
```

Now login pages will use Supabase email/password login.

---

## Part C: Deploy To Vercel

Use this when you want the website online.

### 1. Push The Repo To GitHub

Create a GitHub repository and push your code.

### 2. Import In Vercel

1. Go to `https://vercel.com`.
2. Click `Add New Project`.
3. Select your GitHub repo.
4. Keep the default Next.js settings.

### 3. Add Environment Variables

In Vercel project settings, add:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_NAME=ScanRoll
NEXT_PUBLIC_ATTENDANCE_THRESHOLD=75
NEXT_PUBLIC_QR_ROTATION_INTERVAL=30
NEXT_PUBLIC_GEOFENCE_RADIUS=100
```

### 4. Deploy

Click `Deploy`.

---

## Common Problems

### `npm` Is Not Recognized

Node.js is not installed correctly, or the terminal was opened before installing Node.

Fix:

1. Reinstall Node.js LTS.
2. Close the terminal.
3. Open a new terminal.
4. Run `node -v`.

### Port 3000 Is Already Used

Another app is using port 3000.

Try:

```bash
npm run dev -- --port 3001
```

Then open:

```text
http://127.0.0.1:3001
```

### Login Still Uses Demo Mode

Check that `.env.local` exists and has real Supabase values.

Then restart:

```bash
npm run dev
```

### Supabase Login Says Profile Missing

The user exists in Supabase Auth, but there is no matching row in the `users` table.

Fix: copy the Auth user ID and insert a row in `users`.

### Camera Scanner Does Not Open

Browsers may block camera access unless:

- You are on `localhost`, `127.0.0.1`, or HTTPS.
- You allow camera permission.
- Your device has a camera.

### Build Fails After Changing Dependencies

Try:

```bash
npm install
npm run build
```

If it still fails, open a GitHub issue with the error text.

---

## Useful Checks Before Production

Run:

```bash
npm run lint
npm run typecheck
npm run build
npm audit
```

All should pass before deploying for real users.

---

## Important Safety Notes

- Do not commit `.env.local`.
- Do not share the Supabase service role key.
- Do not use demo mode for real attendance.
- Test with fake users before adding real students.
- Review `SECURITY.md` before production.
