"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Camera, CheckCircle2, Eye, EyeOff, ShieldCheck, UserPlus } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Role } from "@/lib/types";

type SignupRole = Extract<Role, "student" | "teacher" | "hod">;

const roleCopy: Record<SignupRole, { title: string; subtitle: string; loginHref: string }> = {
  student: {
    title: "Student Sign Up",
    subtitle: "Create your student account for QR attendance, subject records, and reports.",
    loginHref: "/login"
  },
  teacher: {
    title: "Teacher Sign Up",
    subtitle: "Request faculty access to start sessions, manage rosters, and review reports.",
    loginHref: "/teacherlogin"
  },
  hod: {
    title: "HOD / Admin Sign Up",
    subtitle: "Request department leadership access for approvals, alerts, and oversight.",
    loginHref: "/hodlogin"
  }
};

export function SignupForm({ role }: { role: SignupRole }) {
  const copy = roleCopy[role];
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (password.length < 8) {
      setStatus("error");
      setMessage("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Password and confirm password must match.");
      return;
    }

    const payload = {
      requestedRole: role,
      fullName: String(formData.get("fullName") || ""),
      email: String(formData.get("email") || ""),
      mobileNumber: String(formData.get("mobileNumber") || ""),
      department: String(formData.get("department") || ""),
      branch: String(formData.get("branch") || ""),
      year: String(formData.get("year") || ""),
      semester: String(formData.get("semester") || ""),
      division: String(formData.get("division") || ""),
      batch: String(formData.get("batch") || ""),
      rollNumber: String(formData.get("rollNumber") || ""),
      employeeId: String(formData.get("employeeId") || ""),
      designation: String(formData.get("designation") || ""),
      subjectsTaught: String(formData.get("subjectsTaught") || ""),
      classesAssigned: String(formData.get("classesAssigned") || ""),
      leadershipRole: String(formData.get("roleLabel") || ""),
      parentMobileNumber: String(formData.get("parentMobileNumber") || ""),
      address: String(formData.get("address") || ""),
      emergencyContact: String(formData.get("emergencyContact") || ""),
      cabinRoomNumber: String(formData.get("cabinRoomNumber") || ""),
      officeLocation: String(formData.get("officeLocation") || "")
    };

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to submit signup request.");
      }

      setStatus("success");
      setMessage("Signup request submitted. Admin approval is required before login.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to submit signup request.");
    }
  }

  return (
    <main className="min-h-screen bg-paper px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <BrandMark />
          <Button asChild variant="outline" className="border-ink/15 bg-white">
            <Link href={copy.loginHref}>Back to login</Link>
          </Button>
        </div>

        <Card className="overflow-hidden border-ink/10 shadow-soft">
          <CardContent className="grid p-0 lg:grid-cols-[0.78fr_1.22fr]">
            <aside className="bg-[#EAF8F4] p-8 text-ink sm:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal text-white">
                <UserPlus className="h-7 w-7" />
              </div>
              <h1 className="mt-8 text-5xl font-normal leading-tight text-ink">{copy.title}</h1>
              <p className="mt-5 text-sm font-semibold leading-7 text-ink/60">{copy.subtitle}</p>
              <div className="mt-8 rounded-2xl border border-teal/15 bg-white/65 p-5">
                <div className="flex gap-3">
                  <ShieldCheck className="h-5 w-5 text-teal" />
                  <div>
                    <p className="font-black">Admin approval required</p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-ink/55">
                      Signup requests create pending profiles. Admin verifies identity, class mapping, and department assignment before activation.
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            <section className="bg-white p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="grid gap-6">
                <FieldSection title="Required details">
                  {role === "student" && <StudentRequiredFields />}
                  {role === "teacher" && <TeacherRequiredFields />}
                  {role === "hod" && <HodRequiredFields />}
                  <PasswordFields
                    showPassword={showPassword}
                    showConfirm={showConfirm}
                    setShowPassword={setShowPassword}
                    setShowConfirm={setShowConfirm}
                  />
                </FieldSection>

                <FieldSection title="Optional details">
                  {role === "student" && <StudentOptionalFields />}
                  {role === "teacher" && <TeacherOptionalFields />}
                  {role === "hod" && <HodOptionalFields />}
                </FieldSection>

                <div className="rounded-2xl border border-ink/10 bg-paper p-4">
                  <p className="text-sm font-black text-ink">Approval workflow</p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-ink/55">
                    After submission, the account remains pending until an admin maps it to the correct department, branch, class, subjects, and timetable rules.
                  </p>
                </div>

                {message && (
                  <div
                    className={`rounded-2xl border p-4 text-sm font-black ${
                      status === "success" ? "border-present/20 bg-present/10 text-present" : "border-coral/25 bg-coral/10 text-coral"
                    }`}
                    role="status"
                  >
                    <span className="flex items-center gap-2">
                      {status === "success" && <CheckCircle2 className="h-5 w-5" />}
                      {message}
                    </span>
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button type="submit" disabled={status === "submitting"} className="bg-teal hover:bg-teal/90">
                    {status === "submitting" ? "Submitting..." : "Submit signup request"}
                  </Button>
                  <Button asChild variant="outline" className="border-ink/15">
                    <Link href={copy.loginHref}>Already approved? Sign in</Link>
                  </Button>
                </div>
              </form>
            </section>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function FieldSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-black text-ink">{title}</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  required = false
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-black text-ink">{label}</span>
      <Input name={name} required={required} type={type} placeholder={placeholder || label} autoComplete={autoComplete} className="border-ink/15" />
    </label>
  );
}

function SelectField({ label, name, options, required = false }: { label: string; name: string; options: string[]; required?: boolean }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-black text-ink">{label}</span>
      <select
        name={name}
        required={required}
        className="flex h-11 w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm font-semibold text-ink shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({ label, name, placeholder, required = false }: { label: string; name: string; placeholder?: string; required?: boolean }) {
  return (
    <label className="block space-y-2 md:col-span-2">
      <span className="text-sm font-black text-ink">{label}</span>
      <textarea
        name={name}
        required={required}
        rows={4}
        placeholder={placeholder || label}
        className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm font-semibold text-ink shadow-sm placeholder:text-ink/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
      />
    </label>
  );
}

function ProfilePhotoField() {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-black text-ink">Profile photo</span>
      <span className="flex h-11 items-center gap-3 rounded-lg border border-ink/15 bg-white px-3 text-sm font-semibold text-ink/55 shadow-sm">
        <Camera className="h-4 w-4 text-teal" />
        Upload photo
        <input type="file" accept="image/*" className="sr-only" />
      </span>
    </label>
  );
}

