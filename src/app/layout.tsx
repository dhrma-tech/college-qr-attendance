import type { Metadata } from "next";
import "@/app/globals.css";
import { collegeConfig } from "../../college.config";

export const metadata: Metadata = {
  title: `${collegeConfig.name} QR Attendance`,
  description: "Secure QR attendance for students, teachers, HODs, and college administrators."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
