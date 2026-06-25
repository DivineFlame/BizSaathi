import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: process.env.NEXT_PUBLIC_APP_NAME ?? "BizSaathi",
    timestamp: new Date().toISOString(),
  });
}
