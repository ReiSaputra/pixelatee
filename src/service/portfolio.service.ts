import { prisma } from "../application/database";

import { Portfolio } from "../generated/prisma";

import { PortfolioParams, PortfolioResponse, toPortfolioResponse, toPortfoliosResponse } from "../model/portfolio.model";

import { Validation } from "../schema/validation";
import { PortfolioSchema } from "../schema/portfolio.schema";

import { ResponseError } from "../error/response.error";

export class PortfolioService {
  public static async publicGetAll(): Promise<PortfolioResponse[]> {
    // find all portfolio
    const findPortfolio: Portfolio[] = await prisma.portfolio.findMany();

    // specify return
    findPortfolio.map((item) => {
      item.secondImage = undefined!;
      item.thirdImage = undefined!;
      item.fourthImage = undefined!;
      item.fifthImage = undefined!;
    });

    // return response
    return toPortfoliosResponse(findPortfolio);
  }

  public static async publicGetDetail(request: PortfolioParams): Promise<PortfolioResponse> {
    // request validation
    const response: PortfolioParams = Validation.validate<PortfolioParams>(PortfolioSchema.PUBLIC_GET_DETAIL, request);

    // find portfolio
    const findPortfolio: Portfolio | null = await prisma.portfolio.findUnique({ where: { id: request.portfolioId } });

    // if portfolio not found then throw error
    if (!findPortfolio) throw new ResponseError("Portfolio not found");

    // specify return
    findPortfolio.id = undefined!;

    if(!findPortfolio.secondImage) findPortfolio.secondImage = undefined!;
    if(!findPortfolio.thirdImage) findPortfolio.thirdImage = undefined!;
    if(!findPortfolio.fourthImage) findPortfolio.fourthImage = undefined!;
    if(!findPortfolio.fifthImage) findPortfolio.fifthImage = undefined!;

    // return response
    return toPortfolioResponse(findPortfolio);
  }
}
