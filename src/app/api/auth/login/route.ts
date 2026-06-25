import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { setSessionCookie, verifyPassword } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });

  const user = await db.user.findFirst({
    where: { email: parsed.data.email, isActive: true },
    include: { tenant: true },
  });

  if (!user || !user.tenant.isActive) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

  await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await setSessionCookie({ userId: user.id, tenantId: user.tenantId, role: user.role });

  return NextResponse.json({ ok: true, user: { email: user.email, name: user.name, role: user.role } });
}
