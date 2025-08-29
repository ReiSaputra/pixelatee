import express from "express";
import Mail from "nodemailer/lib/mailer";

import { NewsletterRequest } from "../model/newsletter.model";

import { NewsletterService } from "../service/newsletter.service";

export class NewsletterController {
  /**
   * Join newsletter
   * @param req request that contains email
   * @param res response that contains accepted email addresses
   * @param next next function to handle error
   * @throws ResponseError if email already exist
   */
  public static async join(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // assert request
      const request: NewsletterRequest = req.body as NewsletterRequest;

      // call service
      const response: (string | Mail.Address)[] = await NewsletterService.join(request);

      // return response
      res.status(200).json({ status: "Success", code: 200, data: response, message: "Email sent successfully" });
    } catch (error: any) {
      next(error);
    }
  }
}
