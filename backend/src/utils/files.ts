import fs from "node:fs";
import path from "node:path";
import { env } from "../config/env.js";

export const uploadDir = path.resolve(process.cwd(), env.UPLOAD_DIR);

export function deleteUploadByUrl(url: string | undefined | null): void {
  if (!url || !url.startsWith("/uploads/")) {
    return;
  }
  const filename = path.basename(url);
  const filePath = path.join(uploadDir, filename);
  fs.promises.unlink(filePath).catch(() => {
    // File sudah tidak ada, tidak perlu ditangani.
  });
}

export function buildUploadUrl(filename: string): string {
  return `/uploads/${filename}`;
}

export function buildTempPassword(): string {
  return `tb${Math.random().toString(36).slice(2, 8)}${Math.floor(
    Math.random() * 90 + 10
  )}`;
}
