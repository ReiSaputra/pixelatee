import express from "express";

import { PortfolioController } from "../controller/portfolio.controller";

export const portfolioRoute: express.Router = express.Router();

portfolioRoute.get("/public/portfolios", PortfolioController.publicGetAll);
portfolioRoute.get("/public/portfolios/:portfolioId", PortfolioController.publicGetDetail);
