import z from "zod";

import { ContactRequest } from "../model/contact.model";

export class ContactSchema {
  public static readonly CREATE: z.ZodType<ContactRequest> = z
    .strictObject({
      name: z.string({ error: "Invalid type of name, must be string" }).nonempty({ error: "Name is required" }),
      email: z.email({ error: "Invalid email address" }).nonempty({ error: "Email is required" }),
      subject: z.string({ error: "Invalid type of subject, must be string" }).nonempty({ error: "Subject is required" }),
      message: z.string({ error: "Invalid type of message, must be string" }).nonempty({ error: "Message is required" }),
    })
    .required();
}
