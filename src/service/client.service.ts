import fs from "fs";

import { prisma } from "../application/database";

import { Client } from "../generated/prisma";

import { ClientParams, ClientRequest, ClientResponse, toClientResponse, toClientsResponse } from "../model/client.model";
import { ClientSchema } from "../schema/client.schema";

import { Validation } from "../schema/validation";

import { ResponseError } from "../error/response.error";

export class ClientService {
  /**
   * Get all client
   * @returns array of ClientResponse that contains all client sorted by name
   * @throws ResponseError if error occur
   */
  public static async adminGetAll(): Promise<ClientResponse[]> {
    // find all client
    const findClient: Client[] = await prisma.client.findMany({ orderBy: { name: "asc" } });

    // specify return
    findClient.map((item) => (item.id = undefined!));

    // return response
    return toClientsResponse(findClient);
  }

  /**
   * Create a new client in the database
   * @param request the client data
   * @returns the created client
   * @throws ResponseError if error occur
   */
  public static async adminCreate(request: ClientRequest, file: Express.Multer.File | undefined): Promise<ClientResponse> {
    // request validation
    const requestValidation: ClientRequest = Validation.validate<ClientRequest>(ClientSchema.CREATE, request);

    // create client
    const createClient: Client = await prisma.client.create({
      data: {
        name: requestValidation.name,
        logo: file?.filename!,
      },
    });

    // return response
    return toClientResponse(createClient);
  }

  /**
   * Update a client in the database
   * @param request the client data
   * @param params the client ID
   * @returns the updated client
   * @throws ResponseError if error occur
   */
  public static async adminUpdate(request: ClientRequest, params: ClientParams, file: Express.Multer.File | undefined): Promise<ClientResponse> {
    // request validation
    const requestValidation: ClientRequest = Validation.validate<ClientRequest>(ClientSchema.UPDATE, request);

    // params validation
    const paramsValidation: ClientParams = Validation.validate<ClientParams>(ClientSchema.DETAIL, params);

    // find client
    const findClient: Client | null = await prisma.client.findUnique({ where: { id: paramsValidation.clientId } });

    // throw error if client not found
    if (!findClient) throw new ResponseError("Client not found");

    // delete old file
    if (file && file.filename !== findClient.logo) {
      if (fs.existsSync(`public/client/${findClient.logo}`)) {
        fs.unlinkSync(`public/client/${findClient.logo}`);
      }
    }

    // update client
    const updateClient: Client = await prisma.client.update({
      data: {
        name: requestValidation.name,
        logo: file?.originalname ?? findClient.logo,
      },
      where: { id: paramsValidation.clientId },
    });

    // return response
    return toClientResponse(updateClient);
  }

  /**
   * Delete a client by ID
   * @param params the client ID to delete
   * @returns the deleted client
   * @throws ResponseError if error occur
   */
  public static async adminDelete(params: ClientParams): Promise<ClientResponse> {
    // params validation
    const paramsValidation: ClientParams = Validation.validate<ClientParams>(ClientSchema.DETAIL, params);

    // find client
    const findClient: Client | null = await prisma.client.findUnique({ where: { id: paramsValidation.clientId } });

    // if client not found, throw error
    if (!findClient) {
      throw new ResponseError("Client is not found", 400);
    }

    // delete file
    if (fs.existsSync(`public/client/${findClient.logo}`)) {
      fs.unlinkSync(`public/client/${findClient.logo}`);
    }

    // delete client
    const deleteClient: Client = await prisma.client.delete({ where: { id: findClient.id } });

    // return response
    return toClientResponse(deleteClient);
  }

  /**
   * Get all client that is available in form
   * @returns array of ClientResponse that contains all client sorted by name
   * @throws ResponseError if error occur
   */
  public static async formGetAll(): Promise<ClientResponse[]> {
    // find all client
    const findClient: Client[] = await prisma.client.findMany({ orderBy: { name: "asc" } });

    // specify return
    findClient.map((item) => (item.logo = undefined!));

    // return response
    return toClientsResponse(findClient);
  }
}