function PasswordFields({
  showPassword,
  showConfirm,
  setShowPassword,
  setShowConfirm
}: {
  showPassword: boolean;
  showConfirm: boolean;
  setShowPassword: (value: boolean) => void;
  setShowConfirm: (value: boolean) => void;
}) {
  return (
    <>
      <PasswordField name="password" label="Password" show={showPassword} onToggle={() => setShowPassword(!showPassword)} autoComplete="new-password" />
      <PasswordField name="confirmPassword" label="Confirm password" show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} autoComplete="new-password" />
    </>
  );
}

function PasswordField({ name, label, show, onToggle, autoComplete }: { name: string; label: string; show: boolean; onToggle: () => void; autoComplete: string }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-black text-ink">{label}</span>
      <span className="relative block">
        <Input name={name} required type={show ? "text" : "password"} autoComplete={autoComplete} placeholder={label} className="border-ink/15 pr-10" />
        <button type="button" onClick={onToggle} className="absolute right-3 top-3 text-ink/40" aria-label={show ? `Hide ${label}` : `Show ${label}`}>
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </span>
    </label>
  );
}

function StudentRequiredFields() {
  return (
    <>
      <Field name="fullName" label="Full name" autoComplete="name" required />
      <Field name="rollNumber" label="Roll number / PRN" required />
      <Field name="email" label="College email or personal email" type="email" autoComplete="email" required />
      <Field name="mobileNumber" label="Mobile number" type="tel" autoComplete="tel" required />
      <SelectField name="department" label="Department" options={["Computer Science", "Electronics", "Mechanical", "Civil"]} required />
      <SelectField name="branch" label="Branch" options={["CSE", "AIML", "ECE", "ME", "CE"]} required />
      <SelectField name="year" label="Year" options={["1st Year", "2nd Year", "3rd Year", "4th Year"]} required />
      <SelectField name="semester" label="Semester" options={["1", "2", "3", "4", "5", "6", "7", "8"]} required />
      <Field name="division" label="Division / Section" placeholder="A / B / C" required />
      <Field name="batch" label="Batch / Lab group" placeholder="Batch 1 / Lab Group A" required />
    </>
  );
}

function StudentOptionalFields() {
  return (
    <>
      <ProfilePhotoField />
      <Field name="parentMobileNumber" label="Parent/guardian mobile number" type="tel" />
      <TextAreaField name="address" label="Address" />
      <Field name="emergencyContact" label="Emergency contact" type="tel" />
    </>
  );
}

function TeacherRequiredFields() {
  return (
    <>
      <Field name="fullName" label="Full name" autoComplete="name" required />
      <Field name="employeeId" label="Faculty ID / Employee ID" required />
      <Field name="email" label="College email" type="email" autoComplete="email" required />
      <Field name="mobileNumber" label="Mobile number" type="tel" autoComplete="tel" required />
      <SelectField name="department" label="Department" options={["Computer Science", "Electronics", "Mechanical", "Civil"]} required />
      <SelectField name="designation" label="Designation" options={["Assistant Professor", "Professor", "Associate Professor", "Lab Assistant", "Visiting Faculty"]} required />
      <TextAreaField name="subjectsTaught" label="Subjects taught" placeholder="Database Management, Computer Networks" required />
      <TextAreaField name="classesAssigned" label="Classes assigned" placeholder="3rd Year CSE A, 2nd Year AIML B" required />
    </>
  );
}

function TeacherOptionalFields() {
  return (
    <>
      <ProfilePhotoField />
      <Field name="cabinRoomNumber" label="Cabin/office room number" placeholder="Block B - Room 214" />
    </>
  );
}

function HodRequiredFields() {
  return (
    <>
      <Field name="fullName" label="Full name" autoComplete="name" required />
      <Field name="employeeId" label="Teacher ID" required />
      <Field name="email" label="College email" type="email" autoComplete="email" required />
      <Field name="mobileNumber" label="Mobile number" type="tel" autoComplete="tel" required />
      <SelectField name="department" label="Department" options={["Computer Science", "Electronics", "Mechanical", "Civil"]} required />
      <SelectField name="roleLabel" label="Role" options={["HOD", "Admin"]} required />
    </>
  );
}

function HodOptionalFields() {
  return (
    <>
      <ProfilePhotoField />
      <Field name="officeLocation" label="Office location" placeholder="Admin Block - Room 101" />
    </>
  );
}
