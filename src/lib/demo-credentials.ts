import type { Role } from "@/lib/types";

export type DemoCredential = {
  role: Role;
  name: string;
  email: string;
  target: string;
};

export const demoCredentials: Record<Role, DemoCredential> = {
  student: {
    role: "student",
    name: "Aarav Patil",
    email: "student@scanroll.demo",
    target: "/dashboard"
  },
  teacher: {
    role: "teacher",
    name: "Prof. Meera Sharma",
    email: "teacher@scanroll.demo",
    target: "/teacher/dashboard"
  },
  hod: {
    role: "hod",
    name: "Dr. Rohan Deshmukh",
    email: "hod@scanroll.demo",
    target: "/hod/dashboard"
  },
  admin: {
    role: "admin",
    name: "ScanRoll Admin",
    email: "admin@scanroll.demo",
    target: "/admin/dashboard"
  }
};

export function validateDemoCredential(role: Role, email: string) {
  const credential = demoCredentials[role];
  return credential.email.toLowerCase() === email.trim().toLowerCase();
}
