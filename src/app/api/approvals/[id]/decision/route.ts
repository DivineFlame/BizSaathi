import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireApiUser, canApprove, forbidden } from "@/lib/access";
import { audit } from "@/lib/audit";

const decisionSchema = z.object({
  status: z.enum(["APPROVED", "CHANGES_REQUESTED", "REJECTED", "CANCELLED"]),
  decisionNote: z.string().max(2000).optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireApiUser();
  if (!user) return response;
  if (!canApprove(user.role)) return forbidden("Only owners, admins, managers, and approvers can decide approvals");

  const { id } = await params;
  const parsed = decisionSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid decision" }, { status: 400 });

  const existing = await db.approvalRequest.findFirst({ where: { id, tenantId: user.tenantId } });
  if (!existing) return NextResponse.json({ error: "Approval not found" }, { status: 404 });

  const approval = await db.approvalRequest.update({
    where: { id },
    data: {
      status: parsed.data.status,
      decisionNote: parsed.data.decisionNote,
      decidedById: user.id,
      decidedAt: new Date(),
    },
  });

  await audit({
    tenantId: user.tenantId,
    userId: user.id,
    action: `approval.${parsed.data.status.toLowerCase()}`,
    entity: "ApprovalRequest",
    entityId: approval.id,
  });

  return NextResponse.json({ ok: true, approval });
}
