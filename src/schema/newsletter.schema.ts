import z from "zod";
import { NewsletterParams, NewsletterRequest } from "../model/newsletter.model";

export class NewsletterSchema {
  public static readonly JOIN: z.ZodType<NewsletterRequest> = z
    .strictObject({
      email: z.email({ error: "Invalid email address" }).nonempty({ error: "Email is required" }),
    })
    .required();

  public static readonly ACTIVATE: z.ZodType<NewsletterParams> = z
    .strictObject({
      memberId: z.string({ error: "Invalid type of member ID" }).nonempty({ error: "Member Id is required" }),
    })
    .required();

  public static readonly THANKS: z.ZodType<NewsletterParams> = z
    .strictObject({
      memberId: z.string({ error: "Invalid type of member ID" }).nonempty({ error: "Member Id is required" }),
    })
    .required();
}
