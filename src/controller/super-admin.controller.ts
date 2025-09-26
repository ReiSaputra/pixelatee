import express from "express";

import { AdminFilters, AdminPaginationResponse, AdminParams, AdminRegisterRequest, AdminResponse } from "../model/super-admin.model";

import { SuperAdminService } from "../service/super-admin.service";

import { UserRequest } from "../types/user.type";
import { User, UserPermission } from "../generated/prisma";

export class SuperAdminController {
  /**
   * Register a new admin in the database
   * @param req request that contains admin data to register
   * @param res response that contains registered admin
   * @param next next function to handle error
   * @throws ResponseError if error occur
   */
  public static async registerAdmin(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // assert request
      const request = req.body as AdminRegisterRequest;

      // call service
      const response: AdminResponse = await SuperAdminService.registerAdmin(request);

      // return response
      res.status(201).json({ status: "Success", code: 200, data: response, message: "Register admin successfully" });
    } catch (error: any) {
      next(error);
    }
  }

  public static async adminList(req: UserRequest, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // assert user
      const user: (User & { permissions: UserPermission | null }) | undefined = req.user;

      // assert filters
      const filters: AdminFilters = req.query as unknown as AdminFilters;

      // call service
      const response: AdminPaginationResponse = await SuperAdminService.adminList(user, filters);

      // return response
      res.status(200).json({ status: "Success", code: 200, data: response, message: "Get admin list successfully" });
    } catch (error: any) {
      next(error);
    }
  }

  public static async adminDetail(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {}

  public static async deleteAdmin(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // assert params
      const params: AdminParams = req.params as AdminParams;

      // call service
      const response: AdminResponse = await SuperAdminService.deleteAdmin(params);

      // return response
      res.status(200).json({ status: "Success", code: 200, data: response, message: "Delete admin successfully" });
    } catch (error: any) {
      next(error);
    }
  }
}
