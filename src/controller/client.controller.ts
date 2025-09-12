import express from "express";
import fs from "fs";

import { ClientParams, ClientRequest, ClientResponse } from "../model/client.model";

import { UserRequest } from "../types/user.type";

import { ClientService } from "../service/client.service";

import { User, UserPermission } from "../generated/prisma";

export class ClientController {
  /**
   * Get all client
   * @param req request that contains user information and query params
   * @param res response that contains all client
   * @param next next function to handle error
   * @throws ResponseError if error occur
   */
  public static async adminGetAll(req: UserRequest, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // call service
      const response: ClientResponse[] = await ClientService.adminGetAll();

      // return response
      res.status(200).json({ status: "Success", code: 200, data: response, message: "Get all client successfully" });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Create a new client in the database
   * @param req request that contains client data to create
   * @param res response that contains created client
   * @param next next function to handle error
   * @throws ResponseError if error occur
   */
  public static async adminCreate(req: UserRequest, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // assert request
      const request: ClientRequest = req.body as ClientRequest;

      // assert file
      const file: Express.Multer.File | undefined = req.file as Express.Multer.File | undefined;

      // assert file to request if exists
      if (file) {
        request.logo = file.mimetype;
      }

      // call service
      const response: ClientResponse = await ClientService.adminCreate(request, file);

      // return response
      res.status(201).json({ status: "Success", code: 200, data: response, message: "Create client successfully" });
    } catch (error: any) {
      // handle unsync file if there error
      const file: Express.Multer.File | undefined = req.file as Express.Multer.File | undefined;

      // clean file
      if (file) {
        try {
          if (fs.existsSync(`public/client/${file.filename}`)) {
            fs.unlinkSync(`public/client/${file.filename}`);
          }
        } catch (err) {
          console.error("Failed to clean file:", err);
        }
      }

      next(error);
    }
  }

  /**
   * Update a client in the database
   * @param req request that contains client data to update
   * @param res response that contains updated client
   * @param next next function to handle error
   * @throws ResponseError if error occur
   */
  public static async adminUpdate(req: UserRequest, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // assert request
      const request: ClientRequest = req.body as ClientRequest;

      // assert params
      const params: ClientParams = req.params as ClientParams;

      // assert file
      const file: Express.Multer.File | undefined = req.file as Express.Multer.File | undefined;

      // assert file if request exists
      if (file) {
        request.logo = file.mimetype;
      }

      // call service
      const response: ClientResponse = await ClientService.adminUpdate(request, params, file);

      // return response
      res.status(200).json({ status: "Success", code: 200, data: response, message: "Update client successfully" });
    } catch (error: any) {
      // handle unsync file if there is error
      const file: Express.Multer.File | undefined = req.file as Express.Multer.File | undefined;

      // clean file
      if (file) {
        try {
          if (fs.existsSync(`public/client/${file.filename}`)) {
            fs.unlinkSync(`public/client/${file.filename}`);
          }
        } catch (err) {
          console.error("Failed to clean file:", err);
        }
      }

      next(error);
    }
  }

  /**
   * Delete a client by ID
   * @param req request that contains client ID to delete
   * @param res response that contains deleted client
   * @param next next function to handle error
   * @throws ResponseError if error occur
   */
  public static async adminDelete(req: UserRequest, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // assert params
      const params: ClientParams = req.params as ClientParams;

      // call service
      const response: ClientResponse = await ClientService.adminDelete(params);

      // return response
      res.status(200).json({ status: "Success", code: 200, data: response, message: "Delete client successfully" });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get all client for portfolio form
   * @param req request that contains user information and query params
   * @param res response that contains all client
   * @param next next function to handle error
   * @throws ResponseError if error occur
   */
  public static async formGetAll(req: UserRequest, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // assert request
      const request: ClientRequest = req.body as ClientRequest;

      // call service
      const response: ClientResponse[] = await ClientService.formGetAll();

      // return response
      res.status(200).json({ status: "Success", code: 200, data: response, message: "Get all client for portfolio form successfully" });
    } catch (error: any) {
      next(error);
    }
  }
}
