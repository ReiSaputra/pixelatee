import express from "express";

import { ContactRequest, ContactResponse } from "../model/contact.model";

import { ContactService } from "../service/contact.service";

export class ContactController {
  public static async create(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // assert request
      const request: ContactRequest = req.body as ContactRequest;

      // calling service
      const response: ContactResponse = await ContactService.create(request);

      // return response
      res.status(200).json({ status: "Success", code: 200, data: response, message: "Contact Inquiry created successfully" });
    } catch (error: any) {
      next(error);
    }
  }
}
