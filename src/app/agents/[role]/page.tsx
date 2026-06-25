import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { AgentWorkspace } from "@/components/agent-workspace";
import { PageHeader } from "@/components/page-header";
import { ButtonLink } from "@/components/ui";
import { getAgentRole } from "@/data/agents";

export default async function AgentRolePage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  const agent = getAgentRole(role);
  if (!agent) notFound();

  return (
    <AppShell active="/agents">
      <PageHeader
        eyebrow="Role workspace"
        title={agent.name}
        description={agent.mission}
        action={<ButtonLink href="/agents" variant="secondary">Back to agents</ButtonLink>}
      />
      <AgentWorkspace role={agent} />
    </AppShell>
  );
}
