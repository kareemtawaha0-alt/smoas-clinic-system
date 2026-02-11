import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";
import { validate } from "../middleware/validate.js";
import { createPatient, listPatients, getPatient, updatePatient, deletePatient } from "../controllers/patientController.js";

const router = Router();

const patientSchema = z.object({
  body: z.object({
    user: z.string().optional(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    dob: z.string().datetime().optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    address: z.string().optional(),
    emergencyContact: z.object({
      name: z.string().optional(),
      phone: z.string().optional(),
      relation: z.string().optional()
    }).optional(),
    medicalHistory: z.object({
      allergies: z.array(z.string()).optional(),
      chronicDiseases: z.array(z.string()).optional(),
      medications: z.array(z.string()).optional(),
      notes: z.string().optional()
    }).optional()
  })
});

router.use(requireAuth);

router.get("/", requireRole("admin", "doctor"), listPatients);
router.post("/", requireRole("admin"), validate(patientSchema), createPatient);
router.get("/:id", requireRole("admin", "doctor"), getPatient);
router.put("/:id", requireRole("admin"), validate(patientSchema), updatePatient);
router.delete("/:id", requireRole("admin"), deletePatient);

export default router;
