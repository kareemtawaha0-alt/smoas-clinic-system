import AuditLog from "../models/AuditLog.js";
import { parsePagination } from "../utils/pagination.js";

export async function listAudit(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);

    const [items, total] = await Promise.all([
      AuditLog.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
      AuditLog.countDocuments({})
    ]);

    res.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (e) {
    next(e);
  }
}
