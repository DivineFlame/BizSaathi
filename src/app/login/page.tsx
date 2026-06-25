import Link from "next/link";
import { LoginForm } from "@/components/auth-forms";
import { Card } from "@/components/ui";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center p-4">
      <Card className="w-full max-w-md">
        <Link href="/" className="text-sm font-black text-blue-600">← Back to BizSaathi</Link>
        <h1 className="mt-5 text-3xl font-black text-slate-950">Sign in</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Access your tenant workspace, agent manager, approvals, and Paperclip configuration.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
        <p className="mt-5 text-center text-sm text-slate-500">
          New workspace? <Link href="/onboarding" className="font-black text-blue-600">Create one</Link>
        </p>
      </Card>
    </main>
  );
}
