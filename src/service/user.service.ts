import bcrypt from "bcrypt";
import fs from "fs";

import { prisma } from "../application/database";

import { User, UserAddress, UserPermission } from "../generated/prisma";

import { UserRequest, UserResponse, toUserResponse } from "../model/user.model";

import { Validation } from "../schema/validation";
import { UserSchema } from "../schema/user.schema";

export class UserService {
  /**
   * Get user profile
   * @param {User & { permissions: UserPermission | null }} user user that contains user information
   * @returns {Promise<AdminResponse>} promise that resolves when successfully get user profile
   * @throws {ResponseError} if user not found
   */
  public static async profile(user: (User & { permissions: UserPermission | null }) | undefined): Promise<UserResponse> {
    // find user
    const findUser: (User & { permissions: UserPermission | null; address: UserAddress | null }) | null = await prisma.user.findUnique({ where: { id: user?.id! }, include: { permissions: true, address: true } });

    // specify return
    findUser!.password = "*".repeat(findUser!.password.length).slice(0, 14);

    // return response
    return toUserResponse(findUser!);
  }

  /**
   * Logout user
   * @param {User & { permissions: UserPermission | null }} user user that contains user information
   * @returns {Promise<AdminResponse>} promise that resolves when successfully logout user
   * @throws {ResponseError} if user not found
   */
  public static async logout(user: (User & { permissions: UserPermission | null }) | undefined): Promise<UserResponse> {
    // find user
    const findUser: (User & { permissions: UserPermission | null; address: UserAddress | null }) | null = await prisma.user.findUnique({ where: { id: user?.id! }, include: { permissions: true, address: true } });

    // specify return
    findUser!.password = undefined!;
    findUser!.email = undefined!;
    findUser!.phoneNumber = undefined!;
    findUser!.role = undefined!;
    findUser!.permissions = undefined!;
    findUser!.address = undefined!;

    // return response
    return toUserResponse(findUser!);
  }

  /**
   * Get user photo preview
   * @param {User & { permissions: UserPermission | null }} user user that contains user information
   * @returns {Promise<UserResponse>} promise that resolves when successfully get user photo preview
   * @throws {ResponseError} if user not found
   */
  public static async updatePhotoPreview(user: (User & { permissions: UserPermission | null }) | undefined): Promise<UserResponse> {
    // find user
    const findUser: (User & { permissions: UserPermission | null; address: UserAddress | null }) | null = await prisma.user.findUnique({ where: { id: user?.id! }, include: { address: true, permissions: true } });

    // specify return
    findUser!.name = undefined!;
    findUser!.password = undefined!;
    findUser!.email = undefined!;
    findUser!.phoneNumber = undefined!;
    findUser!.role = undefined!;
    findUser!.permissions = undefined!;
    findUser!.address = undefined!;

    // return response
    return toUserResponse(findUser!);
  }

  /**
   * Update user photo
   * @param {User & { permissions: UserPermission | null }} user user that contains user information
   * @param {UserRequest} request request that contains user photo
   * @param {Express.Multer.File | undefined} file user photo file
   * @returns {Promise<UserResponse>} promise that resolves when successfully update user photo
   * @throws {ResponseError} if user not found
   */
  public static async updatePhoto(user: (User & { permissions: UserPermission | null }) | undefined, request: UserRequest, file: Express.Multer.File | undefined): Promise<UserResponse> {
    // request validation
    const response: UserRequest = Validation.validate<UserRequest>(UserSchema.UPDATE_PHOTO, request);

    // find user
    const findUser: User | null = await prisma.user.findUnique({ where: { id: user?.id! } });

    // delete old photo if it's not default.png
    if (findUser!.photo && findUser!.photo !== "default.png") {
      const oldPath = `public/photo/${findUser!.photo}`;
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // update photo
    const updatePhotoUser: (User & { permissions: UserPermission | null; address: UserAddress | null }) | null = await prisma.user.update({
      where: { id: user?.id! },
      data: { photo: file?.filename! },
      include: { address: true, permissions: true },
    });

    // specify return
    updatePhotoUser!.password = undefined!;
    updatePhotoUser!.email = undefined!;
    updatePhotoUser!.phoneNumber = undefined!;
    updatePhotoUser!.photo = undefined!;
    updatePhotoUser!.role = undefined!;
    updatePhotoUser!.permissions = undefined!;
    updatePhotoUser!.address = undefined!;

    // return response
    return toUserResponse(updatePhotoUser!);
  }

  public static async updatePersonalInfoPreview(user: (User & { permissions: UserPermission | null }) | undefined): Promise<UserResponse> {
    // find user
    const findUser: (User & { permissions: UserPermission | null; address: UserAddress | null }) | null = await prisma.user.findUnique({ where: { id: user?.id! }, include: { address: true, permissions: true } });

    // specify return
    findUser!.password = undefined!;
    findUser!.permissions = undefined!;
    findUser!.address = undefined!;

    // return response
    return toUserResponse(findUser!);
  }

  public static async updatePersonalInfo(user: (User & { permissions: UserPermission | null }) | undefined, request: UserRequest): Promise<UserResponse> {
    // request validation
    const response: UserRequest = Validation.validate(UserSchema.UPDATE_PERSONAL_INFO, request);

    // update personal info
    const updatePersonalInfo: User & { permissions: UserPermission | null; address: UserAddress | null } = await prisma.user.update({
      where: {
        id: user?.id!,
      },
      data: {
        name: response.name!,
        email: response.email!,
        phoneNumber: response.phoneNumber!,
        dateOfBirth: response.dateOfBirth!,
      },
      include: { address: true, permissions: true },
    });

    // specify return
    updatePersonalInfo.password = undefined!;
    updatePersonalInfo.email = undefined!;
    updatePersonalInfo.photo = undefined!;
    updatePersonalInfo.phoneNumber = undefined!;
    updatePersonalInfo.role = undefined!;
    updatePersonalInfo.permissions = undefined!;
    updatePersonalInfo.address = undefined!;

    return toUserResponse(updatePersonalInfo);
  }

  /**
   * Change user password
   * @param {User & { permissions: UserPermission | null }} user user that contains user information
   * @param {AdminRequest} request request that contains oldPassword and newPassword
   * @returns {Promise<AdminResponse>} promise that resolves when successfully change user password
   * @throws {ResponseError} if user not found or old password not match
   */
  public static async updatePassword(user: (User & { permissions: UserPermission | null }) | undefined, request: UserRequest): Promise<UserResponse> {
    // request validation
    const response: UserRequest = Validation.validate<UserRequest>(UserSchema.UPDATE_PASSWORD, request);

    // update password user
    const updatePasswordUser: User & { permissions: UserPermission | null; address: UserAddress | null } = await prisma.user.update({
      where: { id: user?.id! },
      data: {
        password: await bcrypt.hash(response.password!, 10),
      },
      include: { permissions: true, address: true },
    });

    // specify return
    updatePasswordUser.password = undefined!;
    updatePasswordUser.email = undefined!;
    updatePasswordUser.phoneNumber = undefined!;
    updatePasswordUser.role = undefined!;
    updatePasswordUser.permissions = undefined!;
    updatePasswordUser.address = undefined!;

    // return response
    return toUserResponse(updatePasswordUser);
  }
}
