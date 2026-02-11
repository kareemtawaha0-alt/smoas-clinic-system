import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";
import { validate } from "../middleware/validate.js";
import { generateInvoice, listInvoices, recordPayment } from "../controllers/billingController.js";

const router = Router();
router.use(requireAuth);

const genSchema = z.object({
  body: z.object({
    appointmentId: z.string().min(1),
    items: z.array(z.object({ name: z.string(), price: z.number(), qty: z.number().optional() })).min(1),
    tax: z.number().optional(),
    currency: z.string().optional()
  })
});

const paySchema = z.object({
  body: z.object({
    amount: z.number().positive()
  })
});

router.get("/", requireRole("admin"), listInvoices);
router.post("/generate", requireRole("admin"), validate(genSchema), generateInvoice);
router.post("/:id/pay", requireRole("admin"), validate(paySchema), recordPayment);

export default router;
