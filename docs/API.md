# ScanRoll API Documentation

This document provides comprehensive API documentation for the ScanRoll QR Code Attendance System.

## 📋 Table of Contents

- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [API Endpoints](#api-endpoints)
- [Error Responses](#error-responses)
- [Data Models](#data-models)
- [Security Considerations](#security-considerations)

## 🔐 Authentication

All API endpoints (except `/api/signup`) require authentication via Supabase Auth. The authentication token should be included in the `Authorization` header:

```http
Authorization: Bearer <supabase_jwt_token>
```

### Authentication Flow
1. User signs in via Supabase Auth
2. JWT token is returned
3. Token included in API requests
4. Server validates token and extracts user information
5. Role-based access control applied

### User Roles
- **student**: Can view own profile, mark attendance, view own reports
- **teacher**: Can manage assigned classes, start sessions, view class reports
- **hod**: Can view department-wide data, manage department users
- **admin**: Can manage college-wide settings, view all data

## 🚦 Rate Limiting

All API endpoints are rate-limited to prevent abuse:

| Endpoint | Limit | Duration | Type |
|----------|-------|----------|------|
| `/api/signup` | 5 requests | 15 minutes | IP-based |
| `/api/attendance/mark` | 30 requests | 1 minute | IP + User |
| `/api/attendance/override` | 20 requests | 5 minutes | IP + User |
| `/api/sessions/start` | 10 requests | 5 minutes | IP + User |
| `/api/sessions/[id]/rotate` | 60 requests | 1 minute | IP + User |
| `/api/reports/attendance` | 10 requests | 1 minute | IP + User |

Rate limit responses:
```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 900
}
```

## 🔗 API Endpoints

### User Management

#### POST /api/signup
Create a new user signup request (public endpoint).

**Request Body:**
```json
{
  "requestedRole": "student|teacher|hod",
  "fullName": "string (max 100)",
  "email": "valid email",
  "mobileNumber": "valid mobile number",
  "year": "number (students only)",
  "semester": "1|2|3|4|5|6|7|8 (students only)",
  "rollNumber": "string (students only)",
  "employeeId": "string (teachers/hod only)",
  "designation": "string (teachers/hod only)",
  "subjectsTaught": ["string"] (teachers only),
  "collegeId": "uuid (optional)",
  "departmentId": "uuid (optional)"
}
```

**Response:**
```json
{
  "status": "pending",
  "message": "Signup request submitted successfully",
  "requestId": "uuid"
}
```

**Rate Limiting:** 5 requests per 15 minutes per IP

### Attendance Sessions

#### POST /api/sessions/start
Start a new attendance session.

**Authentication:** Required (Teacher, HOD, Admin)

**Request Body:**
```json
{
  "subjectAssignmentId": "uuid",
  "latitude": "number (-90 to 90)",
  "longitude": "number (-180 to 180)",
  "radiusMeters": "number (1 to 10000)"
}
```

**Response:**
```json
{
  "id": "uuid",
  "qrToken": "uuid",
  "qrExpiresAt": "ISO datetime",
  "status": "active",
  "subjectAssignmentId": "uuid",
  "teacherId": "uuid"
}
```

#### POST /api/sessions/[id]/rotate
Rotate QR token for an existing session.

**Authentication:** Required (Teacher, HOD, Admin)

**Response:**
```json
{
  "id": "uuid",
  "qrToken": "uuid",
  "qrExpiresAt": "ISO datetime",
  "status": "active"
}
```

#### POST /api/sessions/[id]/end
End an attendance session.

**Authentication:** Required (Teacher, HOD, Admin)

**Response:**
```json
{
  "id": "uuid",
  "status": "closed",
  "endTime": "ISO datetime"
}
```

### Attendance Management

#### POST /api/attendance/mark
Mark attendance for a student.

**Authentication:** Required (Student)

**Request Body:**
```json
{
  "token": "uuid",
  "latitude": "number (-90 to 90)",
  "longitude": "number (-180 to 180)",
  "deviceFingerprint": "string (max 255)",
  "studentId": "uuid (demo mode only)"
}
```

**Response:**
```json
{
  "status": "present|flagged",
  "sessionId": "uuid",
  "recordId": "uuid",
  "distanceMeters": "number",
  "radiusMeters": "number"
}
```

#### POST /api/attendance/override
Override attendance record.

**Authentication:** Required (Teacher, HOD, Admin)

**Request Body:**
```json
{
  "recordId": "uuid",
  "status": "present|absent|late|excused",
  "reason": "string (min 5, max 500)",
  "actorId": "uuid (demo mode only)"
}
```

**Response:**
```json
{
  "id": "uuid",
  "status": "present|absent|late|excused",
  "overrideReason": "string",
  "overrideBy": "uuid",
  "message": "Attendance override completed successfully"
}
```

### Reports

#### GET /api/reports/attendance
Generate attendance reports.

**Authentication:** Required (Student, Teacher, HOD, Admin)

**Query Parameters:**
- `startDate`: YYYY-MM-DD (optional)
- `endDate`: YYYY-MM-DD (optional)
- `subjectId`: UUID (optional)
- `classId`: UUID (optional)
- `studentId`: UUID (optional, students can only use own ID)
- `format`: json|csv|pdf (default: json)
- `limit`: number (1-1000, default: 100)
- `offset`: number (default: 0)

**Response (JSON):**
```json
{
  "rows": [
    {
      "studentId": "uuid",
      "studentName": "string",
      "rollNumber": "string",
      "subjectName": "string",
      "presentCount": "number",
      "absentCount": "number",
      "lateCount": "number",
      "totalRecords": "number",
      "attendancePercentage": "number"
    }
  ],
  "meta": {
    "recordCount": "number",
    "role": "student|teacher|hod|admin",
    "exportedAt": "ISO datetime"
  }
}
```

**Response (CSV/PDF):** Binary file download with appropriate headers

## ❌ Error Responses

All endpoints return consistent error responses:

### Validation Errors (400)
```json
{
  "error": "Invalid input data",
  "details": "Email format is invalid",
  "field": "email"
}
```

### Authentication Errors (401)
```json
{
  "error": "Authentication required"
}
```

### Authorization Errors (403)
```json
{
  "error": "Access denied: Subject not assigned to this teacher"
}
```

### Not Found Errors (404)
```json
{
  "error": "Attendance record not found"
}
```

### Conflict Errors (409)
```json
{
  "error": "Attendance already marked for this session"
}
```

### Rate Limit Errors (429)
```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 900
}
```

### Server Errors (500)
```json
{
  "error": "Unable to process request at this time"
}
```

## 📊 Data Models

### User
```typescript
interface User {
  id: string;
  collegeId: string;
  departmentId?: string;
  role: 'student' | 'teacher' | 'hod' | 'admin';
  name: string;
  email: string;
  phone?: string;
  rollNumber?: string;
  employeeId?: string;
  profilePhotoUrl?: string;
  isActive: boolean;
  createdAt: string;
}
```

### Attendance Session
```typescript
interface AttendanceSession {
  id: string;
  subjectAssignmentId: string;
  teacherId: string;
  date: string;
  startTime: string;
  endTime?: string;
  qrToken: string;
  qrExpiresAt: string;
  latitude?: number;
  longitude?: number;
  radiusMeters: number;
  status: 'active' | 'closed' | 'cancelled';
  createdAt: string;
}
```

### Attendance Record
```typescript
interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  markedAt: string;
  latitude?: number;
  longitude?: number;
  deviceFingerprint?: string;
  ipAddress?: string;
  isProxyFlagged: boolean;
  manuallyOverridden: boolean;
  overrideReason?: string;
  overrideBy?: string;
}
```

### Subject Assignment
```typescript
interface SubjectAssignment {
  id: string;
  subjectId: string;
  teacherId: string;
  academicYear: string;
  semester: number;
  section: string;
}
```

## 🔒 Security Considerations

### Input Validation
All API endpoints implement comprehensive input validation:
- Field length limits enforced
- Type checking performed
- Format validation (email, UUID, coordinates)
- SQL injection prevention
- XSS prevention

### Authentication & Authorization
- JWT token validation
- Role-based access control
- College/department scoping
- Session management
- Rate limiting

### Data Protection
- PII minimization in exports
- Generic error messages
- Audit logging for sensitive operations
- Service role key protection

### Rate Limiting
- IP-based limiting for anonymous requests
- User-based limiting for authenticated requests
- Configurable limits per endpoint
- Memory-based storage (production should use Redis)

## 🧪 Testing

### API Testing Examples

#### Signup Request
```bash
curl -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "requestedRole": "student",
    "fullName": "John Doe",
    "email": "john@example.com",
    "mobileNumber": "+1234567890",
    "year": 2023,
    "semester": "1",
    "rollNumber": "CS2023001"
  }'
```

#### Start Session (Authenticated)
```bash
curl -X POST http://localhost:3000/api/sessions/start \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "subjectAssignmentId": "123e4567-e89b-12d3-a456-426614174000",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "radiusMeters": 100
  }'
```

#### Mark Attendance (Authenticated)
```bash
curl -X POST http://localhost:3000/api/attendance/mark \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "123e4567-e89b-12d3-a456-426614174001",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "deviceFingerprint": "device-123"
  }'
```

## 📚 Additional Resources

- [SECURITY.md](../SECURITY.md) - Security model and requirements
- [docs/SECURITY_MODEL.md](./SECURITY_MODEL.md) - Detailed security model
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Development guidelines
- [PRODUCTION_CHECKLIST.md](../PRODUCTION_CHECKLIST.md) - Production requirements

---

⚠️ **Security Note**: This API handles sensitive student data. Ensure all security requirements are met before deploying to production.
