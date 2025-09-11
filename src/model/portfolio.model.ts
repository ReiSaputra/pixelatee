import { $Enums, Client, Portfolio } from "../generated/prisma";

export type PortfolioParams = {
  portfolioId: string;
};

export type PortfolioFilters = {
  page: number;
  search?: string | undefined;
  status?: "PUBLISHED" | "ARCHIVED" | undefined;
};

export type PortfolioRequest = {
  title: string;
  description?: string | null | undefined;
  status: $Enums.PortfolioStatus;
  client?: string | null | undefined;
  mainImage?: string | null | undefined;
  secondImage?: string | null | undefined;
  thirdImage?: string | null | undefined;
  fourthImage?: string | null | undefined;
  fifthImage?: string | null | undefined;
};

export type PortfolioResponse = {
  id?: string;
  title: string;
  description?: string;
  client?: string | undefined;
  mainImage?: string;
  secondImage?: string | null;
  thirdImage?: string | null;
  fourthImage?: string | null;
  fifthImage?: string | null;
};

export type PortfolioPaginationResponse = {
  portfolios: PortfolioResponse[];
  pagination: {
    page: number;
    limit: number;
    totalData: number;
    totalPage: number;
  };
};

/**
 * Convert a Portfolio model to a PortfolioResponse object
 * @param portfolio the Portfolio model to be converted
 * @returns the PortfolioResponse object
 */
export function toPortfolioResponse(portfolio: Portfolio & { client: Client | null }): PortfolioResponse {
  return {
    title: portfolio.title,
    description: portfolio.description!,
    client: portfolio.client?.name,
    mainImage: portfolio.mainImage!,
    secondImage: portfolio.secondImage!,
    thirdImage: portfolio.thirdImage!,
    fourthImage: portfolio.fourthImage!,
    fifthImage: portfolio.fifthImage!,
  };
}

/**
 * Convert an array of Portfolio models to an array of PortfolioResponse
 * @param portfolio an array of Portfolio models to be converted
 * @returns an array of PortfolioResponse that contains the converted Portfolio models
 */
export function toPortfoliosResponse(portfolio: (Portfolio & { client: Client | null })[]): PortfolioResponse[] {
  return portfolio.map((item) => {
    return {
      id: item.id,
      title: item.title,
      description: item.description!,
      client: item.client!.name,
      mainImage: item.mainImage!,
      secondImage: item.secondImage!,
      thirdImage: item.thirdImage!,
      fourthImage: item.fourthImage!,
      fifthImage: item.fifthImage!,
      createdAt: item.createdAt,
    };
  });
}

/**
 * Convert an array of Portfolio models to a PortfolioPaginationResponse object
 * @param data an array of Portfolio models to be converted
 * @param page the current page number
 * @param limit the limit of data per page
 * @param totalData the total data of the Portfolio models
 * @param totalPage the total page of the Portfolio models
 * @returns a PortfolioPaginationResponse object that contains the converted Portfolio models and pagination information
 */
export function toPortfolioPaginationResponse(portfolio: (Portfolio & { client: Client | null })[], page: number, limit: number, totalData: number, totalPage: number): PortfolioPaginationResponse {
  return {
    portfolios: toPortfoliosResponse(portfolio),
    pagination: {
      page: page,
      limit: limit,
      totalData: totalData,
      totalPage: totalPage,
    },
  };
}
