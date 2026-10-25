import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env, isProduction } from "../config/env.js";
import { UserModel, type UserDocument } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";

export interface TokenPayload {
  sub: string;
  role: "admin" | "anggota";
  mcp: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
      tokenPayload?: TokenPayload;
    }
  }
}

export function signToken(user: UserDocument): string {
  const payload: TokenPayload = {
    sub: user.id,
    role: user.role,
    mcp: user.mustChangePassword,
  };
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  };
}

export const requireAuth: RequestHandler = async (req, _res, next) => {
  try {
    const token = req.cookies?.[env.COOKIE_NAME] as string | undefined;
    if (!token) {
      throw ApiError.unauthorized();
    }
    const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    const user = await UserModel.findById(payload.sub);
    if (!user) {
      throw ApiError.unauthorized();
    }
    if (!user.isActive) {
      throw new ApiError(
        403,
        "Akun Anda dinonaktifkan. Silakan hubungi admin."
      );
    }
    req.user = user;
    req.tokenPayload = payload;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
      return;
    }
    next(ApiError.unauthorized("Sesi Anda berakhir. Silakan masuk kembali."));
  }
};

export const requireAdmin: RequestHandler = (req, _res, next) => {
  if (!req.user || req.user.role !== "admin") {
    next(ApiError.forbidden("Anda tidak memiliki akses ke halaman ini."));
    return;
  }
  next();
};

export const requireMember: RequestHandler = (req, _res, next) => {
  if (!req.user || req.user.role !== "anggota") {
    next(
      ApiError.forbidden("Hanya anggota yang dapat melakukan tindakan ini.")
    );
    return;
  }
  next();
};
