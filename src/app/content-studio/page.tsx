import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Badge, ButtonLink, Card } from "@/components/ui";

const drafts = [
  { title: "LinkedIn thought leadership post", platform: "LinkedIn", status: "Draft", risk: "Low", owner: "Content Writer Agent" },
  { title: "Festive offer Meta caption", platform: "Meta", status: "Needs approval", risk: "Medium", owner: "Social Media Agent" },
  { title: "ROI claim ad copy", platform: "Ad", status: "Blocked", risk: "High", owner: "Compliance & QA Agent" },
  { title: "Nurture email sequence", platform: "Email", status: "Draft", risk: "Medium", owner: "Content Writer Agent" },
];

export default function ContentStudioPage() {
  return (
    <AppShell active="/content-studio">
      <PageHeader
        eyebrow="Content studio"
        title="Draft, edit, preview, and approve AI-generated content."
        description="This workspace is optimized for human editing: brand voice, channel previews, QA checks, and approval routing before publishing."
        action={<ButtonLink href="/agents/content/run">Create content task</ButtonLink>}
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <Card>
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-black text-slate-950">Draft queue</h2>
              <p className="mt-1 text-sm text-slate-500">Human-editable content assets prepared by agents.</p>
            </div>
            <Badge tone="warning">Approval-first</Badge>
          </div>
          <div className="grid gap-3">
            {drafts.map((draft) => (
              <div key={draft.title} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-black text-slate-950">{draft.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{draft.owner} · {draft.platform}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone={draft.status === "Blocked" ? "danger" : draft.status === "Needs approval" ? "warning" : "neutral"}>{draft.status}</Badge>
                    <Badge tone={draft.risk === "High" ? "danger" : draft.risk === "Medium" ? "warning" : "good"}>{draft.risk}</Badge>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl bg-white p-4 text-sm leading-6 text-slate-600">
                  Editor placeholder: next phase will add saved content records, version history, platform previews, and similarity/brand checks.
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <h2 className="text-xl font-black text-slate-950">Brand voice controls</h2>
            <div className="mt-4 grid gap-3">
              {["Professional but simple", "MSME friendly", "Hinglish optional", "No unverifiable claims", "Clear CTA"].map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-700">{item}</div>
              ))}
            </div>
          </Card>
          <Card className="bg-slate-950 text-white">
            <h2 className="text-xl font-black">Publishing safety</h2>
            <p className="mt-3 text-sm leading-6 text-white/65">The Social Media Agent can prepare platform-specific previews, but publishing stays locked until Approval Center allows it.</p>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
