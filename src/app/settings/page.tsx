import { AppShell } from "@/components/app-shell";
import { IntegrationStatus } from "@/components/integration-status";
import { PageHeader } from "@/components/page-header";
import { Badge, Card } from "@/components/ui";

const checks = [
  { label: "App port", value: process.env.PORT || "8080" },
  { label: "Public URL", value: process.env.NEXT_PUBLIC_APP_URL || "Not configured" },
  { label: "Paperclip API", value: process.env.PAPERCLIP_API_URL || "Not configured" },
  { label: "Ollama URL", value: process.env.OLLAMA_BASE_URL || "Not configured" },
  { label: "Default model", value: process.env.DEFAULT_MODEL_NAME || "llama3.1:8b" },
  { label: "Database", value: process.env.DATABASE_URL ? "Configured" : "Missing" },
];

export default function SettingsPage() {
  return (
    <AppShell active="/settings">
      <PageHeader
        eyebrow="System settings"
        title="Configure Paperclip, Ollama, governance, and deployment."
        description="Store secrets in Dokploy environment variables. BizSaathi no longer uses port 3000; route Dokploy to container port 8080."
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <div className="space-y-5">
          <Card>
            <h2 className="text-xl font-black text-slate-950">Runtime configuration</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {checks.map((check) => (
                <div key={check.label} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-500">{check.label}</p>
                  <p className="mt-2 break-words text-sm font-black text-slate-950">{check.value}</p>
                </div>
              ))}
            </div>
          </Card>
          <IntegrationStatus />
        </div>

        <Card>
          <h2 className="text-xl font-black text-slate-950">Approval rules</h2>
          <div className="mt-5 space-y-3">
            {[
              "Social publishing",
              "Email sending",
              "WhatsApp sending",
              "CRM record update",
              "Budget or discount change",
              "High-risk factual claim",
            ].map((rule) => (
              <div key={rule} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-3">
                <span className="text-sm font-bold text-slate-700">{rule}</span>
                <Badge tone="warning">Human approval</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
