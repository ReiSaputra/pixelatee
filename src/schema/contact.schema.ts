import z from "zod";

import { ContactRequest } from "../model/contact.model";
import { PortfolioFilters } from "../model/portfolio.model";

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

  public static readonly GET_ALL: z.ZodType<PortfolioFilters> = z.strictObject({
    page: z.coerce.number({ error: "Invalid type of page, must be number" }).min(1, { error: "Page must be greater than 0" }).default(1),
    title: z.string({ error: "Invalid type of title, must be string" }).optional(),
    client: z.string({ error: "Invalid type of client, must be string" }).optional(),
    status: z.enum(["PUBLISHED", "ARCHIVED"], { error: "Invalid type of status, must be PUBLISHED or ARCHIVED" }).optional(),
  });
}
