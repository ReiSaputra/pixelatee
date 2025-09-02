import express from "express";

import { PortfolioParams, PortfolioResponse } from "../model/portfolio.model";

import { PortfolioService } from "../service/portfolio.service";

export class PortfolioController {
  /**
   * Get all portfolio
   * @param req request
   * @param res response that contains all portfolio
   * @param next next function to handle error
   * @throws ResponseError if error occur
   */
  public static async publicGetAll(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // call service
      const response: PortfolioResponse[] = await PortfolioService.publicGetAll();

      // return response
      res.status(200).json({ status: "Success", code: 200, data: response, message: "Get all portfolio successfully" });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get detail portfolio
   * @param req request that contains portfolio ID
   * @param res response that contains detail portfolio
   * @param next next function to handle error
   * @throws ResponseError if error occur
   */
  public static async publicGetDetail(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // assert request
      const request: PortfolioParams = req.params as PortfolioParams;

      // call service
      const response: PortfolioResponse = await PortfolioService.publicGetDetail(request);

      // return response
      res.status(200).json({ status: "Success", code: 200, data: response, message: "Get detail portfolio successfully" });
    } catch (error: any) {
      next(error);
    }
  }
}
