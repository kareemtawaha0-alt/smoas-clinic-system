import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }, // role=doctor
    startAt: { type: Date, required: true, index: true },
    endAt: { type: Date, required: true, index: true },
    status: { type: String, enum: ["booked", "cancelled", "completed", "no_show"], default: "booked", index: true },
    reason: { type: String },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

// Helps query overlaps
appointmentSchema.index({ doctor: 1, startAt: 1, endAt: 1, status: 1 });

export default mongoose.model("Appointment", appointmentSchema);
