import { registerUser } from "../services/authService.js";

export async function createDoctor(req, res, next) {
  try {
    const { email, password, firstName, lastName, phone } = req.body || {};
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "email, password, firstName, lastName are required" });
    }

    const user = await registerUser({
      email,
      password,
      role: "doctor",
      profile: { firstName, lastName, phone }
    });

    res.status(201).json({
      user: { _id: user._id, email: user.email, role: user.role, profile: user.profile }
    });
  } catch (e) {
    next(e);
  }
}
