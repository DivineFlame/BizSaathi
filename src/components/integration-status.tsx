"use client";

import { useEffect, useState } from "react";
import { Badge, Card } from "@/components/ui";

type Check = { configured: boolean; ok: boolean; message: string };
type Checks = { paperclip: Check; ollama: Check };

export function IntegrationStatus() {
  const [checks, setChecks] = useState<Checks | null>(null);

  useEffect(() => {
    fetch("/api/settings/checks")
      .then((response) => response.json())
      .then(setChecks)
      .catch(() => setChecks(null));
  }, []);

  return (
    <Card>
      <h2 className="text-xl font-black text-slate-950">Live connection checks</h2>
      <div className="mt-5 space-y-3">
        <ConnectionRow label="Paperclip" check={checks?.paperclip} />
        <ConnectionRow label="Ollama" check={checks?.ollama} />
      </div>
    </Card>
  );
}

function ConnectionRow({ label, check }: { label: string; check?: Check }) {
  const tone = !check ? "neutral" : check.ok ? "good" : check.configured ? "warning" : "danger";
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4">
      <div>
        <p className="font-black text-slate-950">{label}</p>
        <p className="mt-1 text-sm text-slate-500">{check?.message ?? "Checking..."}</p>
      </div>
      <Badge tone={tone}>{check?.ok ? "Connected" : check?.configured ? "Configured" : "Missing"}</Badge>
    </div>
  );
}
