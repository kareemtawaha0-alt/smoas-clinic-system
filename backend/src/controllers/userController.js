import User from "../models/User.js";

export async function listUsers(req, res, next) {
  try {
    const role = req.query.role;
    const filter = {};
    if (role) filter.role = role;

    const users = await User.find(filter)
      .select("_id role profile email")
      .sort({ "profile.firstName": 1, "profile.lastName": 1 });

    res.json({ items: users });
  } catch (e) {
    next(e);
  }
}
