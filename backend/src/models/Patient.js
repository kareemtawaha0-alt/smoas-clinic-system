import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true }, 
    firstName: { type: String, required: true, index: true },
    lastName: { type: String, required: true, index: true },
    phone: { type: String, index: true },
    email: { type: String, lowercase: true, index: true },
    dob: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    address: { type: String },
    emergencyContact: {
      name: String,
      phone: String,
      relation: String
    },
    medicalHistory: {
      allergies: [String],
      chronicDiseases: [String],
      medications: [String],
      notes: String
    },
    files: [
      {
        name: String,
        url: String,
        mimeType: String,
        uploadedAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

patientSchema.index({ firstName: "text", lastName: "text", phone: "text", email: "text" });

export default mongoose.model("Patient", patientSchema);
