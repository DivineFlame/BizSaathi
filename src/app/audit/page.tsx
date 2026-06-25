import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Badge, Card } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

const demoLogs = [
  { action: "agent.task.created", entity: "AgentTask", user: "Demo Owner", createdAt: "Demo", metadata: "Task sent to Paperclip mock mode" },
  { action: "approval.pending", entity: "ApprovalRequest", user: "Compliance Agent", createdAt: "Demo", metadata: "External publishing blocked" },
  { action: "lead.scored", entity: "Lead", user: "Sales & CRM Agent", createdAt: "Demo", metadata: "Lead score updated" },
];

export default async function AuditPage() {
  const user = await getCurrentUser().catch(() => null);
  const logs = user
    ? await db.auditLog.findMany({ where: { tenantId: user.tenantId }, include: { user: true }, orderBy: { createdAt: "desc" }, take: 100 }).catch(() => [])
    : [];

  const items = logs.length
    ? logs.map((log) => ({
        action: log.action,
        entity: log.entity,
        user: log.user?.name ?? "System",
        createdAt: log.createdAt.toLocaleString(),
        metadata: JSON.stringify(log.metadata),
      }))
    : demoLogs;

  return (
    <AppShell active="/audit">
      <PageHeader
        eyebrow="Audit trail"
        title="Trace every agent, user, approval, and integration action."
        description="Production agentic apps need accountability. BizSaathi stores tenant-scoped logs for sensitive operations and approval decisions."
      />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-y-3 text-left">
            <thead className="text-sm text-slate-500">
              <tr>
                <th className="px-4">Action</th>
                <th className="px-4">Entity</th>
                <th className="px-4">User/System</th>
                <th className="px-4">Time</th>
                <th className="px-4">Metadata</th>
              </tr>
            </thead>
            <tbody>
              {items.map((log, index) => (
                <tr key={`${log.action}-${index}`} className="bg-slate-50">
                  <td className="rounded-l-3xl px-4 py-4"><Badge tone="blue">{log.action}</Badge></td>
                  <td className="px-4 py-4 font-black text-slate-950">{log.entity}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{log.user}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{log.createdAt}</td>
                  <td className="rounded-r-3xl px-4 py-4 text-xs text-slate-500">{log.metadata}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
