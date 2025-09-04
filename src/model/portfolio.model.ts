import { Portfolio } from "../generated/prisma";

export type PortfolioParams = {
  portfolioId: string;
};

export type PortfolioResponse = {
  id?: string;
  title: string;
  description: string;
  mainImage: string;
  secondImage?: string | null;
  thirdImage?: string | null;
  fourthImage?: string | null;
  fifthImage?: string | null;
};

/**
 * Convert a Portfolio model to a PortfolioResponse
 * @param portfolio the Portfolio model to be converted
 * @returns a PortfolioResponse that contains the converted Portfolio model
 */
export function toPortfolioResponse(portfolio: Portfolio): PortfolioResponse {
  return {
    title: portfolio.title,
    description: portfolio.description,
    mainImage: portfolio.mainImage,
    secondImage: portfolio.secondImage!,
    thirdImage: portfolio.thirdImage!,
    fourthImage: portfolio.fourthImage!,
    fifthImage: portfolio.fifthImage!,
  };
}

/**
 * Convert array of Portfolio model to array of PortfolioResponse
 * @param data array of Portfolio model
 * @returns array of PortfolioResponse
 */
export function toPortfoliosResponse(data: Portfolio[]): PortfolioResponse[] {
  return data.map((item) => {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      mainImage: item.mainImage,
      secondImage: item.secondImage!,
      thirdImage: item.thirdImage!,
      fourthImage: item.fourthImage!,
      fifthImage: item.fifthImage!,
    };
  });
}
