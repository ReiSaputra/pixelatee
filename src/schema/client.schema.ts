import z from "zod";

import { ClientParams, ClientRequest } from "../model/client.model";

export class ClientSchema {
  public static readonly CREATE: z.ZodType<ClientRequest> = z
    .strictObject({
      name: z.string({ error: "Invalid type of name, must be string" }).nonempty({ error: "Name is required" }),
      logo: z
        .string({ error: "Invalid type of logo, must be string" })
        .regex(/^image\/(png|jpeg)$/, { error: "Logo must be a PNG or JPEG image" })
        .nonempty({ error: "Logo is required" }),
    })
    .required();

  public static readonly DETAIL: z.ZodType<ClientParams> = z.strictObject({
    clientId: z.string({ error: "Invalid type of client ID" }).nonempty({ error: "Client ID is required" }),
  });

  public static readonly UPDATE: z.ZodType<ClientRequest> = z.strictObject({
    name: z.string({ error: "Invalid type of name, must be string" }),
    logo: z
      .string({ error: "Invalid type of logo, must be string" })
      .regex(/^image\/(png|jpeg)$/, { error: "Logo must be a PNG or JPEG image" })
      .optional(),
  });
}
