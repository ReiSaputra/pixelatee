import express from "express";

import { ContactFilters, ContactRequest, ContactResponse } from "../model/contact.model";

import { ContactService } from "../service/contact.service";

import { UserRequest } from "../types/user.type";
import { User, UserPermission } from "../generated/prisma";

export class ContactController {
  public static async create(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // assert request
      const request: ContactRequest = req.body as ContactRequest;

      // calling service
      const response: ContactResponse = await ContactService.create(request);

      // return response
      res.status(201).json({ status: "Success", code: 200, data: response, message: "Contact Inquiry created successfully" });
    } catch (error: any) {
      next(error);
    }
  }

  public static async adminGetAll(req: UserRequest, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // assert user
      const user: (User & {permissions: UserPermission | null}) | undefined = req.user;

      // assert query params
      const filters: ContactFilters = req.query as unknown as ContactFilters;

      // calling service
      const response: ContactResponse[] = await ContactService.adminGetAll(user, filters);

      // return response
      res.status(200).json({ status: "Success", code: 200, data: response, message: "Get all contact successfully" });
    } catch (error: any) {
      next(error);
    }
  }
}
