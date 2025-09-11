import z from "zod";

import { ContactFilters, ContactParams, ContactRequest } from "../model/contact.model";

export class ContactSchema {
  public static readonly CREATE: z.ZodType<ContactRequest> = z
    .strictObject({
      name: z.string({ error: "Invalid type of name, must be string" }).nonempty({ error: "Name is required" }),
      email: z.email({ error: "Invalid email address" }).nonempty({ error: "Email is required" }),
      subject: z.string({ error: "Invalid type of subject, must be string" }).nonempty({ error: "Subject is required" }),
      type: z.enum(["CUSTOMER_SERVICE", "IT_CONSULTATION", "UIUX_DEVELOPMENT", "MOBILE_DEVELOPMENT", "WEB_DEVELOPMENT"], {
        error: "Invalid type of type, must be CUSTOMER_SERVICE, IT_CONSULTATION, UIUX_DEVELOPMENT, MOBILE_DEVELOPMENT, WEB_DEVELOPMENT",
      }),
      message: z.string({ error: "Invalid type of message, must be string" }).nonempty({ error: "Message is required" }),
    })
    .required();

  public static readonly GET_ALL: z.ZodType<ContactFilters> = z.strictObject({
    page: z.coerce.number({ error: "Invalid type of page, must be number" }).min(1, { error: "Page must be greater than 0" }).default(1),
    search: z.string({ error: "Invalid type of search, must be string" }).optional(),
    type: z
      .enum(["CUSTOMER_SERVICE", "IT_CONSULTATION", "UIUX_DEVELOPMENT", "MOBILE_DEVELOPMENT", "WEB_DEVELOPMENT"], {
        error: "Invalid type of type, must be CUSTOMER_SERVICE, IT_CONSULTATION, UIUX_DEVELOPMENT, MOBILE_DEVELOPMENT, WEB_DEVELOPMENT",
      })
      .optional(),
  });

  public static readonly PARAMS: z.ZodType<ContactParams> = z.strictObject({
    contactId: z.string({ error: "Invalid type of contact ID" }).nonempty({ error: "Contact ID is required" }),
  });
}
