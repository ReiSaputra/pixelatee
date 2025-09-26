import express from "express";

import { PortfolioController } from "../controller/portfolio.controller";

import { AuthMiddleware } from "../middleware/auth.middleware";
import { FileUploadMiddleware } from "../middleware/file-upload.middleware";
import { GuestMiddleware } from "../middleware/guest.middleware";

export const portfolioRoute: express.Router = express.Router();

/**
 * Public
 */
portfolioRoute.get("/public/portfolios", GuestMiddleware.dailyVisit, PortfolioController.publicGetAll);
portfolioRoute.get("/public/portfolios/:portfolioId", GuestMiddleware.dailyVisit, PortfolioController.publicGetDetail);

/**
 * Admin
 */
portfolioRoute.get("/admin/portfolios", AuthMiddleware.authentication, AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]), AuthMiddleware.permission("canReadPortfolio"), PortfolioController.adminGetAll);
portfolioRoute.get("/admin/portfolios/:portfolioId", AuthMiddleware.authentication, AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]), AuthMiddleware.permission("canReadPortfolio"), PortfolioController.adminGetDetail);
portfolioRoute.get("/admin/portfolios/:portfolioId/preview", AuthMiddleware.authentication, AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]), AuthMiddleware.permission("canWritePortfolio"), PortfolioController.adminEditPreview);
portfolioRoute.post(
  "/admin/portfolios",
  AuthMiddleware.authentication,
  AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]),
  AuthMiddleware.permission("canWritePortfolio"),
  FileUploadMiddleware.handleMultiple("portfolio", 2, "photos", 5),
  PortfolioController.adminCreate
);
portfolioRoute.patch(
  "/admin/portfolios/:portfolioId",
  AuthMiddleware.authentication,
  AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]),
  AuthMiddleware.permission("canUpdatePortfolio"),
  FileUploadMiddleware.handleMultiple("portfolio", 2, "photos", 5),
  PortfolioController.adminUpdate
);
portfolioRoute.delete("/admin/portfolios/:portfolioId", AuthMiddleware.authentication, AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]), AuthMiddleware.permission("canDeletePortfolio"), PortfolioController.adminDelete);
