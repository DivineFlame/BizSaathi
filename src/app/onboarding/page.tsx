import Link from "next/link";
import { OnboardingForm } from "@/components/auth-forms";
import { Card } from "@/components/ui";

export default function OnboardingPage() {
  return (
    <main className="grid min-h-screen place-items-center p-4">
      <Card className="w-full max-w-3xl">
        <Link href="/" className="text-sm font-black text-blue-600">← Back to BizSaathi</Link>
        <h1 className="mt-5 text-3xl font-black text-slate-950">Create your BizSaathi workspace</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">This creates the first tenant, owner user, and default AI agent team with approval-first governance.</p>
        <div className="mt-6">
          <OnboardingForm />
        </div>
      </Card>
    </main>
  );
}
