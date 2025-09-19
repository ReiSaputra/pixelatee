import express from "express";

import { AuthLoginRequest, AuthRegisterRequest, AuthResponse } from "../model/auth.model";

import { AuthService } from "../service/auth.service";

export class AuthController {
  /**
   * Login user
   * @param req request that contains user information
   * @param res response that contains user data
   * @param next next function to handle error
   * @throws ResponseError if error occur
   */
  public static async login(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // assert request
      const request: AuthLoginRequest = req.body as AuthLoginRequest;

      // call service
      const response: AuthResponse = await AuthService.login(request);

      // set session cookie
      res.cookie("session", response.token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        signed: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // return response
      res.status(200).json({ status: "Success", code: 200, data: response, message: "User logged in successfully" });
    } catch (error: any) {
      next(error);
    }
  }
}
