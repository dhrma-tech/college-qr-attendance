## 📝 Description

Please provide a clear and concise description of your changes. What does this PR do? Why is it needed?

## 🔗 Related Issues

Link to any related issues or pull requests:
- Closes #
- Related to #

## 🧪 Testing

### Manual Testing
- [ ] Tested in demo mode
- [ ] Tested with connected Supabase (if applicable)
- [ ] Tested across different user roles (Student/Teacher/HOD/Admin)
- [ ] Tested on different browsers (Chrome/Firefox/Safari)

### Automated Testing
- [ ] All existing tests pass
- [ ] Added new unit tests for new functionality
- [ ] Added new integration tests for API changes
- [ ] Added security tests for validation changes
- [ ] Test coverage meets requirements (>70%)

## 🔒 Security Checklist

### Critical Security Requirements
- [ ] No service role key exposure to client-side
- [ ] Input validation implemented for all new endpoints
- [ ] RLS policies updated for any database changes
- [ ] Rate limiting implemented for sensitive operations
- [ ] Error messages don't expose sensitive information

### Data Protection
- [ ] No real student/teacher data committed
- [ ] No secrets, API keys, or passwords committed
- [ ] PII minimization in exports/reports
- [ ] Proper audit logging for sensitive operations

### Authentication & Authorization
- [ ] Role-based access control implemented
- [ ] Proper user verification in API routes
- [ ] Session management security maintained
- [ ] College/department scoping enforced

## 🗄️ Database Checklist

### Schema Changes
- [ ] Database migrations created and tested
- [ ] RLS policies implemented for new tables
- [ ] Indexes added for performance
- [ ] Rollback scripts documented
- [ ] Migration tested on fresh database

### Data Integrity
- [ ] Foreign key constraints maintained
- [ ] Data validation implemented
- [ ] Backup/restore procedures tested
- [ ] No breaking changes to existing data

## 🏗️ Code Quality

### Development Standards
- [ ] Code follows existing patterns and conventions
- [ ] TypeScript types properly defined
- [ ] Error handling implemented appropriately
- [ ] Code is well-documented with comments
- [ ] Functions are small and focused

### Performance
- [ ] No unnecessary database queries
- [ ] Efficient data structures used
- [ ] No memory leaks or performance regressions
- [ ] Mobile performance considered

## 📚 Documentation

### Code Documentation
- [ ] Complex functions documented with JSDoc
- [ ] Security-critical code explained
- [ ] API endpoints documented
- [ ] Database changes documented

### User Documentation
- [ ] README.md updated (if needed)
- [ ] API documentation updated
- [ ] Security documentation updated
- [ ] Setup instructions updated

## 🚀 Build & Deployment

### Local Development
- [ ] `npm run lint` passes without errors
- [ ] `npm run typecheck` passes without errors
- [ ] `npm run build` completes successfully
- [ ] `npm run test:run` passes
- [ ] `npm run audit` passes (no high vulnerabilities)

### Production Readiness
- [ ] Environment variables documented
- [ ] Configuration changes documented
- [ ] Migration procedures documented
- [ ] Rollback procedures documented

## 🔄 Breaking Changes

- [ ] No breaking changes to existing functionality
- [ ] Migration path documented for breaking changes
- [ ] Backward compatibility maintained where possible
- [ ] Deprecation notices added if needed

## 📋 Review Requirements

### Before Submitting
- [ ] All automated checks pass
- [ ] Security review completed for sensitive changes
- [ ] Database review completed for schema changes
- [ ] Documentation review completed
- [ ] Testing review completed

### Review Process
- [ ] Code reviewed by at least one maintainer
- [ ] Security review for authentication/authorization changes
- [ ] Database review for RLS policy changes
- [ ] Documentation review for API changes

## 📸 Screenshots

If this PR includes UI changes, please add screenshots:

### Before
[Add screenshots before changes]

### After
[Add screenshots after changes]

## 🔗 Additional Resources

Link to any relevant documentation, designs, or references:
- [Figma designs]()
- [API documentation]()
- [Security model documentation]()

## 🏷️ Labels

Add appropriate labels:
- `security` for security-related changes
- `database` for database schema changes
- `api` for API endpoint changes
- `ui` for user interface changes
- `documentation` for documentation updates
- `performance` for performance improvements
- `breaking-change` for breaking changes

## ✅ Final Confirmation

By submitting this PR, I confirm that:
- [ ] I have read and followed the contributing guidelines
- [ ] I have tested my changes thoroughly
- [ ] I have considered the security implications
- [ ] I have documented my changes appropriately
- [ ] I am confident this PR is ready for review and merge
