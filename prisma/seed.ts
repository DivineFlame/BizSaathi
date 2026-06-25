import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { agentRoles } from "../src/data/agents";

const prisma = new PrismaClient();

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

async function main() {
  const passwordHash = await bcrypt.hash("BizSaathi@12345", 12);

  const tenant = await prisma.tenant.upsert({
    where: { slug: "bizsaathi-demo" },
    update: {},
    create: {
      name: "BizSaathi Demo",
      slug: "bizsaathi-demo",
      plan: "AGENCY",
      settings: {
        approvalMode: "human_required",
        defaultModelProvider: "ollama",
        defaultModelName: "llama3.1:8b",
      },
    },
  });

  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: "owner@bizsaathi.local" } },
    update: { passwordHash, role: "OWNER", isActive: true },
    create: {
      tenantId: tenant.id,
      email: "owner@bizsaathi.local",
      name: "BizSaathi Owner",
      passwordHash,
      role: "OWNER",
    },
  });

  for (const agent of agentRoles) {
    await prisma.agent.upsert({
      where: { tenantId_slug: { tenantId: tenant.id, slug: agent.slug } },
      update: {
        name: agent.name,
        mission: agent.mission,
        toolsAllowed: agent.tools,
      },
      create: {
        tenantId: tenant.id,
        name: agent.name,
        slug: agent.slug,
        kind: kindMap[agent.slug] ?? "CUSTOM",
        status: agent.status === "Draft" ? "DRAFT" : "ACTIVE",
        mission: agent.mission,
        systemPrompt: `You are ${agent.name}. Stay within role, create drafts by default, and request human approval for external actions.`,
        modelProvider: "ollama",
        modelName: "llama3.1:8b",
        adapterType: "http",
        toolsAllowed: agent.tools,
        approvalRequiredFor: ["publish", "send_email", "crm_update", "budget_change", "external_api_action"],
      },
    });
  }

  const ceo = await prisma.agent.findUnique({ where: { tenantId_slug: { tenantId: tenant.id, slug: "ceo" } } });
  if (ceo) {
    await prisma.agentTask.create({
      data: {
        tenantId: tenant.id,
        agentId: ceo.id,
        title: "Prepare weekly operating plan",
        goal: "Summarize active campaigns, lead follow-ups, approval blockers, and budget risks for the owner.",
        status: "WAITING_APPROVAL",
      },
    });
  }

  await prisma.integration.upsert({
    where: { tenantId_provider_name: { tenantId: tenant.id, provider: "PAPERCLIP", name: "Default Paperclip" } },
    update: {},
    create: {
      tenantId: tenant.id,
      provider: "PAPERCLIP",
      name: "Default Paperclip",
      isEnabled: false,
      config: { url: process.env.PAPERCLIP_API_URL ?? "http://paperclip:3001" },
    },
  });

  console.log("Seeded BizSaathi demo workspace");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
