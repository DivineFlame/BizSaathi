import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Badge, ButtonLink, Card } from "@/components/ui";
import { campaigns } from "@/data/agents";

export default function CampaignsPage() {
  return (
    <AppShell active="/campaigns">
      <PageHeader
        eyebrow="Campaign studio"
        title="Plan campaigns and send agent tasks to the right role."
        description="Marketing Manager creates briefs, Content Writer drafts assets, Social Media Agent prepares previews, and Compliance reviews claims before publishing."
        action={<ButtonLink href="/agents/marketing">Open Marketing Agent</ButtonLink>}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <Card key={campaign.name}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-950">{campaign.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{campaign.client}</p>
              </div>
              <Badge tone={campaign.status === "Approval" ? "warning" : "blue"}>{campaign.status}</Badge>
            </div>
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <p><strong>Channels:</strong> {campaign.channels}</p>
              <p><strong>Due:</strong> {campaign.due}</p>
            </div>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              Next implementation: persist campaigns, content items, post previews, and approval history from Prisma.
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
