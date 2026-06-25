import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireApiUser } from "@/lib/access";
import { audit } from "@/lib/audit";

const approvalSchema = z.object({
  taskId: z.string().optional(),
  title: z.string().min(3).max(160),
  description: z.string().min(5),
  riskLevel: z.enum(["low", "medium", "high"]).default("medium"),
  actionType: z.string().min(2).max(80),
  payload: z.record(z.string(), z.unknown()).default({}),
});

export async function GET() {
  const { user, response } = await requireApiUser();
  if (!user) return response;

  const approvals = await db.approvalRequest.findMany({
    where: { tenantId: user.tenantId },
    include: { task: { include: { agent: true } }, requestedBy: true, decidedBy: true },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 100,
  });

  return NextResponse.json({ approvals });
}

export async function POST(request: Request) {
  const { user, response } = await requireApiUser();
  if (!user) return response;

  const parsed = approvalSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid approval" }, { status: 400 });

  const approval = await db.approvalRequest.create({
    data: {
      tenantId: user.tenantId,
      requestedById: user.id,
      taskId: parsed.data.taskId,
      title: parsed.data.title,
      description: parsed.data.description,
      riskLevel: parsed.data.riskLevel,
      actionType: parsed.data.actionType,
      payload: parsed.data.payload,
    },
  });

  await audit({ tenantId: user.tenantId, userId: user.id, action: "approval.create", entity: "ApprovalRequest", entityId: approval.id });
  return NextResponse.json({ ok: true, approval }, { status: 201 });
}
