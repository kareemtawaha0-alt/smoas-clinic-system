import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";
import { createDoctor } from "../controllers/adminController.js";

const router = Router();
router.use(requireAuth, requireRole("admin"));

router.post("/doctors", createDoctor);

export default router;
