import { Router } from "express";
import * as swapController from "../controllers/swap.controller.js";
import { requireAdmin, requireAuth, requireMember } from "../middleware/auth.js";
import { uploadImage } from "../middleware/upload.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import {
  myRequestListQuerySchema,
  swapCreateSchema,
  swapListQuerySchema,
  swapRejectSchema,
} from "../schemas/swap.schema.js";

export const swapRouter = Router();

swapRouter.get(
  "/mine",
  requireAuth,
  requireMember,
  validateQuery(myRequestListQuerySchema),
  swapController.listMyRequests
);
swapRouter.post(
  "/",
  requireAuth,
  requireMember,
  uploadImage("photo"),
  validateBody(swapCreateSchema),
  swapController.createRequest
);
swapRouter.get(
  "/",
  requireAuth,
  requireAdmin,
  validateQuery(swapListQuerySchema),
  swapController.listAllRequests
);
swapRouter.get("/:id", requireAuth, swapController.getRequest);
swapRouter.post(
  "/:id/cancel",
  requireAuth,
  requireMember,
  swapController.cancelRequest
);
swapRouter.post(
  "/:id/approve",
  requireAuth,
  requireAdmin,
  swapController.approveRequest
);
swapRouter.post(
  "/:id/reject",
  requireAuth,
  requireAdmin,
  validateBody(swapRejectSchema),
  swapController.rejectRequest
);
