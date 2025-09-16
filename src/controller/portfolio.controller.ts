import express from "express";
import fs from "fs";

import { PortfolioFilters, PortfolioPaginationResponse, PortfolioParams, PortfolioRequest, PortfolioResponse } from "../model/portfolio.model";

import { PortfolioService } from "../service/portfolio.service";

import { UserRequest } from "../types/user.type";

import { User, UserPermission } from "../generated/prisma";

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

  /**
   * Get all portfolio based on the user permission and filters
   * @param req request that contains user information and query params
   * @param res response that contains all portfolio
   * @param next next function to handle error
   * @throws ResponseError if error occur
   */
  public static async adminGetAll(req: UserRequest, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // assert request
      const user: (User & { permissions: UserPermission | null }) | undefined = req.user;

      // assert query params
      const filters: PortfolioFilters = req.query as unknown as PortfolioFilters;

      // call service
      const response: PortfolioPaginationResponse = await PortfolioService.adminGetAll(user, filters);

      // return response
      res.status(200).json({ status: "Success", code: 200, data: response, message: "Get all admin portfolio successfully" });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Create portfolio
   * @param req request that contains user information, query params, and body
   * @param res response that contains created portfolio
   * @param next next function to handle error
   * @throws ResponseError if error occur
   */
  // public static async create(req: UserRequest, res: express.Response, next: express.NextFunction): Promise<void> {
  //   try {
  //     // assert user
  //     const user: (User & { permissions: UserPermission | null }) | undefined = req.user;

  //     // assert request
  //     const request: PortfolioRequest = req.body as PortfolioRequest;

  //     // assert files
  //     const files: Express.Multer.File[] | undefined = req.files as Express.Multer.File[] | undefined;

  //     // assert files to request if exists
  //     if (files && Array.isArray(files)) {
  //       request.mainImage = files[0]?.mimetype;
  //       request.secondImage = files[1]?.mimetype;
  //       request.thirdImage = files[2]?.mimetype;
  //       request.fourthImage = files[3]?.mimetype;
  //       request.fifthImage = files[4]?.mimetype;
  //     }

  //     // call service
  //     const response: PortfolioResponse = await PortfolioService.create(user, request, files);

  //     // return response
  //     res.status(200).json({ status: "Success", code: 200, data: response, message: "Create portfolio successfully" });
  //   } catch (error: any) {
  //     // handle unsync file if there error
  //     const files = req.files as Express.Multer.File[] | undefined;

  //     // clean file
  //     if (files && Array.isArray(files)) {
  //       for (const file of files) {
  //         try {
  //           if (fs.existsSync(file.path)) {
  //             fs.unlinkSync(file.path);
  //           }
  //         } catch (err) {
  //           console.error("Failed to clean file:", err);
  //         }
  //       }
  //     }

  //     next(error);
  //   }
  // }

  public static async delete(req: UserRequest, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // assert request
      const request: PortfolioParams = req.params as PortfolioParams;

      // call service
    } catch (error: any) {
      next(error);
    }
  }

  public static async checkDraft(req: UserRequest, res: express.Response, next: express.NextFunction): Promise<void> {}

  public static async deleteDraft(req: UserRequest, res: express.Response, next: express.NextFunction): Promise<void> {}
}
