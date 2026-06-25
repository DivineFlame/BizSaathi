import Link from "next/link";
import { Bot, CheckSquare, FileText, Gauge, Megaphone, Settings, Users, Workflow, Target, ScrollText } from "lucide-react";
import { cn } from "@/lib/cn";

const navItems = [
  { href: "/", label: "Dashboard", icon: Gauge },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/content-studio", label: "Content", icon: FileText },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/approvals", label: "Approvals", icon: CheckSquare },
  { href: "/audit", label: "Audit", icon: ScrollText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children, active = "/" }: { children: React.ReactNode; active?: string }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r border-slate-200/80 bg-white/75 backdrop-blur lg:block">
        <div className="sticky top-0 flex h-screen flex-col p-5">
          <Link href="/" className="flex items-center gap-3 rounded-3xl bg-slate-950 p-4 text-white shadow-xl shadow-slate-200">
            <div className="rounded-2xl bg-white/15 p-2">
              <Workflow className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-black tracking-tight">BizSaathi</p>
              <p className="text-xs text-white/65">AI operations workspace</p>
            </div>
          </Link>

          <nav className="mt-7 space-y-2 overflow-y-auto pr-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.href || (item.href !== "/" && active.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-3xl border border-blue-100 bg-blue-50 p-4">
            <div className="mb-3 flex items-center gap-2 text-blue-700">
              <Target className="h-5 w-5" />
              <span className="text-sm font-black uppercase tracking-widest">Default guardrail</span>
            </div>
            <p className="text-sm leading-6 text-blue-950">Agents can draft, plan, and prepare. External actions need human approval.</p>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 px-4 py-3 backdrop-blur lg:hidden">
          <div className="mb-3 flex items-center justify-between">
            <Link href="/" className="font-black text-slate-950">BizSaathi</Link>
            <Link href="/settings" className="rounded-full bg-slate-950 px-3 py-2 text-xs font-black text-white">Settings</Link>
          </div>
          <nav className="flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-2 text-xs font-black",
                  active === item.href || (item.href !== "/" && active.startsWith(item.href))
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="min-w-0 p-4 sm:p-6 xl:p-8">{children}</main>
      </div>
    </div>
  );
}
