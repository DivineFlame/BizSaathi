import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { Badge, ButtonLink, Card } from "@/components/ui";
import type { AgentRole } from "@/lib/types";

export function AgentWorkspace({ role }: { role: AgentRole }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.5fr_0.9fr]">
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="blue">{role.status}</Badge>
              <Badge tone={role.priority === "Critical" || role.priority === "High" ? "warning" : "neutral"}>{role.priority}</Badge>
            </div>
            <h2 className="mt-4 text-2xl font-black text-slate-950">{role.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{role.mission}</p>
          </div>
          <ButtonLink href={`/agents/${role.slug}/run`}>Create task</ButtonLink>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {role.metrics.map((metric) => (
            <div key={metric.label} className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-500">{metric.label}</p>
              <p className="mt-2 text-3xl font-black text-slate-950">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <WorkspacePanel title={role.workspace.primaryPanel} items={role.workspace.primaryItems} />
          <WorkspacePanel title={role.workspace.secondaryPanel} items={role.workspace.secondaryItems} />
        </div>
      </Card>

      <div className="space-y-5">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            <h3 className="font-black text-slate-950">Governance</h3>
          </div>
          <div className="space-y-3 text-sm text-slate-600">
            <p>External actions require approval by default.</p>
            <p>High-risk outputs are routed to Compliance & QA before owner approval.</p>
            <p>Every agent action should become an audit log event.</p>
          </div>
        </Card>

        <Card>
          <h3 className="font-black text-slate-950">Task queue</h3>
          <div className="mt-4 space-y-3">
            {role.queue.map((item) => (
              <div key={item} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 p-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-semibold text-slate-700">{item}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function WorkspacePanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
      <h3 className="font-black text-slate-950">{title}</h3>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div key={item} className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
