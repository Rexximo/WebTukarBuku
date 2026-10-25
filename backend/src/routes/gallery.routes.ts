import { Router } from "express";
import * as galleryController from "../controllers/gallery.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { uploadImage } from "../middleware/upload.js";
import { validateBody } from "../middleware/validate.js";
import { galleryPhotoCreateSchema } from "../schemas/gallery.schema.js";

export const galleryRouter = Router();

galleryRouter.get("/", galleryController.listPhotos);
galleryRouter.post(
  "/",
  requireAuth,
  requireAdmin,
  uploadImage("photo"),
  validateBody(galleryPhotoCreateSchema),
  galleryController.createPhoto
);
galleryRouter.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  galleryController.deletePhoto
);
