import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireApiUser, canManage, forbidden } from "@/lib/access";
import { audit } from "@/lib/audit";

const agentSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(60).regex(/^[a-z0-9-]+$/),
  kind: z.enum(["CEO", "MARKETING", "CONTENT", "SOCIAL", "SALES_CRM", "SUPPORT", "FINANCE", "COMPLIANCE", "CUSTOM"]).default("CUSTOM"),
  mission: z.string().min(10),
  systemPrompt: z.string().min(10),
  modelProvider: z.string().default("ollama"),
  modelName: z.string().default(process.env.DEFAULT_MODEL_NAME ?? "llama3.1:8b"),
  adapterType: z.string().default("http"),
  toolsAllowed: z.array(z.string()).default([]),
  approvalRequiredFor: z.array(z.string()).default(["publish", "send_email", "crm_update"]),
});

export async function GET() {
  const { user, response } = await requireApiUser();
  if (!user) return response;

  const agents = await db.agent.findMany({
    where: { tenantId: user.tenantId },
    orderBy: [{ status: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json({ agents });
}

export async function POST(request: Request) {
  const { user, response } = await requireApiUser();
  if (!user) return response;
  if (!canManage(user.role)) return forbidden();

  const parsed = agentSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid agent" }, { status: 400 });

  const agent = await db.agent.create({
    data: {
      ...parsed.data,
      tenantId: user.tenantId,
      status: "DRAFT",
    },
  });

  await audit({ tenantId: user.tenantId, userId: user.id, action: "agent.create", entity: "Agent", entityId: agent.id });
  return NextResponse.json({ ok: true, agent }, { status: 201 });
}
