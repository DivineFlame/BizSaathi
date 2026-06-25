"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ApprovalActions({ approvalId }: { approvalId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"APPROVED" | "CHANGES_REQUESTED" | "REJECTED" | null>(null);
  const disabled = !approvalId || Boolean(loading);

  async function decide(status: "APPROVED" | "CHANGES_REQUESTED" | "REJECTED") {
    if (!approvalId) return;
    setLoading(status);
    await fetch(`/api/approvals/${approvalId}/decision`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status, decisionNote: `Decision: ${status}` }),
    }).catch(() => null);
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button disabled={disabled} onClick={() => decide("APPROVED")} className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-black text-white disabled:opacity-40">
        {loading === "APPROVED" ? "Approving..." : "Approve"}
      </button>
      <button disabled={disabled} onClick={() => decide("CHANGES_REQUESTED")} className="rounded-full bg-amber-500 px-4 py-2 text-xs font-black text-white disabled:opacity-40">
        Request changes
      </button>
      <button disabled={disabled} onClick={() => decide("REJECTED")} className="rounded-full bg-red-600 px-4 py-2 text-xs font-black text-white disabled:opacity-40">
        Reject
      </button>
    </div>
  );
}
