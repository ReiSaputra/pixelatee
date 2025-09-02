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
 * Convert a Portfolio model to PortfolioResponse
 * @param data Portfolio model
 * @returns PortfolioResponse
 */
export function toPortfolioResponse(data: Portfolio): PortfolioResponse {
  return {
    title: data.title,
    description: data.description,
    mainImage: data.mainImage,
    secondImage: data.secondImage!,
    thirdImage: data.thirdImage!,
    fourthImage: data.fourthImage!,
    fifthImage: data.fifthImage!,
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
