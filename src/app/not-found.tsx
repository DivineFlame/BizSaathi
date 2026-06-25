import { AppShell } from "@/components/app-shell";
import { ButtonLink, Card } from "@/components/ui";

export default function NotFound() {
  return (
    <AppShell>
      <Card className="mx-auto max-w-xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-600">404</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">Workspace not found</h1>
        <p className="mt-3 text-slate-600">This route or agent role does not exist yet.</p>
        <div className="mt-6"><ButtonLink href="/agents">Open agents</ButtonLink></div>
      </Card>
    </AppShell>
  );
}
