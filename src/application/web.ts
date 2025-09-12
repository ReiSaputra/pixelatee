import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { authRoute } from "../route/auth.route";
import { newsletterRoute } from "../route/newsletter.route";
import { portfolioRoute } from "../route/portfolio.route";
import { contactRoute } from "../route/contact.route";

import { ErrorMiddleware } from "../middleware/error.middleware";
import { clientRoute } from "../route/client.route";

dotenv.config();

export const web: express.Application = express();

/**
 * Middlewares
 */

web.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
web.use(cookieParser(process.env.COOKIE_SECRET!));
web.use(express.json());
web.use(express.urlencoded({ extended: true }));

/**
 * Static Files
 */
web.use(express.static("public"));

/**
 * Routes
 */
web.use("/api/v1", authRoute);
web.use("/api/v1", newsletterRoute);
web.use("/api/v1", portfolioRoute);
web.use("/api/v1", clientRoute);
web.use("/api/v1", contactRoute);

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
