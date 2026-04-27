# Setup Guide

## 1. Install

```bash
npm install
```

## 2. Configure Environment

Create `.env.local` from `.env.example` and add Supabase values.

## 3. Create Supabase Tables

Run `supabase/migrations/0001_initial_schema.sql` in the Supabase SQL editor or with the Supabase CLI.

## 4. Load Demo Data

Run `supabase/seed.sql` after the migration if you want sample college data.

## 5. Deploy

Import the repository into Vercel, set the same environment variables, and deploy.

## First College Configuration

- Create the college config in `/admin/config`.
- Add departments and HODs.
- Bulk import teachers and students.
- Create subjects, sections, and timetable slots.
- Ask teachers to start sessions from `/teacher/attendance`.
