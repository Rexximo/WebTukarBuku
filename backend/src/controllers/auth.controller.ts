import bcrypt from "bcryptjs";
import type { RequestHandler } from "express";
import { env } from "../config/env.js";
import { cookieOptions, signToken } from "../middleware/auth.js";
import { UserModel } from "../models/user.model.js";
import type {
  ChangePasswordInput,
  LoginInput,
} from "../schemas/auth.schema.js";
import { ApiError } from "../utils/api-error.js";
import { toUserDto } from "../utils/serialize.js";

export const login: RequestHandler = async (req, res) => {
  const { username, password } = req.body as LoginInput;

  const user = await UserModel.findOne({ username: username.toLowerCase() });
  if (!user) {
    throw ApiError.unauthorized("Nama pengguna atau kata sandi salah.");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw ApiError.unauthorized("Nama pengguna atau kata sandi salah.");
  }

  if (!user.isActive) {
    throw new ApiError(
      403,
      "Akun Anda dinonaktifkan. Silakan hubungi admin."
    );
  }

  res.cookie(env.COOKIE_NAME, signToken(user), cookieOptions());
  res.json({ user: toUserDto(user) });
};

export const logout: RequestHandler = (_req, res) => {
  res.clearCookie(env.COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
  });
  res.json({ message: "Anda telah keluar." });
};

export const me: RequestHandler = (req, res) => {
  if (!req.user) {
    throw ApiError.unauthorized();
  }
  res.json({ user: toUserDto(req.user) });
};

export const changePassword: RequestHandler = async (req, res) => {
  const user = req.user;
  if (!user) {
    throw ApiError.unauthorized();
  }

  const { currentPassword, newPassword } = req.body as ChangePasswordInput;

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    throw ApiError.badRequest("Kata sandi saat ini salah.");
  }
  if (currentPassword === newPassword) {
    throw ApiError.badRequest(
      "Kata sandi baru tidak boleh sama dengan kata sandi saat ini."
    );
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.mustChangePassword = false;
  await user.save();

  res.cookie(env.COOKIE_NAME, signToken(user), cookieOptions());
  res.json({ user: toUserDto(user) });
};
