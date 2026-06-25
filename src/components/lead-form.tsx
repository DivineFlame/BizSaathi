"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, inputClass } from "@/components/ui";

export function LeadForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) {
      setMessage(data.error ?? "Could not create lead");
      return;
    }
    event.currentTarget.reset();
    setMessage("Lead captured. Sales & CRM Agent can now score and draft follow-up.");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Lead / company name">
        <input className={inputClass} name="name" placeholder="Aarav Foods" required />
      </Field>
      <Field label="Contact email">
        <input className={inputClass} name="email" type="email" placeholder="owner@example.com" />
      </Field>
      <Field label="Phone">
        <input className={inputClass} name="phone" placeholder="+91..." />
      </Field>
      <Field label="Source">
        <input className={inputClass} name="source" placeholder="Website, LinkedIn, Referral" />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Notes">
          <textarea className={`${inputClass} min-h-24`} name="notes" placeholder="Need CRM, social media automation, or campaign support..." />
        </Field>
      </div>
      {message ? <p className="rounded-2xl bg-blue-50 p-3 text-sm font-bold text-blue-800 sm:col-span-2">{message}</p> : null}
      <button disabled={loading} className="rounded-2xl bg-slate-950 px-5 py-3 font-black text-white disabled:opacity-60 sm:col-span-2">
        {loading ? "Saving lead..." : "Capture lead"}
      </button>
    </form>
  );
}
