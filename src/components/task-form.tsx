"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, inputClass } from "@/components/ui";
import type { AgentRole } from "@/lib/types";

export function TaskForm({ agent }: { agent: AgentRole }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/agent-tasks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        agentSlug: agent.slug,
        title: form.get("title"),
        goal: form.get("goal"),
        approvalRequired: form.get("approvalRequired") === "on",
      }),
    });

    const data = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      setMessage(data.error ?? "Could not create task");
      return;
    }

    setMessage(data.paperclip?.message ?? "Task created successfully");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Task title">
        <input className={inputClass} name="title" placeholder={`Ask ${agent.name} to prepare...`} required />
      </Field>
      <Field label="Goal and instructions">
        <textarea
          className={`${inputClass} min-h-40 resize-y`}
          name="goal"
          placeholder="Describe the business goal, audience, constraints, expected format, and approval needs."
          required
        />
      </Field>
      <label className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">
        <input name="approvalRequired" type="checkbox" defaultChecked className="h-4 w-4" />
        Require human approval before any external action
      </label>
      {message ? <p className="rounded-2xl bg-blue-50 p-3 text-sm font-bold text-blue-800">{message}</p> : null}
      <button disabled={loading} className="w-full rounded-2xl bg-slate-950 px-5 py-3 font-black text-white disabled:opacity-60">
        {loading ? "Creating task..." : "Create governed agent task"}
      </button>
    </form>
  );
}
