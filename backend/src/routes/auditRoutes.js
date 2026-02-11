import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";
import { listAudit } from "../controllers/auditController.js";

const router = Router();
router.use(requireAuth);
router.get("/", requireRole("admin"), listAudit);

export default router;
