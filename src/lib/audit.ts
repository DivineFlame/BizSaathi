import { db } from "@/lib/db";

type AuditInput = {
  tenantId: string;
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
};

export async function audit(input: AuditInput) {
  try {
    await db.auditLog.create({
      data: {
        tenantId: input.tenantId,
        userId: input.userId ?? null,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId ?? null,
        metadata: input.metadata ?? {},
      },
    });
  } catch (error) {
    console.warn("Audit log write failed", error);
  }
}
