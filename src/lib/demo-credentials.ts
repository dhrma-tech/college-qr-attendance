import type { Role } from "@/lib/types";

export type DemoCredential = {
  role: Role;
  name: string;
  email: string;
  password: string;
  target: string;
};

export const demoCredentials: Record<Role, DemoCredential> = {
  student: {
    role: "student",
    name: "Aarav Patil",
    email: "student@college.edu",
    password: "Student@123",
    target: "/dashboard"
  },
  teacher: {
    role: "teacher",
    name: "Prof. Meera Sharma",
    email: "teacher@college.edu",
    password: "Teacher@123",
    target: "/teacher/dashboard"
  },
  hod: {
    role: "hod",
    name: "Dr. Rohan Deshmukh",
    email: "hod@college.edu",
    password: "Hod@123",
    target: "/hod/dashboard"
  },
  admin: {
    role: "admin",
    name: "College Admin",
    email: "admin@college.edu",
    password: "Admin@123",
    target: "/admin/dashboard"
  }
};

export function validateDemoCredential(role: Role, email: string, password: string) {
  const credential = demoCredentials[role];
  return credential.email.toLowerCase() === email.trim().toLowerCase() && credential.password === password;
}
