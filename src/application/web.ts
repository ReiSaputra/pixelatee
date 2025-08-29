import express from "express";
import cors from "cors";

import { newsletterRoute } from "../route/newsletter.route";

import { ErrorMiddleware } from "../middleware/error.middleware";

export const web: express.Application = express();

/**
 * Middlewares
 */

web.use(cors());
web.use(express.json());
web.use(express.urlencoded({ extended: true }));

/**
 * Static Files
 */
web.use(express.static("public"));

/**
 * Routes
 */
web.use("/api/v1", newsletterRoute);

/**
 * Not Found Handler
 */
web.use((req: express.Request, res: express.Response, next: express.NextFunction): void => {
  res.status(404).json({ status: "Error", code: 404, error: "NotFoundError", message: "Not Found" });
});

/**
 * Error Handler
 */
web.use(ErrorMiddleware.handle);
