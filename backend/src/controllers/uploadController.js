import path from "path";
import createError from "http-errors";

export async function uploadSingle(req, res, next) {
  try {
    if (!req.file) throw createError(400, "Missing file");
    const url = `/uploads/${req.file.filename}`;
    res.status(201).json({
      name: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url
    });
  } catch (e) {
    next(e);
  }
}
