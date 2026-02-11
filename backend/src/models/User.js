import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "doctor", "receptionist", "patient"], required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    profile: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: { type: String },
      avatarUrl: { type: String }
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
