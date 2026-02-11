import createError from "http-errors";

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(createError(401, "Unauthenticated"));
    if (!roles.includes(req.user.role)) return next(createError(403, "Forbidden"));
    next();
  };
}
