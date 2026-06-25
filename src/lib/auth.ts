import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { env } from "@/lib/env";
import { db } from "@/lib/db";

const encoder = new TextEncoder();

type SessionPayload = {
  userId: string;
  tenantId: string;
  role: string;
};

function getSecret() {
  const secret = env.AUTH_SECRET ?? "development-secret-change-me-development-secret";
  return encoder.encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function setSessionCookie(payload: SessionPayload) {
  const token = await createSessionToken(payload);
  const cookieStore = await cookies();

  cookieStore.set(env.AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(env.AUTH_COOKIE_NAME);
}

export async function readSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(env.AUTH_COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const verified = await jwtVerify(token, getSecret());
    return verified.payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const session = await readSession();
  if (!session) return null;

  return db.user.findFirst({
    where: {
      id: session.userId,
      tenantId: session.tenantId,
      isActive: true,
    },
    include: {
      tenant: true,
    },
  });
}
