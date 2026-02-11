import { Router } from "express";
import multer from "multer";
import path from "path";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";
import { env } from "../config/env.js";
import { uploadSingle } from "../controllers/uploadController.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, env.UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}_${safe}`);
  }
});

const upload = multer({ storage });

router.post("/", requireAuth, requireRole("admin", "doctor", "receptionist"), upload.single("file"), uploadSingle);

export default router;
