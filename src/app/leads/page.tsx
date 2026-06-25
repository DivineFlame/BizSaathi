import { AppShell } from "@/components/app-shell";
import { LeadForm } from "@/components/lead-form";
import { PageHeader } from "@/components/page-header";
import { Badge, ButtonLink, Card } from "@/components/ui";
import { leads as demoLeads } from "@/data/agents";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function LeadsPage() {
  const user = await getCurrentUser().catch(() => null);
  const persisted = user ? await db.lead.findMany({ where: { tenantId: user.tenantId }, orderBy: [{ score: "desc" }, { updatedAt: "desc" }] }).catch(() => []) : [];
  const list = persisted.length
    ? persisted.map((lead) => ({ name: lead.company || lead.name, stage: lead.stage.replace("_", " "), score: lead.score, next: lead.nextAction ?? "Qualify next step" }))
    : demoLeads;

  return (
    <AppShell active="/leads">
      <PageHeader
        eyebrow="Lead generation and CRM"
        title="Score, qualify, and follow up with leads under human supervision."
        description="Sales & CRM Agent drafts next actions and updates records only after the configured approval policy is satisfied."
        action={<ButtonLink href="/agents/sales-crm">Open Sales Agent</ButtonLink>}
      />
      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-separate border-spacing-y-3 text-left">
              <thead className="text-sm text-slate-500">
                <tr>
                  <th className="px-4">Lead</th>
                  <th className="px-4">Stage</th>
                  <th className="px-4">Score</th>
                  <th className="px-4">Next action</th>
                  <th className="px-4">Agent control</th>
                </tr>
              </thead>
              <tbody>
                {list.map((lead) => (
                  <tr key={`${lead.name}-${lead.stage}`} className="rounded-3xl bg-slate-50">
                    <td className="rounded-l-3xl px-4 py-4 font-black text-slate-950">{lead.name}</td>
                    <td className="px-4 py-4"><Badge tone={lead.stage === "NEGOTIATION" || lead.stage === "Negotiation" ? "warning" : "blue"}>{lead.stage}</Badge></td>
                    <td className="px-4 py-4 font-black text-slate-900">{lead.score}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{lead.next}</td>
                    <td className="rounded-r-3xl px-4 py-4"><ButtonLink href="/agents/sales-crm/run" variant="secondary">Draft follow-up</ButtonLink></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-black text-slate-950">Capture lead</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">New leads are scored automatically and routed to Sales & CRM Agent for the next action.</p>
          <div className="mt-5"><LeadForm /></div>
        </Card>
      </div>
    </AppShell>
  );
}
