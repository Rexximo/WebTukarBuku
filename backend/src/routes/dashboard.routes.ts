import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

export const dashboardRouter = Router();

dashboardRouter.get(
  "/stats",
  requireAuth,
  requireAdmin,
  dashboardController.getDashboardStats
);
