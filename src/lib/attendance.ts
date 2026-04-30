import { collegeConfig } from "../../college.config";

export function createScanUrl(token: string) {
  return `/scan/${token}`;
}

export function getQrExpiryLabel() {
  return `Rotates every ${collegeConfig.qrRotationInterval}s`;
}

export function validateScanToken(token: string) {
  return {
    ok: token.length > 8,
    sessionId: "session-demo-001",
    subject: "Database Management Systems",
    message: token.length > 8 ? "Attendance marked successfully." : "Session expired or invalid token."
  };
}
