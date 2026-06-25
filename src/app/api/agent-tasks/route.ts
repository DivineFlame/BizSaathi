import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { createPaperclipTask } from "@/lib/paperclip";

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

  return NextResponse.json({ ok: true, task, paperclip }, { status: 201 });
}
