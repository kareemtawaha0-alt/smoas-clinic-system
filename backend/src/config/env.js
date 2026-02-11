import dotenv from "dotenv";
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 5000),
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smoas",
  JWT_SECRET: process.env.JWT_SECRET || "change-me",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "12h",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
  UPLOAD_DIR: process.env.UPLOAD_DIR || "uploads"
};
