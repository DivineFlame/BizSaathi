import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireApiUser, canManage, forbidden } from "@/lib/access";
import { audit } from "@/lib/audit";

const integrationSchema = z.object({
  provider: z.enum(["PAPERCLIP", "OLLAMA", "GMAIL", "GOOGLE_CALENDAR", "META", "LINKEDIN", "X", "WHATSAPP", "CRM", "STORAGE", "CUSTOM"]),
  name: z.string().min(2).max(120),
  isEnabled: z.boolean().default(false),
  config: z.record(z.string(), z.unknown()).default({}),
});

export async function GET() {
  const { user, response } = await requireApiUser();
  if (!user) return response;

  const integrations = await db.integration.findMany({
    where: { tenantId: user.tenantId },
    orderBy: [{ provider: "asc" }, { name: "asc" }],
  });
  return NextResponse.json({ integrations });
}

export async function POST(request: Request) {
  const { user, response } = await requireApiUser();
  if (!user) return response;
  if (!canManage(user.role)) return forbidden();

  const parsed = integrationSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid integration" }, { status: 400 });

  const integration = await db.integration.upsert({
    where: { tenantId_provider_name: { tenantId: user.tenantId, provider: parsed.data.provider, name: parsed.data.name } },
    create: { tenantId: user.tenantId, ...parsed.data },
    update: { isEnabled: parsed.data.isEnabled, config: parsed.data.config },
  });

  await audit({ tenantId: user.tenantId, userId: user.id, action: "integration.upsert", entity: "Integration", entityId: integration.id });
  return NextResponse.json({ ok: true, integration });
}
