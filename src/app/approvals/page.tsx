import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Badge, Card } from "@/components/ui";
import { approvalItems } from "@/data/agents";

export default function ApprovalsPage() {
  return (
    <AppShell active="/approvals">
      <PageHeader
        eyebrow="Human-in-the-loop"
        title="Approval center for safe agent execution."
        description="All high-impact actions are reviewed here before they reach customers, social platforms, CRM records, or budgets."
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Card>
          <h2 className="text-xl font-black text-slate-950">Pending reviews</h2>
          <div className="mt-5 space-y-4">
            {approvalItems.map((item) => (
              <div key={item.title} className="rounded-3xl border border-slate-100 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-950">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">Requested by {item.agent}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge tone={item.risk === "High" ? "danger" : item.risk === "Medium" ? "warning" : "good"}>{item.risk} risk</Badge>
                    <Badge>{item.status}</Badge>
                  </div>
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-700">{item.action}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white">Approve</button>
                  <button className="rounded-full bg-amber-100 px-4 py-2 text-sm font-black text-amber-800">Request changes</button>
                  <button className="rounded-full bg-red-100 px-4 py-2 text-sm font-black text-red-700">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="h-fit">
          <h2 className="text-xl font-black text-slate-950">Approval policy</h2>
          <div className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
            <p><strong className="text-slate-950">Always approve:</strong> publishing, email sending, CRM mutation, budget change, external API action.</p>
            <p><strong className="text-slate-950">Escalate:</strong> high-risk claims, PII exposure, refunds, legal-sensitive responses, and brand-critical messages.</p>
            <p><strong className="text-slate-950">Auto-save only:</strong> low-risk drafts, summaries, internal notes, and planning documents.</p>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
