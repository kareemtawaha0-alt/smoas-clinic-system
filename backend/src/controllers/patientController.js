import createError from "http-errors";
import Patient from "../models/Patient.js";
import { parsePagination } from "../utils/pagination.js";
import { audit } from "../utils/audit.js";

export async function createPatient(req, res, next) {
  try {
    const actor = req.user;
    const data = req.validated.body;

    const patient = await Patient.create(data);
    await audit({ actorId: actor._id, actorRole: actor.role, action: "create", entity: "Patient", entityId: String(patient._id), meta: { data } });

    res.status(201).json(patient);
  } catch (e) {
    next(e);
  }
}

export async function listPatients(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const q = (req.query.q || "").trim();

    const filter = q
      ? { $text: { $search: q } }
      : {};

    const [items, total] = await Promise.all([
      Patient.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Patient.countDocuments(filter)
    ]);

    res.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (e) {
    next(e);
  }
}

export async function getPatient(req, res, next) {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) throw createError(404, "Patient not found");
    res.json(patient);
  } catch (e) {
    next(e);
  }
}

export async function updatePatient(req, res, next) {
  try {
    const actor = req.user;
    const data = req.validated.body;

    const patient = await Patient.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!patient) throw createError(404, "Patient not found");

    await audit({ actorId: actor._id, actorRole: actor.role, action: "update", entity: "Patient", entityId: String(patient._id), meta: { data } });

    res.json(patient);
  } catch (e) {
    next(e);
  }
}

export async function deletePatient(req, res, next) {
  try {
    const actor = req.user;
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) throw createError(404, "Patient not found");

    await audit({ actorId: actor._id, actorRole: actor.role, action: "delete", entity: "Patient", entityId: String(patient._id) });

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}
