import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Badge, ButtonLink, Card } from "@/components/ui";
import { agentRoles } from "@/data/agents";

export default function AgentsPage() {
  return (
    <AppShell active="/agents">
      <PageHeader
        eyebrow="Agent manager"
        title="Create, govern, and monitor role-based AI workers."
        description="Each agent has a mission, tools, model settings, approval rules, and a dedicated workspace. This screen is the bridge between BizSaathi UI and Paperclip orchestration."
        action={<ButtonLink href="/settings">Configure Paperclip</ButtonLink>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {agentRoles.map((agent) => (
          <Card key={agent.slug} className="flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-950">{agent.name}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{agent.mission}</p>
              </div>
              <Badge tone={agent.status === "Needs approval" ? "warning" : agent.status === "Draft" ? "neutral" : "good"}>{agent.status}</Badge>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {agent.tools.slice(0, 4).map((tool) => <Badge key={tool}>{tool}</Badge>)}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {agent.metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs font-bold text-slate-500">{metric.label}</p>
                  <p className="mt-1 text-lg font-black text-slate-950">{metric.value}</p>
                </div>
              ))}
            </div>

            <Link href={`/agents/${agent.slug}`} className="mt-5 inline-flex justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white">
              Open workspace
            </Link>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
