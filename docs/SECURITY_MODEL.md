# ScanRoll Security Model

This document explains the security architecture, threat model, and critical security considerations for ScanRoll.

## Overview

ScanRoll uses a layered security approach with multiple defense mechanisms:

1. **Supabase Auth** - User authentication and session management
2. **Row Level Security (RLS)** - Database-level access control
3. **Role-based Access Control** - Student, Teacher, HOD, Admin roles
4. **Server-side Validation** - API route validation and business logic
5. **Service Role Key** - Bypasses RLS for privileged operations (server-only)

## Supabase Service Role Usage

### What is the Service Role Key?

The `SUPABASE_SERVICE_ROLE_KEY` is a powerful secret that:
- **Bypasses all RLS policies** - Has unrestricted database access
- **Can perform any database operation** - Including deletes and schema changes
- **Must never reach client code** - Should only be used server-side
- **Is equivalent to database admin access** - Treat with extreme caution

### Where Service Role is Used

The service role key is used in these specific server-side contexts:

#### 1. API Route Authentication
```typescript
// src/app/api/sessions/start/route.ts
// Creates attendance sessions with proper teacher validation
const supabase = createServiceRoleClient();
```

#### 2. User Management Operations
```typescript
// src/app/api/signup/route.ts
// Creates user accounts after approval workflow
const supabase = createServiceRoleClient();
```

#### 3. Attendance Override Operations
```typescript
// src/app/api/attendance/override/route.ts
// Allows authorized users to modify attendance records
const supabase = createServiceRoleClient();
```

#### 4. Database RPC Functions
```typescript
// supabase/functions/mark_attendance_from_qr.sql
// Server-side QR token validation and attendance marking
```

### Why Service Role is Required

Service role bypasses RLS for these specific operations:

1. **Cross-table validation** - Attendance marking needs to verify student enrollment, session validity, and teacher permissions simultaneously
2. **Audit logging** - Creating audit log entries that users shouldn't modify
3. **User creation** - Creating Supabase Auth users and database records atomically
4. **Administrative operations** - Operations that require elevated privileges

### Service Role Safety Requirements

✅ **Safe Usage Patterns:**
- Only used in API routes (server-side)
- Always validate user permissions first
- Never expose response data to unauthorized users
- Use parameterized queries to prevent SQL injection
- Add comprehensive error handling

❌ **Forbidden Usage:**
- Never in client-side components
- Never in browser console or logs
- Never committed to version control
- Never prefixed with `NEXT_PUBLIC_`
- Never used without proper validation

## Row Level Security (RLS) Policies

### Policy Structure

RLS policies enforce data access at the database level:

```sql
-- Example: Students can only see their own attendance
CREATE POLICY "Students view own attendance" ON attendance
  FOR SELECT USING (
    auth.uid() = student_id
  );
```

### Critical RLS Requirements

1. **All tables must have RLS enabled**
2. **No broad public policies** - Always scope by user/role
3. **Explicit role checks** - Verify user role in policies
4. **College/department scoping** - Enforce organizational boundaries
5. **Audit logging protection** - Restrict audit log access to admins

### Policy Categories

#### Student Policies
- View own profile and enrollment
- View own attendance records
- No update/delete permissions

#### Teacher Policies
- View assigned classes and subjects
- Create/manage attendance sessions
- View attendance for assigned sessions
- Override attendance for own sessions

#### HOD Policies
- View department-wide data
- Manage teachers in department
- Override attendance for department
- View department reports

#### Admin Policies
- Full college-wide access
- User management
- System configuration
- Audit log access

## Threat Model

### High-Risk Threats

#### 1. Service Role Exposure
**Risk**: Service role key exposed to client
**Impact**: Complete database compromise
**Mitigation**: 
- Environment validation prevents client-side exposure
- Never prefix with `NEXT_PUBLIC_`
- Code reviews for any service role usage

#### 2. RLS Policy Bypass
**Risk**: Weak or missing RLS policies
**Impact**: Unauthorized data access
**Mitigation**:
- Comprehensive policy testing
- Regular policy audits
- Principle of least privilege

#### 3. QR Token Abuse
**Risk**: QR tokens shared or reused
**Impact**: Fraudulent attendance marking
**Mitigation**:
- Short token expiry (30 seconds)
- One-time use tokens
- Geofencing validation
- Duplicate prevention

#### 4. Authentication Bypass
**Risk**: Weak authentication controls
**Impact**: Unauthorized system access
**Mitigation**:
- Supabase Auth integration
- Role verification in API routes
- Session management

#### 5. Data Leakage
**Risk**: Export or API data exposure
**Impact**: Privacy violation
**Mitigation**:
- Role-scoped data access
- PII minimization in exports
- Audit logging

### Medium-Risk Threats

#### 1. Rate Limiting Bypass
**Risk**: API endpoint abuse
**Impact**: System performance, potential DoS
**Mitigation**:
- IP-based rate limiting
- User-based rate limiting
- Request validation

#### 2. Input Validation Bypass
**Risk**: Malicious input processing
**Impact**: Data integrity issues
**Mitigation**:
- Comprehensive input validation
- Type checking
- Length limits

#### 3. Session Hijacking
**Risk**: Stolen session tokens
**Impact**: Account takeover
**Mitigation**:
- Secure cookie handling
- Session expiration
- HTTPS enforcement

## Security Checklist

### Development Security
- [ ] No service role key in client code
- [ ] All API routes validate user roles
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info
- [ ] Environment variables properly configured

### Database Security
- [ ] RLS enabled on all tables
- [ ] No broad public policies
- [ ] College/department scoping enforced
- [ ] Audit logging implemented
- [ ] Database functions use SECURITY DEFINER properly

### Production Security
- [ ] Environment validation enabled
- [ ] Rate limiting configured
- [ ] HTTPS enforced
- [ ] Backup policies in place
- [ ] Monitoring and alerting

## Known Limitations

1. **Demo Mode Security** - Demo mode uses placeholder credentials and should never be used in production
2. **Mobile Security** - QR codes can be screenshared and shared
3. **Geofencing** - GPS spoofing can bypass location checks
4. **Network Security** - Assumes trusted network infrastructure

## Security Reporting

If you discover a security vulnerability:

1. **Do not** open a public issue
2. Email security details to: security@scanroll.dev
3. Include:
   - Vulnerability description
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if known)

4. **Response Timeline**
   - Initial response: 48 hours
   - Fix timeline: Depends on severity
   - Public disclosure: After fix is deployed

## Security Audits

Regular security audits should include:

1. **Code Review** - Service role usage, input validation
2. **Database Review** - RLS policies, user permissions
3. **Infrastructure Review** - Environment configuration, secrets management
4. **Penetration Testing** - API endpoints, authentication flows

## Compliance Considerations

### Data Privacy
- GDPR compliance for EU users
- FERPA compliance for educational records
- Local privacy law compliance

### Data Retention
- Define retention policies for attendance data
- Implement data deletion procedures
- Audit trail preservation requirements

### Access Controls
- Regular access reviews
- Principle of least privilege
- Separation of duties
