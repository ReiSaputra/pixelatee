import bcrypt from "bcrypt";
import request from "supertest";

import { web } from "../../src/application/web";

import { prisma } from "../../src/application/database";

import { $Enums } from "../../src/generated/prisma";

import { AuthResponse } from "../../src/model/auth.model";

export type AuthResponseSuccess = {
  status: string;
  code: number;
  data: AuthResponse;
  message: string;
};

export type AuthResponseError = {
  status: string;
  code: number;
  error: string;
  message: string;
};

export class AdminUtil {
  /**
   * Create a new admin in the database
   * @param firstName the first name of the admin
   * @param lastName the last name of the admin
   * @param email the email address of the admin
   * @param password the password of the admin
   * @param role the role of the admin
   * @param permissions whether to include all permissions for the admin
   * @returns the ID of the created admin
   */
  public static async createAdmin(firstName: string, lastName: string, email: string, password: string, role: $Enums.UserRole, permission: boolean): Promise<string> {
    const admin = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email: email,
        password: await bcrypt.hash(password, 10),
        role: role,
        permissions: {
          create: {
            canReadAdmin: permission,
            canWriteAdmin: permission,
            canUpdateAdmin: permission,
            canDeleteAdmin: permission,

            canReadContact: permission,
            canWriteContact: permission,
            canUpdateContact: permission,
            canDeleteContact: permission,

            canReadNewsletter: permission,
            canWriteNewsletter: permission,
            canUpdateNewsletter: permission,
            canDeleteNewsletter: permission,

            canReadPortfolio: permission,
            canWritePortfolio: permission,
            canUpdatePortfolio: permission,
            canDeletePortfolio: permission,
          },
        },
      },
    });

    return admin.id;
  }

  /**
   * Delete an admin by their ID
   * @param id the ID of the admin to be deleted
   */
  public static async deleteAdmin(id: string): Promise<void> {
    await prisma.userPermission.delete({ where: { userId: id } });

    await prisma.user.delete({
      where: {
        id: id,
      },
    });
  }

  /**
   * Delete all admin from the database
   * @returns a promise that resolves to void when all admin are deleted
   */
  public static async deleteAllAdmin(): Promise<void> {
    await prisma.user.deleteMany();
  }

  public static async updateAdminPermission(id: string, read: boolean, write: boolean, update: boolean, remove: boolean): Promise<void> {
    await prisma.userPermission.update({
      where: {
        userId: id,
      },
      data: {
        canReadAdmin: read,
        canWriteAdmin: write,
        canUpdateAdmin: update,
        canDeleteAdmin: remove,

        canReadContact: read,
        canWriteContact: write,
        canUpdateContact: update,
        canDeleteContact: remove,

        canReadNewsletter: read,
        canWriteNewsletter: write,
        canUpdateNewsletter: update,
        canDeleteNewsletter: remove,
        
        canReadPortfolio: read,
        canWritePortfolio: write,
        canUpdatePortfolio: update,
        canDeletePortfolio: remove,
      },
    });
  }

  /**
   * Delete all user permissions from the database
   * @returns a promise that resolves to void when all user permissions are deleted
   */
  public static async deleteAllAdminPermission(): Promise<void> {
    await prisma.userPermission.deleteMany();
  }

  /**
   * Login as an admin and retrieve a JWT token
   * @param email the email address of the admin
   * @param password the password of the admin
   * @returns a promise that resolves to the JWT token
   */
  public static async login(email: string, password: string): Promise<string> {
    const response = await request(web).post("/api/v1/public/auth/login").send({ email: email, password: password });

    const body: AuthResponseSuccess = response.body as AuthResponseSuccess;

    return body.data.token!;
  }
}
