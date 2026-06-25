import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { TaskForm } from "@/components/task-form";
import { Badge, ButtonLink, Card } from "@/components/ui";
import { getAgentRole } from "@/data/agents";

export default async function CreateAgentTaskPage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  const agent = getAgentRole(role);
  if (!agent) notFound();

  return (
    <AppShell active="/agents">
      <PageHeader
        eyebrow="Create governed task"
        title={`New task for ${agent.name}`}
        description="Tasks are persisted in BizSaathi, sent to Paperclip when configured, and routed through approval rules before external execution."
        action={<ButtonLink href={`/agents/${agent.slug}`} variant="secondary">Back to workspace</ButtonLink>}
      />
      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <Card>
          <TaskForm agent={agent} />
        </Card>
        <div className="space-y-5">
          <Card>
            <h2 className="text-xl font-black text-slate-950">Agent context</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone="blue">{agent.priority}</Badge>
              <Badge>{agent.status}</Badge>
              <Badge>{agent.model}</Badge>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{agent.mission}</p>
          </Card>
          <Card>
            <h2 className="text-xl font-black text-slate-950">Allowed tools</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {agent.tools.map((tool) => <Badge key={tool}>{tool}</Badge>)}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
