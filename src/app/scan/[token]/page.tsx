import { ScanAttendanceClient } from "@/components/scan-attendance-client";

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <ScanAttendanceClient token={token} />;
}
