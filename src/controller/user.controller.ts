import express from "express";

import { User, UserPermission } from "../generated/prisma";
import { UserResponse, UserRequest } from "../model/user.model";

import { UserService } from "../service/user.service";

import { UserRequest as UserReq } from "../types/user.type";

export class UserController {
  /**
   * Get user profile
   * @param {UserRequest} req request that contains user information
   * @param {express.Response} res response that contains user profile
   * @param {express.NextFunction} next next function to handle error
   * @throws {ResponseError} if error occur
   * @returns {Promise<void>} promise that resolves when successfully get user profile
   */
  public static async profile(req: UserReq, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // assert user
      const user: (User & { permissions: UserPermission | null }) | undefined = req.user;

      // call service
      const response: UserResponse = await UserService.profile(user);

      // return response
      res.status(200).json({ status: "Success", code: 200, data: response, message: "Get profile successfully" });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Logout user
   * @param {UserRequest} req request that contains user information
   * @param {express.Response} res response that contains user profile
   * @param {express.NextFunction} next next function to handle error
   * @throws {ResponseError} if error occur
   * @returns {Promise<void>} promise that resolves when successfully logout user
   */
  public static async logout(req: UserReq, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // assert user
      const user: (User & { permissions: UserPermission | null }) | undefined = req.user;

      // call service
      const response: UserResponse = await UserService.logout(user);

      // clear cookie
      res.clearCookie("session", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        signed: true,
      });

      // return response
      res.status(200).json({ status: "Success", code: 200, data: response, message: "User logged out successfully" });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Change user password
   * @param {UserRequest} req request that contains old password and new password
   * @param {express.Response} res response that contains user profile
   * @param {express.NextFunction} next next function to handle error
   * @throws {ResponseError} if error occur
   * @returns {Promise<void>} promise that resolves when successfully change user password
   */
  public static async updatePassword(req: UserReq, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // assert request
      const request: UserRequest = req.body as UserRequest;

      // assert user
      const user: (User & { permissions: UserPermission | null }) | undefined = req.user;

      // call service
      const response: UserResponse = await UserService.updatePassword(user, request);

      // return response
      res.status(200).json({ status: "Success", code: 200, data: response, message: "Change password successfully" });
    } catch (error: any) {
      next(error);
    }
  }

  public static async updatePhotoPreview(req: UserReq, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // assert user
      const user: (User & { permissions: UserPermission | null }) | undefined = req.user;
      
      // call service
      const response: UserResponse = await UserService.updatePhotoPreview(user);

      // return response
      res.status(200).json({ status: "Success", code: 200, data: response, message: "Get photo preview successfully" });
    } catch (error: any) {
      next(error);
    }
  }

  public static async updatePhoto(req: UserReq, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // assert user
      const user: (User & { permissions: UserPermission | null }) | undefined = req.user;

      // assert request
      const request: UserRequest = req.body as UserRequest;

      // assert file
      const file: Express.Multer.File | undefined = req.file;

      // include request file if exists
      if (file) {
        request.photo = file.mimetype;
      }

      // call service
      const response: UserResponse = await UserService.updatePhoto(user, request, file);

      // return response
      res.status(200).json({ status: "Success", code: 200, data: response, message: "Update photo successfully" });
    } catch (error: any) {
      next(error);
    }
  }

  public static async updatePersonalInfoPreview(req: UserReq, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // assert user
      const user: (User & { permissions: UserPermission | null }) | undefined = req.user;

      // call service
      const response: UserResponse = await UserService.updatePersonalInfoPreview(user);

      // return response
      res.status(200).json({ status: "Success", code: 200, data: response, message: "Get personal info preview successfully" });
    } catch (error: any) {
      next(error);
    }
  }

  public static async updatePersonalInfo(req: UserReq, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      // assert user
      const user: (User & { permissions: UserPermission | null }) | undefined = req.user;

      // assert request
      const request: UserRequest = req.body as UserRequest;

      // call service
      const response: UserResponse = await UserService.updatePersonalInfo(user, request);

      // return response
      res.status(200).json({ status: "Success", code: 200, data: response, message: "Update personal info successfully" });
    } catch (error: any) {
      next(error);
    }
  }

  public static async updateAddress(req: UserReq, res: express.Response, next: express.NextFunction): Promise<void> {}
}
