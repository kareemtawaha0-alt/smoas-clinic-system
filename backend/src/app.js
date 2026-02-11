import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import { env } from "./config/env.js";
import { apiRouter } from "./routes/index.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());

app.use(
  cors({
    origin: env.CORS_ORIGIN.split(",").map((s) => s.trim()),
    credentials: true
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200
  })
);

if (env.NODE_ENV !== "test") app.use(morgan("dev"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "..", env.UPLOAD_DIR)));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api", apiRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
