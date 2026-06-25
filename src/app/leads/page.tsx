import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Badge, ButtonLink, Card } from "@/components/ui";
import { leads } from "@/data/agents";

export default function LeadsPage() {
  return (
    <AppShell active="/leads">
      <PageHeader
        eyebrow="Lead generation and CRM"
        title="Score, qualify, and follow up with leads under human supervision."
        description="Sales & CRM Agent drafts next actions and updates records only after the configured approval policy is satisfied."
        action={<ButtonLink href="/agents/sales-crm">Open Sales Agent</ButtonLink>}
      />
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
              {leads.map((lead) => (
                <tr key={lead.name} className="rounded-3xl bg-slate-50">
                  <td className="rounded-l-3xl px-4 py-4 font-black text-slate-950">{lead.name}</td>
                  <td className="px-4 py-4"><Badge tone={lead.stage === "Negotiation" ? "warning" : "blue"}>{lead.stage}</Badge></td>
                  <td className="px-4 py-4 font-black text-slate-900">{lead.score}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{lead.next}</td>
                  <td className="rounded-r-3xl px-4 py-4"><button className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white">Draft follow-up</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
