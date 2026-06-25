import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { createPaperclipTask } from "@/lib/paperclip";
import { audit } from "@/lib/audit";

const taskSchema = z.object({
  agentSlug: z.string().min(2),
  title: z.string().min(3),
  goal: z.string().min(10),
  approvalRequired: z.boolean().default(true),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = taskSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid task" }, { status: 400 });

  const agent = await db.agent.findUnique({
    where: { tenantId_slug: { tenantId: user.tenantId, slug: parsed.data.agentSlug } },
  });
  if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 });

  const task = await db.agentTask.create({
    data: {
      tenantId: user.tenantId,
      agentId: agent.id,
      title: parsed.data.title,
      goal: parsed.data.goal,
      approvalRequired: parsed.data.approvalRequired,
      status: parsed.data.approvalRequired ? "WAITING_APPROVAL" : "QUEUED",
    },
  });

  const paperclip = await createPaperclipTask({
    tenantId: user.tenantId,
    agentSlug: agent.slug,
    title: task.title,
    goal: task.goal,
    approvalRequired: task.approvalRequired,
    metadata: { localTaskId: task.id },
  });

  await db.agentRun.create({
    data: {
      agentId: agent.id,
      taskId: task.id,
      providerRunId: paperclip.taskId,
      status: paperclip.status === "failed" ? "FAILED" : task.status,
      input: parsed.data,
      output: paperclip,
    },
  });

  let approval = null;
  if (task.approvalRequired) {
    approval = await db.approvalRequest.create({
      data: {
        tenantId: user.tenantId,
        taskId: task.id,
        requestedById: user.id,
        title: `Approve: ${task.title}`,
        description: task.goal,
        riskLevel: "medium",
        actionType: "agent_task_execution",
        payload: { agentSlug: agent.slug, localTaskId: task.id, paperclipTaskId: paperclip.taskId },
      },
    });
  }

  await audit({
    tenantId: user.tenantId,
    userId: user.id,
    action: "agent_task.create",
    entity: "AgentTask",
    entityId: task.id,
    metadata: { agentSlug: agent.slug, paperclipMode: paperclip.mode, approvalId: approval?.id ?? null },
  });

  return NextResponse.json({ ok: true, task, paperclip, approval }, { status: 201 });
}
