import z from "zod";

import { PortfolioFilters, PortfolioParams, PortfolioRequest } from "../model/portfolio.model";

export class PortfolioSchema {
  public static readonly GET_DETAIL: z.ZodType<PortfolioParams> = z
    .strictObject({
      portfolioId: z.string({ error: "Invalid type of portfolio ID" }).nonempty({ error: "Portfolio ID is required" }),
    })
    .required();

  public static readonly CREATE: z.ZodType<PortfolioRequest> = z.strictObject({
    title: z.string({ error: "Invalid type of title, must be string" }).nonempty({ error: "Title is required" }),
    description: z.string({ error: "Invalid type of description, must be string" }).nullable().optional(),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"], { error: "Invalid type of status, must be DRAFT, PUBLISHED or ARCHIVED" }).default("DRAFT"),
    client: z.string({ error: "Invalid type of client, must be string" }).nullable().optional(),
    mainImage: z.string({ error: "Invalid type of main image, must be string" }).nullable().optional(),
    secondImage: z.string({ error: "Invalid type of second image, must be string" }).nullable().optional(),
    thirdImage: z.string({ error: "Invalid type of third image, must be string" }).nullable().optional(),
    fourthImage: z.string({ error: "Invalid type of fourth image, must be string" }).nullable().optional(),
    fifthImage: z.string({ error: "Invalid type of fifth image, must be string" }).nullable().optional(),
  });

  public static readonly GET_ALL: z.ZodType<PortfolioFilters> = z.strictObject({
    page: z.coerce.number({ error: "Invalid type of page, must be number" }).min(1, { error: "Page must be greater than 0" }).default(1),
    title: z.string({ error: "Invalid type of title, must be string" }).optional(),
    client: z.string({ error: "Invalid type of client, must be string" }).optional(),
    status: z.enum(["PUBLISHED", "ARCHIVED"], { error: "Invalid type of status, must be PUBLISHED or ARCHIVED" }).optional(),
  });
}
