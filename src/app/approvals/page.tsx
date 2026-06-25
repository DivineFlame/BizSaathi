import { ApprovalActions } from "@/components/approval-actions";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Badge, Card } from "@/components/ui";
import { approvalItems } from "@/data/agents";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function ApprovalsPage() {
  const user = await getCurrentUser().catch(() => null);
  const persisted = user
    ? await db.approvalRequest.findMany({
        where: { tenantId: user.tenantId },
        include: { task: { include: { agent: true } }, requestedBy: true },
        orderBy: [{ status: "asc" }, { createdAt: "desc" }],
        take: 50,
      }).catch(() => [])
    : [];

  const items = persisted.length
    ? persisted.map((item) => ({
        id: item.id,
        title: item.title,
        agent: item.task?.agent.name ?? item.requestedBy?.name ?? "BizSaathi",
        risk: item.riskLevel,
        action: item.actionType,
        status: item.status,
        description: item.description,
      }))
    : approvalItems.map((item) => ({ ...item, id: undefined, description: "Demo approval item. Sign in and create tasks to persist approvals." }));

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
            {items.map((item) => (
              <div key={item.title} className="rounded-3xl border border-slate-100 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-950">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">Requested by {item.agent}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone={String(item.risk).toLowerCase() === "high" ? "danger" : String(item.risk).toLowerCase() === "medium" ? "warning" : "good"}>{item.risk}</Badge>
                    <Badge>{item.status}</Badge>
                  </div>
                </div>
                <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <p className="text-sm font-bold text-slate-600">Action: {item.action}</p>
                  <ApprovalActions approvalId={item.id} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-black text-slate-950">Approval policy</h2>
          <div className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
            <p><strong>Low risk:</strong> drafts can be created and stored.</p>
            <p><strong>Medium risk:</strong> manager or approver review required.</p>
            <p><strong>High risk:</strong> Compliance & QA plus owner approval required.</p>
            <p><strong>External action:</strong> always blocked until approved.</p>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
