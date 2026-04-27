import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-7">
          <BrandMark />
          <h1 className="mt-8 text-2xl font-bold text-slate-950">Reset password</h1>
          <p className="mt-2 text-sm text-slate-500">Enter your college email to receive a secure reset link.</p>
          <div className="mt-6 space-y-4">
            <Input placeholder="name@college.edu" type="email" />
            <Button className="w-full">Send reset link</Button>
            <Button asChild className="w-full" variant="ghost">
              <Link href="/login">Back to login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
