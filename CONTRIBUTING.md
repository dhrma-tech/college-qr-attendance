# Contributing to ScanRoll

Thanks for your interest in contributing to ScanRoll! This document provides guidelines for contributing to this open-source QR Code Attendance System for colleges.

## Table of Contents

- [Development Workflow](#development-workflow)
- [Local Development Setup](#local-development-setup)
- [Branch Naming and Git Workflow](#branch-naming-and-git-workflow)
- [Code Quality and Standards](#code-quality-and-standards)
- [Testing Guidelines](#testing-guidelines)
- [Security Guidelines](#security-guidelines)
- [Database Changes](#database-changes)
- [Documentation Requirements](#documentation-requirements)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## Development Workflow

### 1. Fork and Clone
```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/your-username/ScanRoll.git
cd ScanRoll

# Add the original repository as upstream
git remote add upstream https://github.com/dhrma-tech/ScanRoll.git
```

### 2. Create a Feature Branch
```bash
# Sync with main branch
git checkout main
git pull upstream main

# Create a new feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Development and Testing
- Make your changes
- Run all checks locally
- Test thoroughly
- Commit with clear messages

### 4. Pull Request
- Push to your fork
- Create a pull request
- Wait for review and merge

## Local Development Setup

### Prerequisites
- Node.js 18.x or 20.x
- npm or yarn
- Git
- VS Code (recommended)

### Setup Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Configuration**
```bash
# Copy environment template
cp .env.example .env.local

# For local development, you can run in demo mode (leave Supabase variables empty)
# For full functionality, configure Supabase settings
```

3. **Run Development Server**
```bash
npm run dev
```

4. **Run Quality Checks**
```bash
# Lint code
npm run lint

# Type checking
npm run typecheck

# Build application
npm run build

# Run tests
npm run test:run
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage
- `npm run audit` - Run security audit

## Branch Naming and Git Workflow

### Branch Naming Convention
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation changes
- `refactor/code-refactoring` - Code refactoring
- `security/security-fix` - Security fixes
- `test/test-improvements` - Test improvements

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `security`: Security changes
- `chore`: Maintenance tasks

**Examples:**
```
feat(attendance): add geofencing validation

fix(validation): prevent SQL injection in attendance marking

security(auth): implement rate limiting on signup endpoint
```

## Code Quality and Standards

### Code Style
- Use TypeScript for all new code
- Follow existing code patterns and conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Import Organization
```typescript
// External libraries first
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Internal modules
import { validateInput } from '@/lib/validation';
import { createUser } from '@/lib/users';
```

### Error Handling
- Use proper error types
- Include meaningful error messages
- Don't expose sensitive information
- Log errors appropriately

### Performance
- Avoid unnecessary database queries
- Use efficient data structures
- Implement caching where appropriate
- Optimize for mobile devices

## Testing Guidelines

### Test Structure
```typescript
// src/test/validation.test.ts
import { describe, it, expect } from 'vitest';
import { validateEmail } from '@/lib/validation';

describe('Email Validation', () => {
  it('should validate valid email addresses', () => {
    expect(validateEmail('test@example.com')).toBe('test@example.com');
  });

  it('should reject invalid email addresses', () => {
    expect(() => validateEmail('invalid')).toThrow('Invalid email format');
  });
});
```

### Test Categories
1. **Unit Tests** - Test individual functions and components
2. **Integration Tests** - Test API routes and database interactions
3. **Security Tests** - Test validation and authorization
4. **E2E Tests** - Test complete user flows (planned)

### Coverage Requirements
- Aim for >70% code coverage
- Critical security functions must have 100% coverage
- All API endpoints must have tests
- Validation schemas must be thoroughly tested

## Security Guidelines

### ⚠️ Critical Security Rules

1. **Never expose service role key**
   - Never prefix with `NEXT_PUBLIC_`
   - Never use in client-side code
   - Never commit to version control

2. **Validate all inputs**
   - Use validation schemas for all API endpoints
   - Never trust client-side data
   - Implement proper error handling

3. **Follow principle of least privilege**
   - Use RLS policies properly
   - Implement role-based access control
   - Minimize data exposure

4. **No real data in repository**
   - Never commit real student data
   - Never commit credentials
   - Use mock/demo data only

### Security Review Checklist
- [ ] Input validation implemented
- [ ] Authentication/authorization checks
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] Rate limiting implemented
- [ ] Error messages don't leak information
- [ ] Sensitive data properly handled

### Reporting Security Issues
If you discover a security vulnerability:
1. **Do not** open a public issue
2. Email security@scanroll.dev
3. Include detailed description and reproduction steps
4. Wait for coordinated disclosure

## Database Changes

### Migration Process
1. Create new migration file in `supabase/migrations/`
2. Use sequential numbering: `0006_feature_name.sql`
3. Include rollback comments
4. Test migrations thoroughly
5. Update documentation

### Migration Template
```sql
-- Migration: Add feature description
-- Version: 0006_feature_name.sql
-- Author: Your Name
-- Date: YYYY-MM-DD

-- Add your SQL here

-- Rollback: DROP TABLE IF EXISTS new_table;
```

### RLS Policy Changes
- All new tables must have RLS enabled
- Implement comprehensive policies
- Test policies with different roles
- Document policy purposes
- Add policy testing

## Documentation Requirements

### Code Documentation
- Document complex functions
- Add JSDoc comments for public APIs
- Explain security-critical code
- Include usage examples

### README Updates
- Update feature lists
- Document breaking changes
- Update setup instructions
- Add troubleshooting information

### API Documentation
- Document new endpoints
- Include request/response examples
- Document authentication requirements
- Add error code documentation

## Pull Request Process

### Before Submitting
1. **Run all checks**
```bash
npm run lint
npm run typecheck
npm run test:run
npm run build
```

2. **Update documentation**
- README.md if needed
- API documentation
- Security documentation

3. **Test thoroughly**
- Manual testing
- Automated tests
- Security testing

### PR Template
Use the provided PR template and include:
- Clear description of changes
- Testing performed
- Security considerations
- Breaking changes (if any)
- Screenshots (if UI changes)

### Review Process
1. **Automated checks** must pass
2. **Security review** for sensitive changes
3. **Code review** by maintainers
4. **Testing review** for test coverage
5. **Documentation review** for docs updates

### Merge Requirements
- All checks must pass
- At least one approval required
- Security changes require additional review
- Documentation must be updated

## Issue Reporting

### Bug Reports
Use the bug report template and include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots if applicable
- Security impact (if any)

### Feature Requests
Use the feature request template and include:
- Clear description of the feature
- Problem it solves
- Proposed implementation
- Alternative approaches considered
- Security implications
- Impact on existing features

### Security Issues
For security vulnerabilities:
- Email security@scanroll.dev
- Do not use public issue tracker
- Include detailed reproduction steps
- Wait for coordinated disclosure

## Getting Help

### Resources
- [README.md](./README.md) - General project information
- [SECURITY.md](./SECURITY.md) - Security guidelines
- [docs/SECURITY_MODEL.md](./docs/SECURITY_MODEL.md) - Security model
- [SETUP.md](./SETUP.md) - Setup instructions

### Community
- GitHub Discussions for questions
- Issues for bug reports and feature requests
- Security email for security concerns

### Code of Conduct
Please follow our [Code of Conduct](./CODE_OF_CONDUCT.md) in all interactions.

## Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- GitHub contributor statistics

Thank you for contributing to ScanRoll! 🎉
