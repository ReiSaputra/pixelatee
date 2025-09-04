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
    // assert request
    const request: AuthLoginRequest = req.body as AuthLoginRequest;

    // call service
    const response: AuthResponse = await AuthService.login(request);

    // set session cookie
    res.cookie("session", response.token, { httpOnly: true, secure: false, sameSite: "none", signed: true });

    // return response
    res.status(200).json({ status: "Success", code: 200, data: response, message: "User logged in successfully" });
  }

  /**
   * Register a new user
   * @param req request that contains user information
   * @param res response that contains newly created user
   * @param next next function to handle error
   * @throws ResponseError if error occur
   */
  public static async register(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    // assert request
    const request: AuthRegisterRequest = req.body as AuthRegisterRequest;

    // call service
    const response: AuthResponse = await AuthService.register(request);

    // return response
    res.status(200).json({ status: "Success", code: 200, data: response, message: "User registered successfully" });
  }
}
