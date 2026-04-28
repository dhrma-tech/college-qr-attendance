# Backend Workflows

This document maps the app routes, API routes, Supabase tables, and operational jobs.

## API Route Contract

| Method | Path | Purpose | Supabase path |
| --- | --- | --- | --- |
| `POST` | `/api/sessions/start` | Teacher starts an attendance session | `attendance_sessions.insert` |
| `POST` | `/api/sessions/[id]/rotate` | Rotate the QR token | `rotate_attendance_session_token()` |
| `POST` | `/api/sessions/[id]/end` | Close a live session | `attendance_sessions.update` |
| `POST` | `/api/attendance/mark` | Validate QR scan and create record | `mark_attendance_from_qr()` |
| `POST` | `/api/attendance/override` | Teacher manual correction | `attendance_records.update` |
| `GET` | `/api/reports/attendance` | Aggregated attendance report | `student_attendance_summary` |
| `GET` | `/api/health/backend` | Deployment/API/database readiness map | env + workflow map |

All routes return safe demo responses when Supabase server environment variables are missing.

## Session Pipeline

1. Teacher opens `/teacher/attendance`.
2. Client posts to `/api/sessions/start`.
3. Session row is created with location, radius, QR token, and expiry.
4. Teacher opens `/teacher/attendance/[id]`.
5. Client calls `/api/sessions/[id]/rotate` every configured interval.
6. Students scan `/scan/[token]`.
7. Scan page posts token, location, and device fingerprint to `/api/attendance/mark`.
8. Database validates token expiry, duplicate record, and geofence distance.
9. Teacher page subscribes to `attendance_records` through Supabase Realtime.
10. Teacher ends session through `/api/sessions/[id]/end`.

## Reporting Pipeline

1. Attendance records are aggregated by `student_attendance_summary`.
2. Department alerts are derived through `low_attendance_alerts`.
3. Live session counters use `active_session_status`.
4. PDF/CSV exports should call `/api/reports/attendance` and render client-side downloads.

## Database Files

- `supabase/migrations/0001_initial_schema.sql`: base tables and starter RLS.
- `supabase/migrations/0002_operational_workflows.sql`: indexes, QR functions, geofence distance, views, audit trigger.
- `supabase/seed.sql`: safe college seed placeholder.

## Next Backend Improvements

- Replace demo API responses with authenticated user context.
- Expand RLS for HOD and admin scopes.
- Add storage buckets for profiles, exports, and backups.
- Add cron/Edge scheduling for token rotation and low-attendance notifications.
