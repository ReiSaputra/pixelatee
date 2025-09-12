import { faker } from "@faker-js/faker";

import { prisma } from "../../src/application/database";

import { ClientResponse } from "../../src/model/client.model";

export type ClientResponseSuccess = {
  status: string;
  code: number;
  data: ClientResponse;
  message: string;
};

export type ClientResponseError = {
  status: string;
  code: number;
  error: string;
  message: string;
};

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

  public static async findClient(name: string): Promise<string> {
    const client = await prisma.client.findFirst({ where: { name: name } });

    return client!.id;
  }

  public static async createAllClient(limiter: number): Promise<void> {
    for (let i = 0; i < limiter; i++) {
      await prisma.client.create({ data: { name: faker.company.name(), logo: faker.image.url() } });
    }
  }

  /**
   * Delete a client by their ID
   * @param id the ID of the client to be deleted
   */
  public static async deleteClient(id: string): Promise<void> {
    await prisma.client.delete({ where: { id: id } });
  }

  /**
   * Delete all clients from the database
   */
  public static async deleteAllClient(): Promise<void> {
    await prisma.client.deleteMany();
  }
}
