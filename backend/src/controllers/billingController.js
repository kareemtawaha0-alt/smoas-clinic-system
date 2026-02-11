import createError from "http-errors";
import Invoice from "../models/Invoice.js";
import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import { parsePagination } from "../utils/pagination.js";
import { audit } from "../utils/audit.js";
import { calcTotals, nextInvoiceNumber } from "../services/invoiceService.js";

export async function generateInvoice(req, res, next) {
  try {
    const actor = req.user;
    const { appointmentId, items, tax = 0, currency = "JOD" } = req.validated.body;

    const appt = await Appointment.findById(appointmentId);
    if (!appt) throw createError(404, "Appointment not found");

    const patient = await Patient.findById(appt.patient);
    if (!patient) throw createError(404, "Patient not found");

    const invoiceNumber = await nextInvoiceNumber();
    const totals = calcTotals(items, tax);

    const inv = await Invoice.create({
      invoiceNumber,
      patient: patient._id,
      appointment: appt._id,
      items,
      tax,
      currency,
      subtotal: totals.subtotal,
      total: totals.total
    });

    await audit({ actorId: actor._id, actorRole: actor.role, action: "create", entity: "Invoice", entityId: String(inv._id) });

    res.status(201).json(inv);
  } catch (e) {
    next(e);
  }
}

export async function listInvoices(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const q = (req.query.q || "").trim();
    const status = req.query.status;

    const filter = {};
    if (status) filter.status = status;
    if (q) filter.invoiceNumber = { $regex: q, $options: "i" };

    const [items, total] = await Promise.all([
      Invoice.find(filter).populate("patient", "firstName lastName phone").sort({ issuedAt: -1 }).skip(skip).limit(limit),
      Invoice.countDocuments(filter)
    ]);

    res.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (e) {
    next(e);
  }
}

export async function recordPayment(req, res, next) {
  try {
    const actor = req.user;
    const { amount } = req.validated.body;

    const inv = await Invoice.findById(req.params.id);
    if (!inv) throw createError(404, "Invoice not found");
    if (inv.status === "void") throw createError(400, "Invoice is void");

    inv.paidAmount = Number(inv.paidAmount || 0) + Number(amount || 0);
    if (inv.paidAmount >= inv.total) {
      inv.status = "paid";
      inv.paidAt = new Date();
      inv.paidAmount = inv.total;
    } else if (inv.paidAmount > 0) {
      inv.status = "partial";
    }
    await inv.save();

    await audit({ actorId: actor._id, actorRole: actor.role, action: "payment", entity: "Invoice", entityId: String(inv._id), meta: { amount } });

    res.json(inv);
  } catch (e) {
    next(e);
  }
}
