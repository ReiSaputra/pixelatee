import { faker } from "@faker-js/faker";

import bcrypt from "bcrypt";

import { prisma } from "../../src/application/database";

import { $Enums } from "../../src/generated/prisma";

export class AdminUtil {
  /**
   * Create a new admin user in the database
   * @param firstName first name of the admin
   * @param lastName last name of the admin
   * @param email email of the admin
   * @param password password of the admin
   * @param role role of the admin
   * @returns the id of the created admin
   */
  public static async createAdmin(firstName: string, lastName: string, email: string, password: string, role: $Enums.UserRole): Promise<string> {
    const admin = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        username: faker.internet.username({ firstName: firstName, lastName: lastName }),
        email: email,
        password: await bcrypt.hash(password, 10),
        role: role,
      },
    });

    return admin.id;
  }

  /**
   * Delete an admin user by its email
   * @param email email of the admin to be deleted
   */
  public static async deleteAdmin(email: string): Promise<void> {
    await prisma.user.delete({
      where: {
        email: email,
      },
    });
  }
}
