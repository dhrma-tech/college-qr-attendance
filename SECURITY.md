# Security Policy

## Supported Versions

| Version | Supported | Security Updates |
|---------|------------|------------------|
| 1.0.x   | ✅        | ✅               |
| < 1.0   | ❌        | ❌               |

Only the latest version receives security updates. Users should upgrade to the latest version promptly.

## Security Model

ScanRoll uses a layered security approach with multiple defense mechanisms:

### Authentication & Authorization
- **Supabase Auth**: User authentication and session management
- **Row Level Security (RLS)**: Database-level access control
- **Role-based Access Control**: Student, Teacher, HOD, Admin roles
- **Server-side Validation**: API route validation and business logic

### Data Protection
- **Service Role Key**: Bypasses RLS for privileged operations (server-only)
- **Environment Validation**: Prevents unsafe fallback behavior in production
- **Input Validation**: Comprehensive validation schemas for all API endpoints
- **Rate Limiting**: Protection against abuse and DoS attacks

### Demo Mode vs Production
- **Demo Mode**: Uses localStorage and mock data for local testing only
- **Production Mode**: Requires Supabase configuration with full security controls

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

## Known Security Limitations

1. **Demo Mode Security**: Demo mode uses placeholder credentials and should never be used in production
2. **Mobile Security**: QR codes can be screenshared and shared
3. **Geofencing**: GPS spoofing can bypass location checks
4. **Network Security**: Assumes trusted network infrastructure

## Supabase Service Role Usage

### What is the Service Role Key?
The `SUPABASE_SERVICE_ROLE_KEY` is a powerful secret that:
- **Bypasses all RLS policies** - Has unrestricted database access
- **Can perform any database operation** - Including deletes and schema changes
- **Must never reach client code** - Should only be used server-side
- **Is equivalent to database admin access** - Treat with extreme caution

### Where Service Role is Used
The service role key is used in these specific server-side contexts:
- API route authentication and validation
- User management operations
- Attendance override operations
- Database RPC functions

### Safety Requirements
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

## RLS Policy Expectations

### Required Policies
All tables must have RLS policies that enforce:

1. **College Scoping**: Users can only access data from their college
2. **Department Scoping**: HODs limited to their department
3. **Role-based Access**: Different access levels for different roles
4. **Self-Access**: Users can only modify their own data
5. **Audit Protection**: Audit logs only accessible to admins

### Policy Categories
- **Student Policies**: View own profile/enrollments/attendance
- **Teacher Policies**: Manage assigned classes and attendance
- **HOD Policies**: Department-wide access and oversight
- **Admin Policies**: Full college administration

## Public Signup Risks

### Risks
- **Spam Accounts**: Automated signup creation
- **Data Harvesting**: Collection of personal information
- **Resource Abuse**: Overwhelming system resources

### Mitigations
- **Rate Limiting**: 5 requests per 15 minutes per IP
- **Role Restrictions**: No public admin signup
- **Input Validation**: Comprehensive field validation
- **Duplicate Prevention**: Email/mobile uniqueness checks

## QR Token Abuse Risks

### Attack Vectors
- **Screenshot Sharing**: Students sharing QR codes
- **Token Reuse**: Attempting to use expired tokens
- **Remote Access**: Using QR codes from outside classroom

### Protections
- **Short Expiry**: 30-second token lifetime
- **One-time Use**: Tokens invalidated after first use
- **Geofencing**: Location-based validation
- **Device Fingerprinting**: Track device usage patterns

## Rate Limiting Requirements

### Protected Endpoints
- `/api/signup`: 5 requests per 15 minutes
- `/api/attendance/mark`: 30 requests per minute
- `/api/attendance/override`: 20 requests per 5 minutes
- `/api/sessions/start`: 10 requests per 5 minutes
- `/api/sessions/[id]/rotate`: 60 requests per minute
- `/api/reports/attendance`: 10 requests per minute

### Implementation
- IP-based limiting for anonymous requests
- User-based limiting for authenticated requests
- Memory-based storage (production should use Redis)
- Configurable limits per endpoint

## Student Data Privacy

### Data Types Handled
- **Personal Identifiers**: Name, email, mobile number
- **Academic Records**: Attendance patterns, enrollment data
- **Location Data**: GPS coordinates for geofencing
- **Behavioral Data**: Device fingerprints, access patterns

### Privacy Requirements
- **Data Minimization**: Collect only necessary data
- **Purpose Limitation**: Use data only for stated purposes
- **Retention Policies**: Define data retention periods
- **Access Controls**: Restrict access to authorized users
- **Audit Trails**: Log all data access and modifications

### Compliance Considerations
- **GDPR**: EU data protection regulations
- **FERPA**: US educational privacy laws
- **Local Laws**: Regional data protection requirements

## Production Deployment Requirements

### Environment Configuration
- [ ] Supabase environment variables configured
- [ ] Service role key server-only (no NEXT_PUBLIC_ prefix)
- [ ] HTTPS enforced in production
- [ ] Secure cookie configuration
- [ ] CORS properly configured

### Security Controls
- [ ] All RLS policies implemented and tested
- [ ] Rate limiting enabled on all endpoints
- [ ] Input validation on all API routes
- [ ] Environment validation enabled
- [ ] Audit logging implemented

### Operational Requirements
- [ ] Regular backup procedures
- [ ] Monitoring and alerting configured
- [ ] Log rotation and retention policies
- [ ] Security scanning in CI/CD pipeline
- [ ] Dependency vulnerability scanning

### Access Management
- [ ] Admin account creation process documented
- [ ] Role assignment procedures
- [ ] Access review schedule
- [ ] Offboarding procedures
- [ ] Emergency access procedures

## Vulnerability Reporting

### Reporting Process
1. **Do not** open a public issue
2. **Do not** disclose vulnerability details publicly
3. **Email** security details to: security@scanroll.dev
4. **Include** in your report:
   - Vulnerability description
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if known)

### Response Timeline
- **Initial Response**: 48 hours
- **Assessment**: 7 days
- **Fix Timeline**: Depends on severity
- **Public Disclosure**: After fix is deployed

### Severity Classification
- **Critical**: Remote code execution, data breach
- **High**: Privilege escalation, significant data exposure
- **Medium**: Limited data exposure, system impact
- **Low**: Information disclosure, minor issues

## Disclosure Policy

### Coordinated Disclosure
We follow responsible disclosure principles:
- Work with reporters to understand and validate vulnerabilities
- Provide timeline for remediation
- Credit researchers in security advisories
- Public disclosure after fixes are deployed

### Security Advisories
- Published for all resolved security issues
- Include vulnerability description and impact
- Provide upgrade guidance
- Credit to reporting researchers

### Security Updates
- Security patches released promptly
- Version bumping for security fixes
- Clear communication of upgrade requirements
- Backport considerations for supported versions

## Security Best Practices

### For Developers
- Review all code changes for security implications
- Follow principle of least privilege
- Validate all user inputs
- Use parameterized queries
- Implement proper error handling

### For Administrators
- Regular security audits
- Keep dependencies updated
- Monitor system logs
- Review access permissions
- Test backup and recovery procedures

### For Users
- Use strong, unique passwords
- Enable two-factor authentication when available
- Report suspicious activity
- Keep software updated
- Follow security best practices

## Additional Resources

- [Security Model Documentation](./docs/SECURITY_MODEL.md)
- [Production Checklist](./PRODUCTION_CHECKLIST.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Privacy Policy](./docs/PRIVACY.md)

For questions about security, contact: security@scanroll.dev
