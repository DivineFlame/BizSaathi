import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireApiUser } from "@/lib/access";
import { audit } from "@/lib/audit";

const campaignSchema = z.object({
  name: z.string().min(2).max(160),
  clientName: z.string().max(160).optional().nullable(),
  objective: z.string().min(10),
  audience: z.string().max(300).optional().nullable(),
  channels: z.array(z.string()).default([]),
});

export async function GET() {
  const { user, response } = await requireApiUser();
  if (!user) return response;

  const campaigns = await db.campaign.findMany({
    where: { tenantId: user.tenantId },
    include: { content: true },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ campaigns });
}

export async function POST(request: Request) {
  const { user, response } = await requireApiUser();
  if (!user) return response;

  const parsed = campaignSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid campaign" }, { status: 400 });

  const campaign = await db.campaign.create({
    data: {
      tenantId: user.tenantId,
      name: parsed.data.name,
      clientName: parsed.data.clientName,
      objective: parsed.data.objective,
      audience: parsed.data.audience,
      channels: parsed.data.channels,
      status: "planning",
    },
  });

  await audit({ tenantId: user.tenantId, userId: user.id, action: "campaign.create", entity: "Campaign", entityId: campaign.id });
  return NextResponse.json({ ok: true, campaign }, { status: 201 });
}
