import { logger } from "../utils/logger.js";

export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Server Error";
  if (status >= 500) logger.error(err);
  res.status(status).json({
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  });
}
