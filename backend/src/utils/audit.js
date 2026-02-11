import AuditLog from "../models/AuditLog.js";

export async function audit({ actorId, actorRole, action, entity, entityId, meta = {} }) {
  try {
    await AuditLog.create({ actorId, actorRole, action, entity, entityId, meta });
  } catch {
    // never break main flow for audit
  }
}
