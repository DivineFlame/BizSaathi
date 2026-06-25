"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, inputClass } from "@/components/ui";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    setLoading(false);
    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: "Login failed" }));
      setError(data.error ?? "Login failed");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Email">
        <input className={inputClass} name="email" type="email" placeholder="owner@company.com" required />
      </Field>
      <Field label="Password">
        <input className={inputClass} name="password" type="password" placeholder="••••••••" required />
      </Field>
      {error ? <p className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
      <button disabled={loading} className="w-full rounded-2xl bg-slate-950 px-5 py-3 font-black text-white disabled:opacity-60">
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

export function OnboardingForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    setLoading(false);
    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: "Onboarding failed" }));
      setError(data.error ?? "Onboarding failed");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Company name">
        <input className={inputClass} name="companyName" placeholder="BizSaathi Demo" required />
      </Field>
      <Field label="Workspace slug">
        <input className={inputClass} name="slug" placeholder="bizsaathi-demo" required />
      </Field>
      <Field label="Owner name">
        <input className={inputClass} name="name" placeholder="Manoj" required />
      </Field>
      <Field label="Owner email">
        <input className={inputClass} name="email" type="email" placeholder="owner@company.com" required />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Password">
          <input className={inputClass} name="password" type="password" minLength={10} placeholder="Minimum 10 characters" required />
        </Field>
      </div>
      {error ? <p className="rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700 sm:col-span-2">{error}</p> : null}
      <button disabled={loading} className="rounded-2xl bg-slate-950 px-5 py-3 font-black text-white disabled:opacity-60 sm:col-span-2">
        {loading ? "Creating workspace..." : "Create BizSaathi workspace"}
      </button>
    </form>
  );
}
