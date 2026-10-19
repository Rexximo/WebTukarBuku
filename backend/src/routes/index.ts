import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { bookRouter } from "./book.routes.js";
import { userRouter } from "./user.routes.js";
import { swapRouter } from "./swap.routes.js";
import { dashboardRouter } from "./dashboard.routes.js";
import { galleryRouter } from "./gallery.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/books", bookRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/swap-requests", swapRouter);
apiRouter.use("/admin", dashboardRouter);
apiRouter.use("/gallery", galleryRouter);
