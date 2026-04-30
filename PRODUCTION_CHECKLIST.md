# Production Deployment Checklist

This checklist must be completed before deploying ScanRoll to production with real student data.

## ⚠️ Critical Security Requirements

### Environment Configuration
- [ ] **Supabase Environment Variables Configured**
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` set to production Supabase URL
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set to production anon key
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` set to production service role key
  - [ ] **Critical**: Service role key is NOT prefixed with `NEXT_PUBLIC_`
  - [ ] **Critical**: No placeholder values (example.supabase.co, demo-anon-key)

- [ ] **Environment Validation Enabled**
  - [ ] Environment validation throws errors in production
  - [ ] Demo mode disabled in production
  - [ ] Service role key validation working
  - [ ] Client-side safety checks implemented

### Database Security
- [ ] **RLS Policies Implemented and Tested**
  - [ ] All tables have RLS enabled
  - [ ] College scoping enforced for all users
  - [ ] Department scoping for HODs
  - [ ] Teacher scoping for assigned subjects/sessions
  - [ ] Student self-access only
  - [ ] Audit logs admin-only access
  - [ ] No broad public policies

- [ ] **Database Constraints**
  - [ ] Foreign key constraints enforced
  - [ ] Check constraints for coordinates and radius
  - [ ] Unique constraints for critical fields
  - [ ] Not null constraints where required

### Authentication & Authorization
- [ ] **Supabase Auth Configuration**
  - [ ] Auth providers configured correctly
  - [ ] JWT settings appropriate for production
  - [ ] Session timeout configured
  - [ ] Password policies enforced

- [ ] **Role-based Access Control**
  - [ ] Student, Teacher, HOD, Admin roles properly defined
  - [ ] Role verification in all API routes
  - [ ] College/department membership validation
  - [ ] Session management secure

## 🔒 Security Hardening

### API Security
- [ ] **Input Validation**
  - [ ] All API endpoints use validation schemas
  - [ ] Field length limits enforced
  - [ ] Type checking implemented
  - [ ] Email format validation
  - [ ] UUID format validation
  - [ ] Mobile number validation
  - [ ] Coordinate range validation

- [ ] **Rate Limiting**
  - [ ] Rate limiting implemented on all critical endpoints
  - [ ] `/api/signup`: 5 requests per 15 minutes
  - [ ] `/api/attendance/mark`: 30 requests per minute
  - [ ] `/api/attendance/override`: 20 requests per 5 minutes
  - [ ] `/api/sessions/start`: 10 requests per 5 minutes
  - [ ] `/api/reports/attendance`: 10 requests per minute
  - [ ] IP-based and user-based limiting

- [ ] **Error Handling**
  - [ ] Generic error messages (no sensitive data exposure)
  - [ ] Proper HTTP status codes
  - [ ] Error logging without sensitive information
  - [ ] Database error handling

### Data Protection
- [ ] **Service Role Key Security**
  - [ ] Never exposed to client-side code
  - [ ] Only used in server-side API routes
  - [ ] Proper validation before service role operations
  - [ ] Audit logging for service role usage

- [ ] **Data Privacy**
  - [ ] PII minimization in exports
  - [ ] CSV formula injection protection
  - [ ] Report data properly scoped by role
  - [ ] Export audit logging
  - [ ] Data retention policies defined

## 🗄️ Database Setup

### Migration Process
- [ ] **Fresh Database Migration Tested**
  - [ ] All migrations run successfully on fresh database
  - [ ] Migration order verified
  - [ ] Rollback procedures tested
  - [ ] No migration errors

- [ ] **Seed Data Management**
  - [ ] No real student/teacher data in seed files
  - [ ] Demo data clearly marked as such
  - [ ] Admin bootstrap process documented
  - [ ] Test users removed for production

### Performance & Reliability
- [ ] **Indexes Optimized**
  - [ ] Foreign key indexes present
  - [ ] Query performance indexes added
  - [ ] RLS policy indexes optimized
  - [ ] No missing indexes affecting performance

- [ ] **Backup Strategy**
  - [ ] Automated daily backups configured
  - [ ] Point-in-time recovery enabled
  - [ ] Backup restoration tested
  - [ ] Offsite backup storage

## 🚀 Application Configuration

### Production Build
- [ ] **Build Process**
  - [ ] `npm run build` completes successfully
  - [ ] No build warnings or errors
  - [ ] Production optimizations enabled
  - [ ] Source maps excluded from production

- [ ] **Environment Variables**
  - [ ] All required variables set
  - [ ] No development variables in production
  - [ ] Secure variable management
  - [ ] Variable validation working

