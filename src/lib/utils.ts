import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function attendanceTone(value: number, threshold = 75) {
  if (value >= threshold) return "success";
  if (value >= Math.max(60, threshold - 15)) return "warning";
  return "danger";
}
