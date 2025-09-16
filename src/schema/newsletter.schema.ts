import z from "zod";
import { NewsletterFilters, NewsletterJoinParams, NewsletterJoinRequest, NewsletterParams, NewsletterRequest } from "../model/newsletter.model";

export class NewsletterSchema {
  public static readonly JOIN: z.ZodType<NewsletterJoinRequest> = z
    .strictObject({
      email: z.email({ error: "Invalid email address" }).nonempty({ error: "Email is required" }),
    })
    .required();

  public static readonly MEMBER: z.ZodType<NewsletterJoinParams> = z
    .strictObject({
      memberId: z.string({ error: "Invalid type of member ID" }).nonempty({ error: "Member Id is required" }),
    })
    .required();

  public static readonly DETAIL: z.ZodType<NewsletterParams> = z.strictObject({
    newsletterId: z.string({ error: "Invalid type of newsletter ID" }).nonempty({ error: "Newsletter Id is required" }),
  });

  public static readonly FILTER: z.ZodType<NewsletterFilters> = z.strictObject({
    search: z.string({ error: "Invalid type of search, must be string" }).optional(),
    status: z.enum(["PUBLISHED", "ARCHIVED"], { error: "Invalid type of status, must be PUBLISHED or ARCHIVED" }).optional(),
    type: z.enum(["TECH", "BUSINESS", "INTERNAL", "OTHER"], { error: "Invalid type of type, must be BLOG or NEWSLETTER" }).optional(),
  });

  public static readonly CREATE: z.ZodType<NewsletterRequest> = z.strictObject({
    title: z.string({ error: "Invalid type of title, must be string" }).nonempty({ error: "Title is required" }),
    content: z.string({ error: "Invalid type of content, must be string" }).nonempty({ error: "Content is required" }),
    type: z.enum(["TECH", "BUSINESS", "INTERNAL", "OTHER"], { error: "Invalid type of type, must be TECH, BUSINESS, INTERNAL or OTHER" }),
    photo: z
      .string({ error: "Invalid type of photo, must be string" })
      .regex(/^image\/(png|jpeg)$/, { error: "Photo must be a PNG or JPEG image" })
      .nonempty({ error: "Photo is required" }),
    isScheduled: z.enum(["true", "false"], { error: "Invalid type of isScheduled, must be true or false" }),
    status: z.enum(["PUBLISHED"], { error: "Invalid type of status, must be PUBLISHED" }),
  });

  public static readonly UPDATE: z.ZodType<NewsletterRequest> = z.strictObject({
    title: z.string({ error: "Invalid type of title, must be string" }).nonempty({ error: "Title is required" }),
    content: z.string({ error: "Invalid type of content, must be string" }).nonempty({ error: "Content is required" }),
    type: z.enum(["TECH", "BUSINESS", "INTERNAL", "OTHER"], { error: "Invalid type of type, must be TECH, BUSINESS, INTERNAL or OTHER" }),
    photo: z
      .string({ error: "Invalid type of photo, must be string" })
      .regex(/^image\/(png|jpeg)$/, { error: "Photo must be a PNG or JPEG image" })
      .optional(),
    isScheduled: z.enum(["true", "false"], { error: "Invalid type of isScheduled, must be true or false" }),
    status: z.enum(["PUBLISHED"], { error: "Invalid type of status, must be PUBLISHED" }),
  });
}
