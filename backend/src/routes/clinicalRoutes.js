import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";
import { validate } from "../middleware/validate.js";
import { createDiagnosis, listDiagnoses, createPrescription, listPrescriptions, getDiagnosisBundle } from "../controllers/clinicalController.js";

const router = Router();
router.use(requireAuth);

const diagSchema = z.object({
  body: z.object({
    patient: z.string().min(1),
    appointment: z.string().optional(),
    summary: z.string().min(3),
    details: z.string().optional()
  })
});

const rxSchema = z.object({
  body: z.object({
    patient: z.string().min(1),
    diagnosis: z.string().optional(),
    medications: z.array(z.object({
      name: z.string().min(1),
      dosage: z.string().optional(),
      frequency: z.string().optional(),
      duration: z.string().optional(),
      notes: z.string().optional()
    })).min(1)
  })
});

router.get("/diagnoses", requireRole("admin", "doctor"), listDiagnoses);
router.post("/diagnoses", requireRole("doctor"), validate(diagSchema), createDiagnosis);
router.get("/diagnoses/:id/bundle", requireRole("admin", "doctor"), getDiagnosisBundle);

router.get("/prescriptions", requireRole("admin", "doctor"), listPrescriptions);
router.post("/prescriptions", requireRole("doctor"), validate(rxSchema), createPrescription);

export default router;
