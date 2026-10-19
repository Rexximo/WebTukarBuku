import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import {
  changePasswordSchema,
  loginSchema,
} from "../schemas/auth.schema.js";
import { loginRateLimiter } from "../middleware/rate-limit.js";

export const authRouter = Router();

authRouter.post(
  "/login",
  loginRateLimiter,
  validateBody(loginSchema),
  authController.login
);
authRouter.post("/logout", authController.logout);
authRouter.get("/me", requireAuth, authController.me);
authRouter.post(
  "/change-password",
  requireAuth,
  validateBody(changePasswordSchema),
  authController.changePassword
);
