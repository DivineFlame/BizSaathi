import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function requireApiUser() {
  const user = await getCurrentUser();
  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    } as const;
  }

  return { user, response: null } as const;
}

export function forbidden(message = "You do not have permission to perform this action") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function canApprove(role: string) {
  return ["OWNER", "ADMIN", "APPROVER", "MANAGER"].includes(role);
}

export function canManage(role: string) {
  return ["OWNER", "ADMIN", "MANAGER"].includes(role);
}
