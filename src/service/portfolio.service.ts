import fs from "fs/promises";

import { prisma } from "../application/database";

import { Client, Portfolio, Prisma, User, UserPermission } from "../generated/prisma";

import { PortfolioFilters, PortfolioPaginationResponse, PortfolioParams, PortfolioRequest, PortfolioResponse, toPortfolioPaginationResponse, toPortfolioResponse, toPortfoliosResponse } from "../model/portfolio.model";

import { Validation } from "../schema/validation";
import { PortfolioSchema } from "../schema/portfolio.schema";

import { ResponseError } from "../error/response.error";
import { logger } from "../application/log";

export class PortfolioService {
  /**
   * Get all portfolio
   * @returns array of PortfolioResponse
   * @throws ResponseError if error occur
   */
  public static async publicGetAll(): Promise<PortfolioResponse[]> {
    // find all portfolio
    const findPortfolio: (Portfolio & { client: Client | null })[] = await prisma.portfolio.findMany({ include: { client: true } });

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

  /**
   * Get detail portfolio
   * @param request request that contains portfolio ID
   * @returns PortfolioResponse that contains detail portfolio
   * @throws ResponseError if error occur
   */
  public static async publicGetDetail(request: PortfolioParams): Promise<PortfolioResponse> {
    // request validation
    const response: PortfolioParams = Validation.validate<PortfolioParams>(PortfolioSchema.DETAIL, request);

    // find portfolio
    const findPortfolio: (Portfolio & { client: Client | null }) | null = await prisma.portfolio.findUnique({ where: { id: request.portfolioId }, include: { client: true } });

    // if portfolio not found then throw error
    if (!findPortfolio) throw new ResponseError("Portfolio not found");

    // specify return
    findPortfolio.id = undefined!;

    if (!findPortfolio.secondImage) findPortfolio.secondImage = undefined!;
    if (!findPortfolio.thirdImage) findPortfolio.thirdImage = undefined!;
    if (!findPortfolio.fourthImage) findPortfolio.fourthImage = undefined!;
    if (!findPortfolio.fifthImage) findPortfolio.fifthImage = undefined!;

    // return response
    return toPortfolioResponse(findPortfolio);
  }

  /**
   * Get all portfolio based on the user permission and filters
   * @param user the user that make the request
   * @param filters the filters to filter the data
   * @returns array of PortfolioResponse that contains the filtered data
   * @throws ResponseError if error occur
   */
  public static async adminGetAll(user: (User & { permissions: UserPermission | null }) | undefined, filters: PortfolioFilters): Promise<PortfolioPaginationResponse> {
    // query params validation
    const response: PortfolioFilters = Validation.validate<PortfolioFilters>(PortfolioSchema.FILTER, filters);

    // set offset for skipping data
    const offset = (response.page - 1) * 15;

    // dynamic where for filters
    const where: Prisma.PortfolioWhereInput = {
      authorId: user?.id!,
    };

    // if there is a status filter
    if (response.status) where.status = response.status;

    // if there is a search filter
    if (response.search) where.OR = [{ title: { contains: response.search } }, { client: { name: { contains: response.search } } }];

    // find all portfolio
    const findPortfolio: (Portfolio & { client: Client | null })[] = await prisma.portfolio.findMany({
      where,
      include: {
        client: true,
      },
      skip: offset,
      take: 15,
      orderBy: {
        createdAt: "desc",
      },
    });

    // specify filters
    findPortfolio.map((item) => {
      item.secondImage = undefined!;
      item.thirdImage = undefined!;
      item.fourthImage = undefined!;
      item.fifthImage = undefined!;
    });

    // count data
    const countPortfolio: number = await prisma.portfolio.count({ where });

    // return response
    return toPortfolioPaginationResponse(findPortfolio, response.page, 15, countPortfolio, Math.ceil(countPortfolio / 15));
  }

  /**
   * Get detail portfolio based on the user permission and filters
   * @param params the request that contains the portfolio ID
   * @returns the detail portfolio
   * @throws ResponseError if error occur
   */
  public static async adminGetDetail(params: PortfolioParams): Promise<PortfolioResponse> {
    // request validation
    const response: PortfolioParams = Validation.validate<PortfolioParams>(PortfolioSchema.DETAIL, params);

    // find portfolio
    const findPortfolio: (Portfolio & { client: Client | null }) | null = await prisma.portfolio.findUnique({ where: { id: response.portfolioId }, include: { client: true } });

    // if portfolio not found then throw error
    if (!findPortfolio) throw new ResponseError("Portfolio not found");

    // specify return
    if (findPortfolio.secondImage === null) findPortfolio.secondImage = undefined!;
    if (findPortfolio.thirdImage === null) findPortfolio.thirdImage = undefined!;
    if (findPortfolio.fourthImage === null) findPortfolio.fourthImage = undefined!;
    if (findPortfolio.fifthImage === null) findPortfolio.fifthImage = undefined!;

    // return response
    return toPortfolioResponse(findPortfolio);
  }

  public static async adminEditPreview(params: PortfolioParams): Promise<PortfolioResponse> {
    // params validation
    const paramsValidation = Validation.validate<PortfolioParams>(PortfolioSchema.DETAIL, params);

    // find portfolio
    const findPortfolio: (Portfolio & { client: Client | null }) | null = await prisma.portfolio.findUnique({ where: { id: paramsValidation.portfolioId }, include: { client: true } });

    // if portfolio not found then throw error
    if (!findPortfolio) throw new ResponseError("Portfolio not found");

    // return response
    return toPortfolioResponse(findPortfolio);
  }

  public static async adminUpdate(params: PortfolioParams, request: PortfolioRequest, files: Express.Multer.File[]): Promise<PortfolioResponse> {
    // params validation
    const paramsValidation = Validation.validate<PortfolioParams>(PortfolioSchema.DETAIL, params);

    // request validation
    const requestValidation: PortfolioRequest = Validation.validate<PortfolioRequest>(PortfolioSchema.UPDATE, request);

    // find portfolio
    const findPortfolio: (Portfolio & { client: Client | null }) | null = await prisma.portfolio.findUnique({ where: { id: params.portfolioId }, include: { client: true } });

    // if portfolio not found then throw error
    if (!findPortfolio) throw new ResponseError("Portfolio not found");

    // delete old files
    if (findPortfolio.mainImage) {
      try {
        await fs.access(`public/portfolio/${findPortfolio.mainImage}`);
        await fs.unlink(`public/portfolio/${findPortfolio.mainImage}`);
      } catch (error) {
        logger.error(error);
      }
    }
    if (findPortfolio.secondImage) {
      try {
        await fs.access(`public/portfolio/${findPortfolio.secondImage}`);
        await fs.unlink(`public/portfolio/${findPortfolio.secondImage}`);
      } catch (error) {
        logger.error(error);
      }
    }
    if (findPortfolio.thirdImage) {
      try {
        await fs.access(`public/portfolio/${findPortfolio.thirdImage}`);
        await fs.unlink(`public/portfolio/${findPortfolio.thirdImage}`);
      } catch (error) {
        logger.error(error);
      }
    }
    if (findPortfolio.fourthImage) {
      try {
        await fs.access(`public/portfolio/${findPortfolio.fourthImage}`);
        await fs.unlink(`public/portfolio/${findPortfolio.fourthImage}`);
      } catch (error) {
        logger.error(error);
      }
    }
    if (findPortfolio.fifthImage) {
      try {
        await fs.access(`public/portfolio/${findPortfolio.fifthImage}`);
        await fs.unlink(`public/portfolio/${findPortfolio.fifthImage}`);
      } catch (error) {
        logger.error(error);
      }
    }

    // update portfolio
    const updatePortfolio: Portfolio & { client: Client | null } = await prisma.portfolio.update({
      where: { id: paramsValidation.portfolioId },
      data: {
        title: requestValidation.title,
        description: requestValidation.description,
        mainImage: files[0]?.filename || findPortfolio.mainImage,
        secondImage: files[1]?.filename || findPortfolio.secondImage,
        thirdImage: files[2]?.filename || findPortfolio.thirdImage,
        fourthImage: files[3]?.filename || findPortfolio.fourthImage,
        fifthImage: files[4]?.filename || findPortfolio.fifthImage,
        status: requestValidation.status,
        client: { connect: { id: requestValidation.client } },
      },
      include: {
        client: true,
      },
    });

    // specify return
    updatePortfolio.description = undefined!;
    if (updatePortfolio.client) {
      updatePortfolio.client.name = undefined!;
    }
    updatePortfolio.mainImage = undefined!;
    updatePortfolio.secondImage = undefined!;
    updatePortfolio.thirdImage = undefined!;
    updatePortfolio.fourthImage = undefined!;
    updatePortfolio.fifthImage = undefined!;

    // return response
    return toPortfolioResponse(updatePortfolio);
  }

  /**
   * Create a new portfolio
   * @param user the user that make the request
   * @param request the request that contains the portfolio information
   * @param files the files that contain the portfolio images
   * @returns the created portfolio
   * @throws ResponseError if error occur
   */
  public static async adminCreate(user: (User & { permissions: UserPermission | null }) | undefined, request: PortfolioRequest, files: Express.Multer.File[]): Promise<PortfolioResponse> {
    // request validation
    const requestValidation: PortfolioRequest = Validation.validate<PortfolioRequest>(PortfolioSchema.CREATE, request);

    // check if client exists
    const findClient: Client | null = await prisma.client.findUnique({ where: { id: requestValidation.client } });

    // if client not found then throw error
    if (!findClient) throw new ResponseError("Client not found");

    // create portfolio
    const createPortfolio: Portfolio & { client: Client | null } = await prisma.portfolio.create({
      data: {
        title: requestValidation.title,
        description: requestValidation.description ?? null,
        status: requestValidation.status,
        clientId: findClient.id,
        authorId: user?.id!,
        mainImage: files[0]?.filename as string,
        secondImage: files[1]?.filename ?? null,
        thirdImage: files[2]?.filename ?? null,
        fourthImage: files[3]?.filename ?? null,
        fifthImage: files[4]?.filename ?? null,
      },
      include: {
        client: true,
      },
    });

    // specify return
    createPortfolio.description = undefined!;
    if (createPortfolio.client) {
      createPortfolio.client.name = undefined!;
    }
    createPortfolio.mainImage = undefined!;
    createPortfolio.secondImage = undefined!;
    createPortfolio.thirdImage = undefined!;
    createPortfolio.fourthImage = undefined!;
    createPortfolio.fifthImage = undefined!;

    // return response
    return toPortfolioResponse(createPortfolio);
  }

  /**
   * Delete a portfolio
   * @param params the params that contains the portfolio ID
   * @returns the deleted portfolio
   * @throws ResponseError if error occur
   */
  public static async adminDelete(params: PortfolioParams): Promise<PortfolioResponse> {
    // params validation
    const paramsValidation = Validation.validate<PortfolioParams>(PortfolioSchema.DETAIL, params);

    // find portfolio
    const findPortfolio: (Portfolio & { client: Client | null }) | null = await prisma.portfolio.findUnique({ where: { id: paramsValidation.portfolioId }, include: { client: true } });

    // if portfolio not found then throw error
    if (!findPortfolio) throw new ResponseError("Portfolio not found");

    // delete old files
    if (findPortfolio.mainImage) {
      try {
        await fs.access(`public/portfolio/${findPortfolio.mainImage}`);
        await fs.unlink(`public/portfolio/${findPortfolio.mainImage}`);
      } catch (error) {
        logger.error(error);
      }
    }
    if (findPortfolio.secondImage) {
      try {
        await fs.access(`public/portfolio/${findPortfolio.secondImage}`);
        await fs.unlink(`public/portfolio/${findPortfolio.secondImage}`);
      } catch (error) {
        logger.error(error);
      }
    }
    if (findPortfolio.thirdImage) {
      try {
        await fs.access(`public/portfolio/${findPortfolio.thirdImage}`);
        await fs.unlink(`public/portfolio/${findPortfolio.thirdImage}`);
      } catch (error) {
        logger.error(error);
      }
    }
    if (findPortfolio.fourthImage) {
      try {
        await fs.access(`public/portfolio/${findPortfolio.fourthImage}`);
        await fs.unlink(`public/portfolio/${findPortfolio.fourthImage}`);
      } catch (error) {
        logger.error(error);
      }
    }
    if (findPortfolio.fifthImage) {
      try {
        await fs.access(`public/portfolio/${findPortfolio.fifthImage}`);
        await fs.unlink(`public/portfolio/${findPortfolio.fifthImage}`);
      } catch (error) {
        logger.error(error);
      }
    }

    // delete portfolio
    const deletePortfolio: Portfolio & { client: Client | null } = await prisma.portfolio.delete({ where: { id: paramsValidation.portfolioId }, include: { client: true } });

    // specify return
    deletePortfolio.description = undefined!;
    if (deletePortfolio.client) {
      deletePortfolio.client.name = undefined!;
    }
    deletePortfolio.mainImage = undefined!;
    deletePortfolio.secondImage = undefined!;
    deletePortfolio.thirdImage = undefined!;
    deletePortfolio.fourthImage = undefined!;
    deletePortfolio.fifthImage = undefined!;

    // return response
    return toPortfolioResponse(deletePortfolio);
  }
}
