import { NextResponse } from "next/server";
import { checkPaperclipStatus } from "@/lib/paperclip";

export async function GET() {
  const paperclip = await checkPaperclipStatus();
  const ollamaUrl = process.env.OLLAMA_BASE_URL;
  let ollama = { configured: Boolean(ollamaUrl), ok: false, message: "OLLAMA_BASE_URL not set" };

  if (ollamaUrl) {
    try {
      const response = await fetch(`${ollamaUrl.replace(/\/$/, "")}/api/tags`, { cache: "no-store" });
      ollama = { configured: true, ok: response.ok, message: `HTTP ${response.status}` };
    } catch (error) {
      ollama = { configured: true, ok: false, message: error instanceof Error ? error.message : "Connection failed" };
    }
  }

  return NextResponse.json({ paperclip, ollama });
}
