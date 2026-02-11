import { Router } from "express";
import authRoutes from "./authRoutes.js";
import adminRoutes from "./adminRoutes.js";
import userRoutes from "./userRoutes.js";
import patientRoutes from "./patientRoutes.js";
import appointmentRoutes from "./appointmentRoutes.js";
import clinicalRoutes from "./clinicalRoutes.js";
import billingRoutes from "./billingRoutes.js";
import analyticsRoutes from "./analyticsRoutes.js";
import auditRoutes from "./auditRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import notificationsRoutes from "./notificationsRoutes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/admin", adminRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/patients", patientRoutes);
apiRouter.use("/appointments", appointmentRoutes);
apiRouter.use("/clinical", clinicalRoutes);
apiRouter.use("/invoices", billingRoutes);
apiRouter.use("/analytics", analyticsRoutes);
apiRouter.use("/audit", auditRoutes);
apiRouter.use("/uploads", uploadRoutes);
apiRouter.use("/notifications", notificationsRoutes);
