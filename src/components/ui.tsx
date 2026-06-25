import Link from "next/link";
import { cn } from "@/lib/cn";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50", className)}>{children}</div>;
}

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "good" | "warning" | "danger" | "neutral" | "blue" }) {
  const tones = {
    good: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    warning: "bg-amber-50 text-amber-700 ring-amber-100",
    danger: "bg-red-50 text-red-700 ring-red-100",
    neutral: "bg-slate-100 text-slate-700 ring-slate-200",
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
  };
  return <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-black ring-1", tones[tone])}>{children}</span>;
}

export function ButtonLink({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "secondary" }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-black transition",
        variant === "primary" ? "bg-slate-950 text-white hover:bg-slate-800" : "bg-white text-slate-950 ring-1 ring-slate-200 hover:bg-slate-50",
      )}
    >
      {children}
    </Link>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

export const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";
