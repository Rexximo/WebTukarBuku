import type { ErrorRequestHandler, RequestHandler } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { isProduction } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan." });
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ApiError) {
    res.status(error.status).json({ message: error.message });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      message: error.issues[0]?.message ?? "Data tidak valid.",
    });
    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const firstError = Object.values(error.errors)[0];
    res
      .status(400)
      .json({ message: firstError?.message ?? "Data tidak valid." });
    return;
  }

  if (error instanceof mongoose.Error.CastError) {
    res.status(400).json({ message: "Format data tidak valid." });
    return;
  }

  if ((error as { code?: number } | null)?.code === 11000) {
    res
      .status(409)
      .json({ message: "Data sudah digunakan. Gunakan nilai lain." });
    return;
  }

  console.error("[error]", error);
  res.status(500).json({
    message: isProduction
      ? "Terjadi kesalahan. Silakan coba lagi."
      : error instanceof Error
        ? error.message
        : "Terjadi kesalahan.",
  });
};
