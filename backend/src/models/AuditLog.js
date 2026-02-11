import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    actorRole: { type: String },
    action: { type: String, required: true }, // create/update/delete/login/etc.
    entity: { type: String, required: true }, // Patient/Appointment/Invoice...
    entityId: { type: String },
    meta: { type: Object, default: {} }
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });

export default mongoose.model("AuditLog", auditLogSchema);
