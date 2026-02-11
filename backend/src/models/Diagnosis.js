import mongoose from "mongoose";

const diagnosisSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    summary: { type: String, required: true },
    details: { type: String },
    attachments: [{ name: String, url: String }]
  },
  { timestamps: true }
);

export default mongoose.model("Diagnosis", diagnosisSchema);
