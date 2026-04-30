export const collegeConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "ScanRoll",
  code: "SCANROLL",
  address: "Demo College Campus",
  attendanceThreshold: Number(process.env.NEXT_PUBLIC_ATTENDANCE_THRESHOLD || 75),
  qrRotationInterval: Number(process.env.NEXT_PUBLIC_QR_ROTATION_INTERVAL || 30),
  geofenceRadiusMeters: Number(process.env.NEXT_PUBLIC_GEOFENCE_RADIUS || 100),
  allowSelfRegistration: false,
  currentAcademicYear: "2026-27",
  currentSemester: "Semester 5",
  branding: {
    primary: "#087F7A",
    accent: "#D7E86F"
  }
};
