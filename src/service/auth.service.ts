import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { prisma } from "../application/database";

import { User } from "../generated/prisma";

import { AuthLoginRequest, AuthRegisterRequest, AuthResponse, toAuthResponse } from "../model/auth.model";

import { AuthSchema } from "../schema/auth.schema";
import { Validation } from "../schema/validation";

import { ResponseError } from "../error/response.error";

export class AuthService {
  /**
   * Login user
   * @param request request that contains user information
   * @throws ResponseError if error occur
   * @returns AuthResponse object with user data and token
   */
  public static async login(request: AuthLoginRequest): Promise<AuthResponse> {
    // request validation
    const response: AuthLoginRequest = Validation.validate(AuthSchema.LOGIN, request);

    // find user
    const findUser: User | null = await prisma.user.findUnique({ where: { email: response.email } });

    // if user not found then throw error
    if (!findUser) throw new ResponseError("Username/Password is incorrect", 400);

    const isPasswordMatch: boolean = await bcrypt.compare(response.password, findUser.password);

    // if password not match then throw error
    if (!isPasswordMatch) throw new ResponseError("Username/Password is incorrect", 400);

    // sign jwt
    const token = jwt.sign({ id: findUser.id }, process.env.JWT_SECRET!, { expiresIn: "1d" });

    // return response
    return toAuthResponse(findUser, token);
  }

  /**
   * Register a new user
   * @param request request that contains user information
   * @throws ResponseError if error occur
   * @returns AuthResponse object with user data and token
   */
  public static async register(request: AuthRegisterRequest): Promise<AuthResponse> {
    // request validation
    const response: AuthRegisterRequest = Validation.validate<AuthRegisterRequest>(AuthSchema.REGISTER, request);

    // check if email already exists
    const findUser: User | null = await prisma.user.findUnique({ where: { email: response.email } });

    // if email already exist then throw error
    if (findUser) throw new ResponseError("Email is already exist", 400);

    // create user
    const createUser: User = await prisma.user.create({ data: { email: response.email, password: response.password, role: "ADMIN" } });

    // return response
    return toAuthResponse(createUser);
  }
}
