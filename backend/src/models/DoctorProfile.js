import mongoose from "mongoose";

const doctorProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    specialty: { type: String, required: true },
    licenseNumber: { type: String },
    workingHours: {
      start: { type: String, default: "09:00" },
      end: { type: String, default: "17:00" }
    },
    room: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("DoctorProfile", doctorProfileSchema);
