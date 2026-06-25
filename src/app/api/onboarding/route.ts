import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { agentRoles } from "@/data/agents";

const onboardingSchema = z.object({
  companyName: z.string().min(2).max(120),
  slug: z.string().min(3).max(60).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  name: z.string().min(2).max(120),
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z.string().min(10),
});

const kindMap: Record<string, "CEO" | "MARKETING" | "CONTENT" | "SOCIAL" | "SALES_CRM" | "SUPPORT" | "FINANCE" | "COMPLIANCE"> = {
  ceo: "CEO",
  marketing: "MARKETING",
  content: "CONTENT",
  social: "SOCIAL",
  "sales-crm": "SALES_CRM",
  support: "SUPPORT",
  finance: "FINANCE",
  compliance: "COMPLIANCE",
};

export async function POST(request: Request) {
  const parsed = onboardingSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid onboarding details" }, { status: 400 });
  }

  const exists = await db.tenant.findUnique({ where: { slug: parsed.data.slug } });
  if (exists) return NextResponse.json({ error: "Workspace slug is already taken" }, { status: 409 });

  const passwordHash = await hashPassword(parsed.data.password);

  const tenant = await db.tenant.create({
    data: {
      name: parsed.data.companyName,
      slug: parsed.data.slug,
      settings: {
        approvalMode: "human_required",
        defaultModelProvider: process.env.DEFAULT_MODEL_PROVIDER ?? "ollama",
        defaultModelName: process.env.DEFAULT_MODEL_NAME ?? "llama3.1:8b",
      },
      users: {
        create: {
          email: parsed.data.email,
          name: parsed.data.name,
          passwordHash,
          role: "OWNER",
        },
      },
      agents: {
        create: agentRoles.map((agent) => ({
          name: agent.name,
          slug: agent.slug,
          kind: kindMap[agent.slug] ?? "CUSTOM",
          status: agent.status === "Draft" ? "DRAFT" : "ACTIVE",
          mission: agent.mission,
          systemPrompt: `You are the ${agent.name} for this tenant. Work only within your role. External actions require human approval.`,
          modelProvider: process.env.DEFAULT_MODEL_PROVIDER ?? "ollama",
          modelName: process.env.DEFAULT_MODEL_NAME ?? "llama3.1:8b",
          adapterType: "http",
          toolsAllowed: agent.tools,
          approvalRequiredFor: ["publish", "send_email", "crm_update", "budget_change", "external_api_action"],
        })),
      },
    },
    include: { users: true },
  });

  const owner = tenant.users[0];
  await setSessionCookie({ userId: owner.id, tenantId: tenant.id, role: owner.role });
  return NextResponse.json({ ok: true, tenant: { id: tenant.id, slug: tenant.slug } }, { status: 201 });
}
