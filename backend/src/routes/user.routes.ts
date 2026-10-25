import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import {
  userCreateSchema,
  userListQuerySchema,
  userUpdateSchema,
} from "../schemas/user.schema.js";

export const userRouter = Router();

userRouter.use(requireAuth, requireAdmin);

userRouter.get(
  "/",
  validateQuery(userListQuerySchema),
  userController.listUsers
);
userRouter.post(
  "/",
  validateBody(userCreateSchema),
  userController.createUser
);
userRouter.get("/:id", userController.getUser);
userRouter.patch(
  "/:id",
  validateBody(userUpdateSchema),
  userController.updateUser
);
userRouter.post("/:id/reset-password", userController.resetPassword);
