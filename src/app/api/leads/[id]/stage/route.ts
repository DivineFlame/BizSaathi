import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireApiUser } from "@/lib/access";
import { audit } from "@/lib/audit";

const stageSchema = z.object({
  stage: z.enum(["NEW", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON", "LOST", "NURTURE"]),
  nextAction: z.string().max(500).optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireApiUser();
  if (!user) return response;
  const { id } = await params;
  const parsed = stageSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid stage" }, { status: 400 });

  const existing = await db.lead.findFirst({ where: { id, tenantId: user.tenantId } });
  if (!existing) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const lead = await db.lead.update({
    where: { id },
    data: { stage: parsed.data.stage, nextAction: parsed.data.nextAction },
  });
  await audit({ tenantId: user.tenantId, userId: user.id, action: "lead.stage", entity: "Lead", entityId: lead.id, metadata: { stage: lead.stage } });
  return NextResponse.json({ ok: true, lead });
}
