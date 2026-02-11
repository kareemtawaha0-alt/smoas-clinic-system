import jwt from "jsonwebtoken";
import createError from "http-errors";
import { env } from "../config/env.js";
import User from "../models/User.js";

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return next(createError(401, "Missing token"));

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(payload.sub).select("-passwordHash");
    if (!user) return next(createError(401, "Invalid token user"));
    req.user = user;
    next();
  } catch (e) {
    next(createError(401, "Invalid/expired token"));
  }
}
