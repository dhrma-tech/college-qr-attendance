import { QrCodePanel } from "@/components/qr-code-panel";

export default function Page({ params }: { params: { id: string } }) {
  return <QrCodePanel token={params.id} />;
}
