import createError from "http-errors";
import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import User from "../models/User.js";
import { parsePagination } from "../utils/pagination.js";
import { audit } from "../utils/audit.js";
import { assertNoConflict } from "../services/appointmentService.js";
import Notification from "../models/Notification.js";
import { emitToUser } from "../socket/socket.js";

async function notify(userId, type, title, message, data) {
  const n = await Notification.create({ user: userId, type, title, message, data });
  emitToUser(String(userId), "notify", n);
  return n;
}

export async function createAppointment(req, res, next) {
  try {
    const actor = req.user;
    const { patient, doctor, startAt, endAt, reason } = req.validated.body;

    const [p, d] = await Promise.all([
      Patient.findById(patient),
      User.findOne({ _id: doctor, role: "doctor" })
    ]);
    if (!p) throw createError(404, "Patient not found");
    if (!d) throw createError(404, "Doctor not found");

    await assertNoConflict({ doctorId: doctor, startAt: new Date(startAt), endAt: new Date(endAt) });

    const appt = await Appointment.create({
      patient,
      doctor,
      startAt,
      endAt,
      reason,
      createdBy: actor._id
    });

    await audit({ actorId: actor._id, actorRole: actor.role, action: "create", entity: "Appointment", entityId: String(appt._id) });

    // Real-time notifications
    await Promise.all([
      notify(doctor, "appointment", "New appointment", "You have a new booked appointment.", { appointmentId: appt._id }),
      p.user ? notify(p.user, "appointment", "Appointment confirmed", "Your appointment has been booked.", { appointmentId: appt._id }) : Promise.resolve()
    ]);

    res.status(201).json(appt);
  } catch (e) {
    next(e);
  }
}

export async function listAppointments(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const q = (req.query.q || "").trim();
    const status = req.query.status;
    const from = req.query.from ? new Date(req.query.from) : null;
    const to = req.query.to ? new Date(req.query.to) : null;

    const filter = {};
    if (status) filter.status = status;
    if (from || to) filter.startAt = { ...(from ? { $gte: from } : {}), ...(to ? { $lte: to } : {}) };

    // Role scoping
    if (req.user.role === "doctor") filter.doctor = req.user._id;
    if (req.user.role === "patient") filter.patient = req.user.patientId; // optional mapping if you store it

    if (q) {
      // Simple ID match; richer search can be implemented by joining patient names
      filter.$or = [{ reason: { $regex: q, $options: "i" } }];
    }

    const [items, total] = await Promise.all([
      Appointment.find(filter)
        .populate("patient", "firstName lastName phone")
        .populate("doctor", "profile.firstName profile.lastName")
        .sort({ startAt: 1 })
        .skip(skip)
        .limit(limit),
      Appointment.countDocuments(filter)
    ]);

    res.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (e) {
    next(e);
  }
}

export async function updateAppointment(req, res, next) {
  try {
    const actor = req.user;
    const { startAt, endAt, doctor, status, reason, notes } = req.validated.body;

    const appt = await Appointment.findById(req.params.id);
    if (!appt) throw createError(404, "Appointment not found");

    const newDoctor = doctor || appt.doctor;
    const newStart = startAt ? new Date(startAt) : appt.startAt;
    const newEnd = endAt ? new Date(endAt) : appt.endAt;

    // Only check conflict if time/doctor changed & appointment active
    if (status !== "cancelled" && (String(newDoctor) !== String(appt.doctor) || +newStart !== +appt.startAt || +newEnd !== +appt.endAt)) {
      await assertNoConflict({ doctorId: newDoctor, startAt: newStart, endAt: newEnd, excludeId: appt._id });
    }

    appt.doctor = newDoctor;
    appt.startAt = newStart;
    appt.endAt = newEnd;
    if (typeof status === "string") appt.status = status;
    if (typeof reason === "string") appt.reason = reason;
    if (typeof notes === "string") appt.notes = notes;

    await appt.save();

    await audit({ actorId: actor._id, actorRole: actor.role, action: "update", entity: "Appointment", entityId: String(appt._id) });

    // Notify
    await notify(appt.doctor, "appointment", "Appointment updated", "An appointment was updated.", { appointmentId: appt._id });

    res.json(appt);
  } catch (e) {
    next(e);
  }
}

export async function cancelAppointment(req, res, next) {
  try {
    const actor = req.user;

    const appt = await Appointment.findById(req.params.id).populate("patient");
    if (!appt) throw createError(404, "Appointment not found");

    appt.status = "cancelled";
    await appt.save();

    await audit({ actorId: actor._id, actorRole: actor.role, action: "cancel", entity: "Appointment", entityId: String(appt._id) });

    await Promise.all([
      notify(appt.doctor, "appointment", "Appointment cancelled", "An appointment was cancelled.", { appointmentId: appt._id }),
      appt.patient?.user ? notify(appt.patient.user, "appointment", "Appointment cancelled", "Your appointment was cancelled.", { appointmentId: appt._id }) : Promise.resolve()
    ]);

    res.json(appt);
  } catch (e) {
    next(e);
  }
}
