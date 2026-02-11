import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";
import { validate } from "../middleware/validate.js";
import { createAppointment, listAppointments, updateAppointment, cancelAppointment } from "../controllers/appointmentController.js";

const router = Router();

const schema = z.object({
  body: z.object({
    patient: z.string().min(1),
    doctor: z.string().min(1),
    startAt: z.string().datetime(),
    endAt: z.string().datetime(),
    reason: z.string().optional()
  })
});

const updateSchema = z.object({
  body: z.object({
    doctor: z.string().optional(),
    startAt: z.string().datetime().optional(),
    endAt: z.string().datetime().optional(),
    status: z.enum(["booked", "cancelled", "completed", "no_show"]).optional(),
    reason: z.string().optional(),
    notes: z.string().optional()
  })
});

router.use(requireAuth);

router.get("/", requireRole("admin", "doctor"), listAppointments);
router.post("/", requireRole("admin"), validate(schema), createAppointment);
router.put("/:id", requireRole("admin"), validate(updateSchema), updateAppointment);
router.post("/:id/cancel", requireRole("admin"), cancelAppointment);

export default router;
