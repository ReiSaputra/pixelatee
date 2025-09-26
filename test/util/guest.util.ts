import { prisma } from "../../src/application/database";

export class GuestUtil {
  /**
   * Delete all visitor from the database
   * @returns a promise that resolves to void when all visitors are deleted
   */
  public static async deleteAllVisitor(): Promise<void> {
    await prisma.guestVisit.deleteMany();
  }
}
