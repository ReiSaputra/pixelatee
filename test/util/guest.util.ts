import { faker } from "@faker-js/faker";
import { v4 as uuid } from "uuid";

import { prisma } from "../../src/application/database";

export class GuestUtil {
  public static async createAllVisitor(limiter: number): Promise<void> {
    for (let i = 0; i < limiter; i++) {
      await prisma.guestVisit.create({
        data: {
          visitorId: uuid(),
          ip: faker.internet.ip(),
          userAgent: faker.internet.userAgent(),
          visitDate: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      });
    }
  }

  /**
   * Delete all visitor from the database
   * @returns a promise that resolves to void when all visitors are deleted
   */
  public static async deleteAllVisitor(): Promise<void> {
    await prisma.guestVisit.deleteMany();
  }
}
