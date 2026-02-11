import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createError from "http-errors";
import { env } from "../config/env.js";
import User from "../models/User.js";
import Patient from "../models/Patient.js";
import { audit } from "../utils/audit.js";

export async function registerUser({ email, password, role, profile }) {
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) throw createError(409, "Email already in use");

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    email: email.toLowerCase(),
    passwordHash,
    role,
    profile
  });


// Auto-create Patient entity for patient role (so Patient portal works without manual IDs)
if (role === "patient") {
  const patient = await Patient.create({
    user: user._id,
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.phone,
    email: user.email
  });
  user.patientId = patient._id;
  await user.save();
}

  await audit({ actorId: user._id, actorRole: role, action: "register", entity: "User", entityId: String(user._id) });

  return user;
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase(), isActive: true });
  if (!user) throw createError(401, "Invalid credentials");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw createError(401, "Invalid credentials");

  const token = jwt.sign({ role: user.role }, env.JWT_SECRET, {
    subject: String(user._id),
    expiresIn: env.JWT_EXPIRES_IN
  });

  await audit({ actorId: user._id, actorRole: user.role, action: "login", entity: "User", entityId: String(user._id) });

  return { user, token };
}


// Alias used by admin tooling
export async function createUser(args) {
  return registerUser(args);
}
