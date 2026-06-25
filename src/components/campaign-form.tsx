"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, inputClass } from "@/components/ui";

export function CampaignForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const channels = String(form.get("channels") ?? "")
      .split(",")
      .map((channel) => channel.trim())
      .filter(Boolean);

    const response = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        clientName: form.get("clientName"),
        objective: form.get("objective"),
        audience: form.get("audience"),
        channels,
      }),
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) {
      setMessage(data.error ?? "Could not create campaign");
      return;
    }
    event.currentTarget.reset();
    setMessage("Campaign created and ready for Marketing Agent planning.");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Campaign name">
        <input className={inputClass} name="name" placeholder="MSME Lead Magnet Sprint" required />
      </Field>
      <Field label="Client / brand">
        <input className={inputClass} name="clientName" placeholder="Internal or client name" />
      </Field>
      <Field label="Objective">
        <textarea className={`${inputClass} min-h-28`} name="objective" placeholder="Generate qualified leads, build awareness, launch offer..." required />
      </Field>
      <Field label="Audience">
        <input className={inputClass} name="audience" placeholder="MSME owners in NCR, clinics, coaching institutes..." />
      </Field>
      <Field label="Channels, comma separated">
        <input className={inputClass} name="channels" placeholder="LinkedIn, Meta, Email, WhatsApp" />
      </Field>
      {message ? <p className="rounded-2xl bg-blue-50 p-3 text-sm font-bold text-blue-800">{message}</p> : null}
      <button disabled={loading} className="w-full rounded-2xl bg-slate-950 px-5 py-3 font-black text-white disabled:opacity-60">
        {loading ? "Creating campaign..." : "Create campaign"}
      </button>
    </form>
  );
}
