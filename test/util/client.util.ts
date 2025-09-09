import { faker } from "@faker-js/faker";

import { prisma } from "../../src/application/database";

export class ClientUtil {
  /**
   * Create a new client in the database
   * @param name the name of the client
   * @returns the ID of the created client
   */
  public static async createClient(name: string): Promise<string> {
    const client = await prisma.client.create({ data: { name: name, logo: faker.image.url() } });

    return client.id;
  }

  /**
   * Delete all clients from the database
   */
  public static async deleteAllClient(): Promise<void> {
    await prisma.client.deleteMany();
  }
}
