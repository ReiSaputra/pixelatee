import { faker } from "@faker-js/faker";

import { prisma } from "../../src/application/database";

import { PortfolioResponse } from "../../src/model/portfolio.model";

export type PortfolioResponseSuccess = {
  status: string;
  code: number;
  data: PortfolioResponse;
  message: string;
};

export type PortfoliosResponseSuccess = {
  status: string;
  code: number;
  data: PortfolioResponse[];
  message: string;
};

export type PortfolioResponseError = {
  status: string;
  code: number;
  error: string;
  message: string;
};

export class PortfolioUtil {
  /**
   * Create a new portfolio in the database
   * @param title the title of the portfolio
   * @param description the description of the portfolio
   * @param authorId the author ID of the portfolio
   * @param secondImage whether to include the second image or not
   * @param thirdImage whether to include the third image or not
   * @param fourthImage whether to include the fourth image or not
   * @param fifthImage whether to include the fifth image or not
   * @returns the ID of the created portfolio
   */
  public static async createPortfolio(title: string, description: string, authorId: string, secondImage?: boolean, thirdImage?: boolean, fourthImage?: boolean, fifthImage?: boolean): Promise<string> {
    const portfolio = await prisma.portfolio.create({
      data: {
        title: title,
        description: description,
        mainImage: faker.image.url(),
        secondImage: secondImage ? faker.image.url() : null,
        thirdImage: thirdImage ? faker.image.url() : null,
        fourthImage: fourthImage ? faker.image.url() : null,
        fifthImage: fifthImage ? faker.image.url() : null,
        authorId: authorId,
      },
    });

    return portfolio.id;
  }

  /**
   * Create a specified amount of portfolio in the database
   * @param limiter the amount of portfolio to be created
   * @param authorId the author ID of the portfolio
   * @param secondImage whether to include the second image or not
   * @param thirdImage whether to include the third image or not
   * @param fourthImage whether to include the fourth image or not
   * @param fifthImage whether to include the fifth image or not
   */
  public static async createAllPortfolio(limiter: number, authorId: string, secondImage?: boolean, thirdImage?: boolean, fourthImage?: boolean, fifthImage?: boolean): Promise<void> {
    for (let i = 1; i <= limiter; i++) {
      await prisma.portfolio.create({
        data: {
          title: faker.commerce.productName(),
          description: faker.lorem.paragraphs(2),
          mainImage: faker.image.url(),
          secondImage: secondImage ? faker.image.url() : null,
          thirdImage: thirdImage ? faker.image.url() : null,
          fourthImage: fourthImage ? faker.image.url() : null,
          fifthImage: fifthImage ? faker.image.url() : null,
          authorId: authorId,
        },
      });
    }
  }

  /**
   * Delete a portfolio by its ID
   * @param id ID of the portfolio to be deleted
   */
  public static async deletePortfolio(id: string): Promise<void> {
    await prisma.portfolio.delete({ where: { id: id } });
  }

  /**
   * Delete all portfolios in the database
   */
  public static async deleteAllPortfolio(): Promise<void> {
    await prisma.portfolio.deleteMany();
  }
}
