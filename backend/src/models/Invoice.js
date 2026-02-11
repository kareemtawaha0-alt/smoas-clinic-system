import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", index: true },
    items: [{ name: String, price: Number, qty: { type: Number, default: 1 } }],
    currency: { type: String, default: "JOD" },
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: { type: String, enum: ["unpaid", "partial", "paid", "void"], default: "unpaid", index: true },
    paidAmount: { type: Number, default: 0 },
    issuedAt: { type: Date, default: Date.now, index: true },
    paidAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);
