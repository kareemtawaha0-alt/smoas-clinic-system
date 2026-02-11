import createError from "http-errors";
import Diagnosis from "../models/Diagnosis.js";
import Prescription from "../models/Prescription.js";
import { parsePagination } from "../utils/pagination.js";
import { audit } from "../utils/audit.js";

export async function createDiagnosis(req, res, next) {
  try {
    const actor = req.user;
    const data = req.validated.body;

    const diag = await Diagnosis.create({ ...data, doctor: actor._id });
    await audit({ actorId: actor._id, actorRole: actor.role, action: "create", entity: "Diagnosis", entityId: String(diag._id) });

    res.status(201).json(diag);
  } catch (e) {
    next(e);
  }
}

export async function listDiagnoses(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};
    if (req.query.patientId) filter.patient = req.query.patientId;
    if (req.user.role === "doctor") filter.doctor = req.user._id;

    const [items, total] = await Promise.all([
      Diagnosis.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Diagnosis.countDocuments(filter)
    ]);

    res.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (e) {
    next(e);
  }
}

export async function createPrescription(req, res, next) {
  try {
    const actor = req.user;
    const data = req.validated.body;

    const rx = await Prescription.create({ ...data, doctor: actor._id });
    await audit({ actorId: actor._id, actorRole: actor.role, action: "create", entity: "Prescription", entityId: String(rx._id) });

    res.status(201).json(rx);
  } catch (e) {
    next(e);
  }
}

export async function listPrescriptions(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};
    if (req.query.patientId) filter.patient = req.query.patientId;
    if (req.user.role === "doctor") filter.doctor = req.user._id;

    const [items, total] = await Promise.all([
      Prescription.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Prescription.countDocuments(filter)
    ]);

    res.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (e) {
    next(e);
  }
}

export async function getDiagnosisBundle(req, res, next) {
  try {
    const diagnosis = await Diagnosis.findById(req.params.id);
    if (!diagnosis) throw createError(404, "Diagnosis not found");

    const prescriptions = await Prescription.find({ diagnosis: diagnosis._id }).sort({ createdAt: -1 });
    res.json({ diagnosis, prescriptions });
  } catch (e) {
    next(e);
  }
}
