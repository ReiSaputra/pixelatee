import bcrypt from "bcrypt";

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
}
