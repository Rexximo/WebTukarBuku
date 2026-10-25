import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import type { RequestHandler } from "express";
import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";

const uploadDir = path.resolve(process.cwd(), env.UPLOAD_DIR);
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDir);
  },
  filename: (_req, file, callback) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    callback(null, `${unique}${path.extname(file.originalname).toLowerCase()}`);
  },
});

const imageUpload = multer({
  storage,
  limits: { fileSize: env.MAX_UPLOAD_MB * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      callback(null, true);
      return;
    }
    callback(
      ApiError.badRequest("Format gambar harus JPG, PNG, atau WebP.")
    );
  },
});

export function uploadImage(field: string): RequestHandler {
  const handler = imageUpload.single(field);
  return (req, res, next) => {
    handler(req, res, (error: unknown) => {
      if (!error) {
        next();
        return;
      }
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          next(
            ApiError.badRequest(
              `Ukuran gambar maksimal ${env.MAX_UPLOAD_MB} MB.`
            )
          );
          return;
        }
        next(
          ApiError.badRequest(`Gagal mengunggah gambar: ${error.message}`)
        );
        return;
      }
      next(error);
    });
  };
}
