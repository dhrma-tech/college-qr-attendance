import { BookOpen, Building2, Clock3, GraduationCap, Link2, ListChecks, QrCode, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const structureGroups = [
  { title: "Department list", icon: Building2, items: ["Computer Science", "Electronics", "Mechanical"] },
  { title: "Branch list", icon: GraduationCap, items: ["CSE", "AIML", "ECE"] },
  { title: "Year list", icon: ListChecks, items: ["1st Year", "2nd Year", "3rd Year", "4th Year"] },
  { title: "Semester list", icon: BookOpen, items: ["Semester 1", "Semester 2", "Semester 3", "Semester 4"] },
  { title: "Division / section list", icon: Users, items: ["A", "B", "C"] },
  { title: "Subject list", icon: BookOpen, items: ["DBMS", "Networks", "Web Engineering"] }
];

const mappingGroups = [
  "Teacher-subject mapping",
  "Teacher-class mapping",
  "Student-class mapping",
  "Timetable"
];

export function AdminStructureManager() {
  return (
    <div className="space-y-6">
      <Card className="border-ink bg-ink text-white">
        <CardContent className="grid gap-4 p-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-citron">Account approval data</p>
            <h2 className="mt-3 text-4xl font-normal text-white">Configure the college structure before approving users.</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-white/60">
              Signup requests should be mapped to departments, branches, classes, subjects, timetable slots, and attendance rules before activation.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="College name" className="border-white/15 bg-white text-ink" />
            <Input placeholder="Current academic year" className="border-white/15 bg-white text-ink" />
            <Input placeholder="Lecture duration minutes" className="border-white/15 bg-white text-ink" />
            <Input placeholder="QR expiry seconds" className="border-white/15 bg-white text-ink" />
          </div>
        </CardContent>
      </Card>

      <section>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-teal">Academic structure</p>
            <h2 className="mt-2 text-2xl font-black text-ink">Lists managed by admin</h2>
          </div>
          <Button>Add item</Button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {structureGroups.map((group) => (
            <Card key={group.title} className="border-ink/10">
              <CardContent className="p-5">
                <group.icon className="h-6 w-6 text-teal" />
                <h3 className="mt-4 font-black text-ink">{group.title}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Badge key={item} tone="muted">{item}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-ink/10">
          <CardHeader>
            <CardTitle>Mappings</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {mappingGroups.map((mapping) => (
              <div key={mapping} className="flex items-center justify-between rounded-xl border border-ink/10 bg-paper p-4">
                <div className="flex items-center gap-3">
                  <Link2 className="h-5 w-5 text-teal" />
                  <span className="font-black text-ink">{mapping}</span>
                </div>
                <Badge tone="warning">Needs data</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-ink/10">
          <CardHeader>
            <CardTitle>Attendance Rules</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <RuleInput icon={Clock3} label="Late mark after" value="10 minutes" />
            <RuleInput icon={GraduationCap} label="Minimum percentage" value="75%" />
            <RuleInput icon={QrCode} label="QR expiry time" value="30 seconds" />
            <RuleInput icon={ShieldCheck} label="Proxy prevention" value="QR + GPS + device" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RuleInput({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center gap-2 text-sm font-black text-ink">
        <Icon className="h-4 w-4 text-teal" />
        {label}
      </span>
      <Input defaultValue={value} className="border-ink/15" />
    </label>
  );
}
