import express from "express";

import { ContactFilters, ContactPaginationResponse, ContactParams, ContactRequest, ContactResponse } from "../model/contact.model";

import { ContactService } from "../service/contact.service";

import { UserRequest } from "../types/user.type";
import { User, UserPermission } from "../generated/prisma";

export class ContactController {
  /**
   * Create a contact inquiry.
   * @param req request that contains contact inquiry data
   * @param res response that contains created contact inquiry
   * @param next next function to handle error
   * @throws ResponseError if error occur
   */
  public static async publicCreate(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // assert request
      const request: ContactRequest = req.body as ContactRequest;

      // calling service
      const response: ContactResponse = await ContactService.publicCreate(request);

      // return response
      res.status(201).json({ status: "Success", code: 200, data: response, message: "Contact Inquiry created successfully" });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get all contact based on the user permission and filters
   * @param req request that contains user information and query params
   * @param res response that contains all contact
   * @param next next function to handle error
   * @throws ResponseError if error occur
   */
  public static async adminGetAll(req: UserRequest, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // assert user
      const user: (User & { permissions: UserPermission | null }) | undefined = req.user;

      // assert query params
      const filters: ContactFilters = req.query as unknown as ContactFilters;

      // calling service
      const response: ContactPaginationResponse = await ContactService.adminGetAll(user, filters);

      // return response
      res.status(200).json({ status: "Success", code: 200, data: response, message: "Get all contact successfully" });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get a contact by ID
   * @param req request that contains contact ID to get
   * @param res response that contains the contact
   * @param next next function to handle error
   * @throws ResponseError if error occur
   */
  public static async adminGetDetail(req: UserRequest, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // assert params
      const contactId: ContactParams = req.params as ContactParams;

      // calling service
      const response: ContactResponse = await ContactService.adminGetDetail(contactId);

      // return response
      res.status(200).json({ status: "Success", code: 200, data: response, message: "Get detail contact successfully" });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Delete a contact by ID
   * @param req request that contains contact ID to delete
   * @param res response that contains deleted contact
   * @param next next function to handle error
   * @throws ResponseError if error occur
   */
  public static async adminDelete(req: UserRequest, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // assert params
      const contactId: ContactParams = req.params as ContactParams;

      // calling service
      const response:ContactResponse = await ContactService.adminDelete(contactId);

      // return response
      res.status(200).json({ status: "Success", code: 200, data: response, message: "Delete contact successfully" });
    } catch (error: any) {
      next(error);
    }
  }
}
