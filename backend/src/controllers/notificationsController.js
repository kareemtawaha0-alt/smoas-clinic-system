import Notification from "../models/Notification.js";
import { parsePagination } from "../utils/pagination.js";

export async function listNotifications(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = { user: req.user._id };

    const [items, total] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments(filter)
    ]);

    res.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (e) {
    next(e);
  }
}

export async function markRead(req, res, next) {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { $set: { isRead: true } });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}
