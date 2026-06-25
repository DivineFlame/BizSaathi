import { AppShell } from "@/components/app-shell";
import { CampaignForm } from "@/components/campaign-form";
import { PageHeader } from "@/components/page-header";
import { Badge, ButtonLink, Card } from "@/components/ui";
import { campaigns as demoCampaigns } from "@/data/agents";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function CampaignsPage() {
  const user = await getCurrentUser().catch(() => null);
  const persisted = user
    ? await db.campaign.findMany({ where: { tenantId: user.tenantId }, include: { content: true }, orderBy: { updatedAt: "desc" } }).catch(() => [])
    : [];

  const list = persisted.length
    ? persisted.map((campaign) => ({
        name: campaign.name,
        client: campaign.clientName ?? user?.tenant.name ?? "Workspace",
        status: campaign.status,
        channels: Array.isArray(campaign.channels) ? campaign.channels.join(", ") : "Configured",
        due: campaign.endsAt ? campaign.endsAt.toLocaleDateString() : `${campaign.content.length} content items`,
      }))
    : demoCampaigns;

  return (
    <AppShell active="/campaigns">
      <PageHeader
        eyebrow="Campaign studio"
        title="Plan campaigns and send agent tasks to the right role."
        description="Marketing Manager creates briefs, Content Writer drafts assets, Social Media Agent prepares previews, and Compliance reviews claims before publishing."
        action={<ButtonLink href="/agents/marketing">Open Marketing Agent</ButtonLink>}
      />
      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <div className="grid gap-4 lg:grid-cols-2">
          {list.map((campaign) => (
            <Card key={campaign.name}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-slate-950">{campaign.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">{campaign.client}</p>
                </div>
                <Badge tone={campaign.status.toLowerCase().includes("approval") ? "warning" : "blue"}>{campaign.status}</Badge>
              </div>
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <p><strong>Channels:</strong> {campaign.channels}</p>
                <p><strong>Due:</strong> {campaign.due}</p>
              </div>
              <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                Agent handoff: brief → content draft → channel preview → compliance review → approval.
              </div>
            </Card>
          ))}
        </div>
        <Card>
          <h2 className="text-xl font-black text-slate-950">Create campaign</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Saved campaigns are tenant-scoped and ready for Marketing Agent planning tasks.</p>
          <div className="mt-5"><CampaignForm /></div>
        </Card>
      </div>
    </AppShell>
  );
}
