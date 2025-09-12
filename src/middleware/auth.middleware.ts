import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { prisma } from "../application/database";

import { $Enums, User, UserPermission } from "../generated/prisma";

import { UserRequest } from "../types/user.type";

import { ResponseError } from "../error/response.error";
import { Prisma } from "@prisma/client";

dotenv.config();

export class AuthMiddleware {
  /**
   * Authentication middleware
   * @param req request that contains authorization header
   * @param res response that contains user data
   * @param next next function to handle error
   * @throws ResponseError if error occur
   */
  public static async authentication(req: UserRequest, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      let authorization: string | undefined;

      // assert request header
      if (req.signedCookies.session) {
        authorization = req.signedCookies.session as string | undefined;
        authorization = `Bearer ${authorization}`;
      } else {
        authorization = req.headers.authorization as string | undefined;
      }

      // check authorization if not start with "Bearer "
      if (!authorization?.startsWith("Bearer ")) {
        // throw error if authorization not start with "Bearer "
        throw new ResponseError("Unauthorized", 401);
      }

      // get token
      const token: string | undefined = authorization.split(" ")[1];

      // check token if not exist
      if (!token) {
        // throw error if token not exist
        throw new ResponseError("Unauthorized", 401);
      }

      // verify jwt
      const verify: string | jwt.JwtPayload = jwt.verify(token, process.env.JWT_SECRET!);

      // assert payload to user
      const payload = verify as User;

      // find user from payload
      const findUser: (User & { permissions: UserPermission | null }) | null = await prisma.user.findUnique({ where: { id: payload.id }, include: { permissions: true } });

      // check if user not exist
      if (!findUser) {
        // throw error if user not exist
        throw new ResponseError("Unauthorized", 401);
      }

      // set user to request
      req.user = findUser;

      // next middleware
      next();
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Check user role
   * @param role user role to check
   * @returns middleware that checks user role
   */
  public static authorization(role: $Enums.UserRole[]): express.RequestHandler {
    return (req: UserRequest, res: express.Response, next: express.NextFunction) => {
      // check user role
      if (!role.includes(req.user!.role)) {
        // throw error if user role not match
        throw new ResponseError("Forbidden", 403);
      }

      // next middleware
      next();
    };
  }

  /**
   * Check user permissions
   * @param permission permission to check
   * @returns middleware to check permission
   */
  public static permission(
    permission:
      | "canReadNewsletter"
      | "canWriteNewsletter"
      | "canUpdateNewsletter"
      | "canDeleteNewsletter"
      | "canReadClient"
      | "canWriteClient"
      | "canUpdateClient"
      | "canDeleteClient"
      | "canReadPortfolio"
      | "canWritePortfolio"
      | "canUpdatePortfolio"
      | "canDeletePortfolio"
      | "canReadContact"
      | "canWriteContact"
      | "canUpdateContact"
      | "canDeleteContact"
      | "canReadAdmin"
      | "canWriteAdmin"
      | "canUpdateAdmin"
      | "canDeleteAdmin"
  ): express.RequestHandler {
    return (req: UserRequest, res: express.Response, next: express.NextFunction) => {
      // check user permissions
      if (req.user?.permissions![permission]) {
        // next middleware
        next();
      } else {
        // throw error if user permissions not match
        throw new ResponseError("Forbidden", 403);
      }
    };
  }
}
