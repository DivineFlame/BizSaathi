import Link from "next/link";
import { Bot, CheckCircle2, CircleDollarSign, Clock, ShieldCheck, Sparkles, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Badge, ButtonLink, Card } from "@/components/ui";
import { agentRoles, approvalItems } from "@/data/agents";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser().catch(() => null);

  return (
    <AppShell active="/">
      <PageHeader
        eyebrow={user ? `${user.tenant.name} workspace` : "Paperclip-ready AI SaaS"}
        title="Role-based AI agents with approval-first business operations."
        description="BizSaathi gives every agent a dedicated UI, connects to Paperclip/Ollama, and keeps humans in control before publishing, emailing, CRM updates, or budget actions."
        action={
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/onboarding" variant="secondary">Create workspace</ButtonLink>
            <ButtonLink href="/agents">Open agents</ButtonLink>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat title="Active agents" value="8" icon={<Bot className="h-5 w-5" />} tone="blue" />
        <Stat title="Pending approvals" value="21" icon={<ShieldCheck className="h-5 w-5" />} tone="warning" />
        <Stat title="Leads in motion" value="46" icon={<Users className="h-5 w-5" />} tone="good" />
        <Stat title="Budget guarded" value="100%" icon={<CircleDollarSign className="h-5 w-5" />} tone="neutral" />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-950">Agent workspaces</h2>
              <p className="mt-1 text-sm text-slate-500">Different UI for each role, not one generic chatbot.</p>
            </div>
            <Badge tone="blue">MVP ready</Badge>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {agentRoles.map((agent) => (
              <Link key={agent.slug} href={`/agents/${agent.slug}`} className="group rounded-3xl border border-slate-100 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black text-slate-950">{agent.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{agent.mission}</p>
                  </div>
                  <Sparkles className="h-5 w-5 text-blue-600 opacity-70 transition group-hover:scale-110" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge tone={agent.status === "Needs approval" ? "warning" : agent.status === "Draft" ? "neutral" : "good"}>{agent.status}</Badge>
                  <Badge>{agent.priority}</Badge>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" />
              <h2 className="text-xl font-black text-slate-950">Approval queue</h2>
            </div>
            <div className="space-y-3">
              {approvalItems.map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-100 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-slate-900">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.agent}</p>
                    </div>
                    <Badge tone={item.risk === "High" ? "danger" : item.risk === "Medium" ? "warning" : "good"}>{item.risk}</Badge>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-600">{item.action}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-slate-950 text-white">
            <div className="flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-black uppercase tracking-widest">Dokploy ready</span>
            </div>
            <p className="mt-3 text-2xl font-black">Deploy with raw compose and external PostgreSQL.</p>
            <p className="mt-3 text-sm leading-6 text-white/65">Use `docker-compose.dokploy.yml`, connect Paperclip/Ollama on `dokploy-network`, and route the domain to port 3000.</p>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ title, value, icon, tone }: { title: string; value: string; icon: React.ReactNode; tone: "blue" | "warning" | "good" | "neutral" }) {
  const toneClass = {
    blue: "bg-blue-50 text-blue-700",
    warning: "bg-amber-50 text-amber-700",
    good: "bg-emerald-50 text-emerald-700",
    neutral: "bg-slate-100 text-slate-700",
  }[tone];

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
        </div>
        <div className={`rounded-2xl p-3 ${toneClass}`}>{icon}</div>
      </div>
    </Card>
  );
}
