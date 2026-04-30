# Security Policy

## Security Model

ScanRoll runs in demo mode when Supabase environment variables are not configured. Demo mode uses localStorage and mock data for local testing only.

When Supabase is configured, ScanRoll uses Supabase Auth, role-checked middleware, server-side QR token validation, and database-backed attendance records. Review your Supabase RLS policies before using real student data.

## Before Production Use

Review:

- Database-level access controls
- Audit logging
- Rate limiting
- Input validation
- Secret management
- QR token rotation interval and expiry
- Backup and retention rules

## Reporting a Vulnerability

Please open a private security advisory or contact the maintainers before publishing vulnerability details.
