import { Client } from "../generated/prisma";

export type ClientParams = {
  clientId: string;
};

export type ClientRequest = {
  name: string;
  logo?: string | undefined;
};

export type ClientResponse = {
  id?: string;
  name: string;
  logo?: string;
};

export function toClientResponse(client: Client): ClientResponse {
  return {
    name: client.name,
  };
}

export function toClientsResponse(client: Client[]): ClientResponse[] {
  return client.map((item) => {
    return {
      id: item.id,
      name: item.name,
      logo: item.logo,
    };
  });
}
