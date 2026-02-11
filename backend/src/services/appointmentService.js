import createError from "http-errors";
import Appointment from "../models/Appointment.js";

export async function hasConflict({ doctorId, startAt, endAt, excludeId = null }) {
  const query = {
    doctor: doctorId,
    status: { $in: ["booked", "completed"] },
    $or: [
      { startAt: { $lt: endAt }, endAt: { $gt: startAt } } // overlap
    ]
  };
  if (excludeId) query._id = { $ne: excludeId };
  const existing = await Appointment.findOne(query).lean();
  return Boolean(existing);
}

export async function assertNoConflict(args) {
  const conflict = await hasConflict(args);
  if (conflict) throw createError(409, "Appointment conflict detected for this doctor/time slot");
}
