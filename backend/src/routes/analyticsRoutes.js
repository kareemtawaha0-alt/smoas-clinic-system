import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";
import { adminDashboard, doctorDashboard, receptionistDashboard, patientDashboard } from "../controllers/analyticsController.js";

const router = Router();
router.use(requireAuth);

router.get("/admin", requireRole("admin"), adminDashboard);
router.get("/doctor", requireRole("doctor"), doctorDashboard);
router.get("/receptionist", requireRole("receptionist"), receptionistDashboard);
router.get("/patient", requireRole("patient"), patientDashboard);

export default router;
