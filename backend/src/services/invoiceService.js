import Invoice from "../models/Invoice.js";

export function calcTotals(items, tax = 0) {
  const subtotal = items.reduce((sum, it) => sum + (Number(it.price || 0) * Number(it.qty || 1)), 0);
  const total = subtotal + Number(tax || 0);
  return { subtotal, total };
}

export async function nextInvoiceNumber() {
  // simple sequential-ish id
  const prefix = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const count = await Invoice.countDocuments({ invoiceNumber: new RegExp(`^INV-${prefix}-`) });
  const seq = String(count + 1).padStart(4, "0");
  return `INV-${prefix}-${seq}`;
}
