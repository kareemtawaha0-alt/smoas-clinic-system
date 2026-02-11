import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { listNotifications, markRead } from "../controllers/notificationsController.js";

const router = Router();
router.use(requireAuth);

router.get("/", listNotifications);
router.post("/read", markRead);

export default router;
