import express from "express";
import Mail from "nodemailer/lib/mailer";
import fs from "fs";

import {
  NewsletterFilters,
  NewsletterJoinParams,
  NewsletterJoinRequest,
  NewsletterParams,
  NewsletterRequest,
  NewsletterResponse,
} from "../model/newsletter.model";

import { NewsletterService } from "../service/newsletter.service";

import { UserRequest } from "../types/user.type";

import { User, UserPermission } from "../generated/prisma";

export class NewsletterController {
  /**
   * Join newsletter
   * @param req request that contains email
   * @param res response that contains accepted email addresses
   * @param next next function to handle error
   * @throws ResponseError if email already exist
   */
  public static async join(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> {
    try {
      // assert request
      const request: NewsletterJoinRequest = req.body as NewsletterJoinRequest;

      // call service
      const response: (string | Mail.Address)[] = await NewsletterService.join(
        request
      );

      // return response
      res.status(200).json({
        status: "Success",
        code: 200,
        data: response,
        message: "Email sent successfully",
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Activate newsletter
   * @param req request that contains member ID
   * @param res response that redirects to frontend
   * @param next next function to handle error
   * @throws ResponseError if member ID not found
   */
  public static async activate(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> {
    try {
      // assert request
      const request: NewsletterJoinParams = req.query as NewsletterJoinParams;

      // call service
      const response: NewsletterResponse = await NewsletterService.activate(
        request
      );

      // return response
      res.redirect(
        `http://localhost:5173/newsletters/${response.id}/thank-you`
      );
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Thanks for subscribing to newsletter
   * @param req request that contains member ID
   * @param res response that contains member data
   * @param next next function to handle error
   * @throws ResponseError if member ID not found
   */
  public static async thanks(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> {
    try {
      // assert request
      const request: NewsletterJoinParams = req.query as NewsletterJoinParams;

      // call service
      const response: NewsletterResponse = await NewsletterService.thanks(
        request
      );

      // return response
      res.status(200).json({
        status: "Success",
        code: 200,
        data: response,
        message: "Send thanks successfully",
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Unsubscribe from newsletter
   * @param req request that contains member ID
   * @param res response that contains member data
   * @param next next function to handle error
   * @throws ResponseError if member ID not found
   */
  public static async unsubscribe(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> {
    try {
      // assert request
      const request: NewsletterJoinParams = req.query as NewsletterJoinParams;

      // call service
      const response: NewsletterResponse = await NewsletterService.unsubscribe(
        request
      );

      // return response
      res.status(200).json({
        status: "Success",
        code: 200,
        data: response,
        message: "Unsubscribe successfully",
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get all newsletters based on the user permission and filters
   * @param req request that contains user information and query params
   * @param res response that contains all newsletters
   * @param next next function to handle error
   * @throws ResponseError if error occur
   */
  public static async adminGetAll(
    req: UserRequest,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> {
    try {
      // assert user
      const user: (User & { permissions: UserPermission | null }) | undefined =
        req.user;

      // assert filters
      const filters: NewsletterFilters = req.query as NewsletterFilters;

      // call service
      const response: NewsletterResponse[] =
        await NewsletterService.adminGetAll(user, filters);

      // return response
      res.status(200).json({
        status: "Success",
        code: 200,
        data: response,
        message: "Get all newsletters successfully",
      });
    } catch (error: any) {
      next(error);
    }
  }

  public static async adminGetDetail(
    req: UserRequest,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> {
    try {
      // assert params
      const params: NewsletterParams = req.params as NewsletterParams;

      // call service
      const response: NewsletterResponse =
        await NewsletterService.adminGetDetail(params);

      // return response
      res.status(200).json({
        status: "Success",
        code: 200,
        data: response,
        message: "Get newsletter successfully",
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Create a newsletter
   * @param req request that contains user information, query params, and body
   * @param res response that contains created newsletter
   * @param next next function to handle error
   * @throws ResponseError if error occur
   */
  public static async adminCreate(
    req: UserRequest,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> {
    try {
      // assert user
      const user: (User & { permissions: UserPermission | null }) | undefined =
        req.user;

      // assert request
      const request: NewsletterRequest = req.body as NewsletterRequest;

      // assert file
      const file: Express.Multer.File | undefined = req.file as
        | Express.Multer.File
        | undefined;

      // include request file if exists
      // if (file) {
      //   request.photo = file.mimetype; // tidak bisa dipanggil di FE karena mimetype
      // }

      if (file) {
        req.body.photo = file.filename;
      }

      // call service
      const response: NewsletterResponse = await NewsletterService.adminCreate(
        user,
        request,
        file
      );

      // return response
      res.status(200).json({
        status: "Success",
        code: 200,
        data: response,
        message: "Create newsletter successfully",
      });
    } catch (error: any) {
      // clean file
      const file: Express.Multer.File | undefined = req.file as
        | Express.Multer.File
        | undefined;

      console.log("req.body:", req.body);
      console.log("req.file:", req.file);

      // handle unsync file if there is error
      if (file) {
        try {
          if (fs.existsSync(`public/newsletter/${file.filename}`)) {
            fs.unlinkSync(`public/newsletter/${file.filename}`);
          }
        } catch (err) {
          console.error("Failed to clean file:", err);
        }
      }

      next(error);
    }
  }

  /**
   * Delete a newsletter by ID
   * @param {UserRequest} req request that contains user information and newsletter ID
   * @param {express.Response} res response that contains deleted newsletter
   * @param {express.NextFunction} next next function to handle error
   * @throws {ResponseError} if error occur
   * @returns {Promise<void>} promise that resolves when successfully delete newsletter
   */
  public static async adminDelete(
    req: UserRequest,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> {
    try {
      // assert params
      const params: NewsletterParams = req.params as NewsletterParams;

      // call service
      const response: NewsletterResponse = await NewsletterService.adminDelete(
        params
      );

      // return response
      res.status(200).json({
        status: "Success",
        code: 200,
        data: response,
        message: "Delete newsletter successfully",
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get newsletter preview by id
   * @param {UserRequest} req request that contains user information and newsletter ID
   * @param {express.Response} res response that contains newsletter preview
   * @param {express.NextFunction} next next function to handle error
   * @throws {ResponseError} if error occur
   * @returns {Promise<void>} promise that resolves when successfully get newsletter preview
   */
  public static async adminEditPreview(
    req: UserRequest,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> {
    try {
      // assert params
      const params: NewsletterParams = req.params as NewsletterParams;

      // call service
      const response: NewsletterResponse =
        await NewsletterService.adminEditPreview(params);

      // return response
      res.status(200).json({
        status: "Success",
        code: 200,
        data: response,
        message: "Get newsletter preview successfully",
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Update a newsletter
   * @param req request that contains user information, newsletter ID and update request
   * @param res response that contains updated newsletter
   * @param next next function to handle error
   * @throws ResponseError if error occur
   */
  public static async adminUpdate(
    req: UserRequest,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> {
    try {
      // assert user
      const user: (User & { permissions: UserPermission | null }) | undefined =
        req.user;

      // assert file
      const file: Express.Multer.File | undefined = req.file as
        | Express.Multer.File
        | undefined;

      // assert params
      const params: NewsletterParams = req.params as NewsletterParams;

      // assert request
      const request: NewsletterRequest = req.body as NewsletterRequest;

      // include request file if exists
      if (file) {
        request.photo = file.mimetype;
      }

      // call service
      const response: NewsletterResponse = await NewsletterService.adminUpdate(
        user,
        file,
        params,
        request
      );

      // return response
      res.status(200).json({
        status: "Success",
        code: 200,
        data: response,
        message: "Update newsletter successfully",
      });
    } catch (error: any) {
      next(error);
    }
  }
}
