import { env } from "@/lib/env";
import type { PaperclipTaskPayload, PaperclipTaskResult } from "@/lib/types";

export async function createPaperclipTask(payload: PaperclipTaskPayload): Promise<PaperclipTaskResult> {
  const endpoint = env.PAPERCLIP_API_URL;

  if (!endpoint) {
    return {
      mode: "mock",
      taskId: `mock_${Date.now()}`,
      status: "queued",
      message: "Paperclip is not configured. The task was accepted in safe mock mode.",
    };
  }

  try {
    const response = await fetch(`${endpoint.replace(/\/$/, "")}/api/tasks`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(env.PAPERCLIP_API_KEY ? { authorization: `Bearer ${env.PAPERCLIP_API_KEY}` } : {}),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        mode: "paperclip",
        taskId: `failed_${Date.now()}`,
        status: "failed",
        message: `Paperclip returned HTTP ${response.status}`,
      };
    }

    const data = (await response.json()) as { id?: string; taskId?: string; status?: string };

    return {
      mode: "paperclip",
      taskId: data.taskId ?? data.id ?? `paperclip_${Date.now()}`,
      status: "queued",
      message: "Task queued in Paperclip.",
    };
  } catch (error) {
    return {
      mode: "paperclip",
      taskId: `failed_${Date.now()}`,
      status: "failed",
      message: error instanceof Error ? error.message : "Unknown Paperclip connection error",
    };
  }
}

export async function checkPaperclipStatus() {
  const endpoint = env.PAPERCLIP_API_URL;
  if (!endpoint) return { configured: false, ok: false, message: "PAPERCLIP_API_URL not set" };

  try {
    const response = await fetch(`${endpoint.replace(/\/$/, "")}/health`, {
      headers: env.PAPERCLIP_API_KEY ? { authorization: `Bearer ${env.PAPERCLIP_API_KEY}` } : undefined,
      cache: "no-store",
    });
    return { configured: true, ok: response.ok, message: `HTTP ${response.status}` };
  } catch (error) {
    return { configured: true, ok: false, message: error instanceof Error ? error.message : "Connection failed" };
  }
}
