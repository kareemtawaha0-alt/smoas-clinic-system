import { loginUser, registerUser } from "../services/authService.js";

export async function register(req, res, next) {
  try {
    const allowedRoles = ["admin", "doctor"];
    if (!allowedRoles.includes(req.body?.role)) {
      return res.status(400).json({ message: "Only admin and doctor roles are supported" });
    }
    const { email, password, role, profile } = req.validated.body;
    const user = await registerUser({ email, password, role, profile });
    res.status(201).json({ user: sanitize(user) });
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.validated.body;
    const { user, token } = await loginUser({ email, password });
    res.json({ token, user: sanitize(user) });
  } catch (e) {
    next(e);
  }
}

function sanitize(user) {
  const u = user.toObject ? user.toObject() : user;
  delete u.passwordHash;
  return u;
}
