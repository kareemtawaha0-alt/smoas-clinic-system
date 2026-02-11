import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    diagnosis: { type: mongoose.Schema.Types.ObjectId, ref: "Diagnosis" },
    medications: [
      {
        name: { type: String, required: true },
        dosage: { type: String },
        frequency: { type: String },
        duration: { type: String },
        notes: { type: String }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Prescription", prescriptionSchema);
