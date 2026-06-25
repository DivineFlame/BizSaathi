import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireApiUser } from "@/lib/access";
import { audit } from "@/lib/audit";

const leadSchema = z.object({
  name: z.string().min(2).max(160),
  company: z.string().max(160).optional().nullable(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(40).optional().nullable(),
  source: z.string().max(120).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

function scoreLead(input: z.infer<typeof leadSchema>) {
  let score = 40;
  if (input.email) score += 15;
  if (input.phone) score += 15;
  if (input.source?.toLowerCase().includes("referral")) score += 15;
  if (input.notes && input.notes.length > 30) score += 10;
  return Math.min(score, 100);
}

export async function GET() {
  const { user, response } = await requireApiUser();
  if (!user) return response;

  const leads = await db.lead.findMany({
    where: { tenantId: user.tenantId },
    orderBy: [{ stage: "asc" }, { score: "desc" }, { updatedAt: "desc" }],
    take: 200,
  });

  return NextResponse.json({ leads });
}

export async function POST(request: Request) {
  const { user, response } = await requireApiUser();
  if (!user) return response;

  const parsed = leadSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid lead" }, { status: 400 });

  const score = scoreLead(parsed.data);
  const lead = await db.lead.create({
    data: {
      tenantId: user.tenantId,
      name: parsed.data.name,
      company: parsed.data.company,
      email: parsed.data.email || null,
      phone: parsed.data.phone,
      source: parsed.data.source,
      notes: parsed.data.notes,
      score,
      nextAction: score >= 75 ? "Draft high-priority follow-up" : "Qualify lead details",
    },
  });

  await audit({ tenantId: user.tenantId, userId: user.id, action: "lead.create", entity: "Lead", entityId: lead.id, metadata: { score } });
  return NextResponse.json({ ok: true, lead }, { status: 201 });
}
