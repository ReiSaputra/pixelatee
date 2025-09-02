import z from "zod";

import { PortfolioParams } from "../model/portfolio.model";

export class PortfolioSchema {
  public static readonly PUBLIC_GET_DETAIL: z.ZodType<PortfolioParams> = z
    .strictObject({
      portfolioId: z.string({ error: "Invalid type of portfolio ID" }).nonempty({ error: "Portfolio ID is required" }),
    })
    .required();
}
