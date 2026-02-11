import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    type: { type: String, enum: ["appointment", "billing", "system"], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: { type: Object, default: {} },
    isRead: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
