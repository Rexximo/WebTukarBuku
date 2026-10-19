import { Router } from "express";
import * as bookController from "../controllers/book.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { uploadImage } from "../middleware/upload.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import {
  bookCreateSchema,
  bookListQuerySchema,
  bookUpdateSchema,
} from "../schemas/book.schema.js";

export const bookRouter = Router();

bookRouter.get(
  "/",
  validateQuery(bookListQuerySchema),
  bookController.listBooks
);
bookRouter.get("/genres", bookController.listGenres);
bookRouter.get("/:id", bookController.getBook);
bookRouter.post(
  "/",
  requireAuth,
  requireAdmin,
  uploadImage("cover"),
  validateBody(bookCreateSchema),
  bookController.createBook
);
bookRouter.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  uploadImage("cover"),
  validateBody(bookUpdateSchema),
  bookController.updateBook
);
bookRouter.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  bookController.deleteBook
);
