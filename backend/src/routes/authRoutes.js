import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { login, register } from "../controllers/authController.js";

const router = Router();

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["admin", "doctor"]),
    profile: z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      phone: z.string().optional()
    })
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  })
});

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;
