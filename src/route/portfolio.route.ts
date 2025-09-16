import express from "express";

import { PortfolioController } from "../controller/portfolio.controller";

import { AuthMiddleware } from "../middleware/auth.middleware";
import { FileUploadMiddleware } from "../middleware/file-upload.middleware";

export const portfolioRoute: express.Router = express.Router();

/**
 * Public
 */
portfolioRoute.get("/public/portfolios", PortfolioController.publicGetAll);
portfolioRoute.get("/public/portfolios/:portfolioId", PortfolioController.publicGetDetail);

/**
 * Admin
 */
portfolioRoute.get("/admin/portfolios", AuthMiddleware.authentication, AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]), AuthMiddleware.permission("canReadPortfolio"), PortfolioController.adminGetAll);
// portfolioRoute.get("/admin/portfolios/:portfolioId", PortfolioController.adminGetDetail);
// portfolioRoute.post(
//   "/admin/portfolios",
//   AuthMiddleware.authentication,
//   AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]),
//   AuthMiddleware.permission("canWritePortfolio"),
//   FileUploadMiddleware.handleMultiple("portfolio", 2, "photos", 5),
//   PortfolioController.create
// );
