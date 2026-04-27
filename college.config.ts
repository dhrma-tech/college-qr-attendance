export const collegeConfig = {
  name: process.env.NEXT_PUBLIC_COLLEGE_NAME || "Riverside Institute of Technology",
  code: "RIT",
  address: "Main Campus, Knowledge Park",
  attendanceThreshold: Number(process.env.NEXT_PUBLIC_ATTENDANCE_THRESHOLD || 75),
  qrRotationInterval: Number(process.env.NEXT_PUBLIC_QR_ROTATION_INTERVAL || 30),
  geofenceRadiusMeters: Number(process.env.NEXT_PUBLIC_GEOFENCE_RADIUS || 100),
  allowSelfRegistration: false,
  currentAcademicYear: "2026-27",
  currentSemester: "Semester 5",
  branding: {
    primary: "#1A56DB",
    accent: "#F59E0B"
  }
};
