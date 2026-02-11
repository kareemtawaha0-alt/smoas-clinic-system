import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";
import { listUsers } from "../controllers/userController.js";

const router = Router();
router.use(requireAuth);

// List users by role (used for booking UX)
router.get("/", requireRole("admin"), listUsers);

export default router;