### Infrastructure
- [ ] **HTTPS Configuration**
  - [ ] SSL/TLS certificate valid and properly configured
  - [ ] HTTP redirects to HTTPS
  - [ ] Secure headers implemented
  - [ ] HSTS policy configured

- [ ] **CORS Configuration**
  - [ ] CORS properly configured for production domain
  - [ ] No overly permissive CORS policies
  - [ ] Development origins removed

## 📊 Monitoring & Logging

### Application Monitoring
- [ ] **Error Tracking**
  - [ ] Error logging implemented
  - [ ] Performance monitoring
  - [ ] Uptime monitoring
  - [ ] Alert thresholds configured

- [ ] **Security Monitoring**
  - [ ] Failed login attempt monitoring
  - [ ] Rate limiting breach alerts
  - [ ] Suspicious activity detection
  - [ ] Security event logging

### Audit Trail
- [ ] **Comprehensive Logging**
  - [ ] All sensitive operations logged
  - [ ] User action audit trail
  - [ ] Data access logging
  - [ ] Configuration changes logged

## 🧪 Testing & Validation

### Pre-deployment Testing
- [ ] **Functional Testing**
  - [ ] All user workflows tested
  - [ ] QR attendance flow tested end-to-end
  - [ ] Report generation tested
  - [ ] User management tested

- [ ] **Security Testing**
  - [ ] Authentication flow tested
  - [ ] Authorization boundaries tested
  - [ ] Input validation tested
  - [ ] Rate limiting tested

### Load Testing
- [ ] **Performance Testing**
  - [ ] Concurrent user load testing
  - [ ] Database performance under load
  - [ ] API response time testing
  - ] Memory usage monitoring

## 📋 Administrative Setup

### User Management
- [ ] **Admin Account Bootstrap**
  - [ ] Initial admin account created
  - [ ] Admin password reset process
  - [ ] Multi-factor authentication enabled
  - [ ] Admin access logging

- [ ] **Role Assignment Process**
  - [ ] Teacher onboarding process defined
  - [ ] HOD assignment process
  - [ ] Student enrollment process
  - [ ] Access review schedule

### Compliance & Legal
- [ ] **Privacy Compliance**
  - [ ] Privacy policy reviewed and approved
  - [ ] Data retention policies defined
  - [ ] User consent mechanisms implemented
  - [ ] GDPR/FERPA compliance verified

- [ ] **Legal Requirements**
  - [ ] Terms of service reviewed
  - [ ] Disclaimer notices added
  - [ ] Contact information updated
  - [ ] Legal disclaimers in place

## 🔧 Operations

### Deployment Process
- [ ] **Deployment Pipeline**
  - [ ] Automated deployment tested
  - [ ] Rollback procedures tested
  - [ ] Blue-green deployment capability
  - [ ] Zero-downtime deployment

- [ ] **Maintenance Procedures**
  - [ ] Update procedures documented
  - [ ] Maintenance windows defined
  - [ ] Emergency procedures in place
  - [ ] Support contact information

### Documentation
- [ ] **User Documentation**
  - [ ] User guides updated for production
  - [ ] Admin documentation complete
  - [ ] Troubleshooting guide available
  - [ ] FAQ section updated

## ✅ Final Verification

### Security Review
- [ ] **Security Audit Completed**
  - [ ] Penetration testing performed
  - [ ] Vulnerability scan completed
  - [ ] Security review checklist signed off
  - [ ] Third-party security assessment (if required)

### Production Readiness
- [ ] **Go/No-Go Decision**
  - [ ] All checklist items completed
  - [ ] Stakeholder approval obtained
  - [ ] Risk assessment completed
  - [ ] Launch plan approved

### Post-deployment
- [ ] **Monitoring Setup**
  - [ ] Production monitoring active
  - [ ] Alert notifications configured
  - [ ] Performance baselines established
  - [ ] Support team trained

---

## 📞 Emergency Contacts

- **Security Issues**: security@scanroll.dev
- **Technical Support**: support@scanroll.dev
- **Legal/Privacy**: privacy@scanroll.dev

## 📚 Related Documentation

- [SECURITY.md](./SECURITY.md) - Security model and requirements
- [docs/SECURITY_MODEL.md](./docs/SECURITY_MODEL.md) - Detailed security model
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Development guidelines
- [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md) - Release preparation

---

⚠️ **WARNING**: Do not deploy to production with real student data until ALL items in this checklist are completed and verified. Failure to complete security requirements may result in data breaches, privacy violations, and legal consequences.
