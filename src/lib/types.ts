export type Role = "student" | "teacher" | "hod" | "admin";

export type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

export type Metric = {
  label: string;
  value: string;
  detail: string;
  tone?: "primary" | "success" | "warning" | "danger" | "neutral";
};

export type TableColumn = {
  label: string;
  key: string;
};

export type TableRow = Record<string, string | number>;
