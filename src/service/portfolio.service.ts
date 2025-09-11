import fs from "fs";

import { prisma } from "../application/database";

import { Client, Portfolio, Prisma, User, UserPermission } from "../generated/prisma";

import { PortfolioFilters, PortfolioPaginationResponse, PortfolioParams, PortfolioRequest, PortfolioResponse, toPortfolioPaginationResponse, toPortfolioResponse, toPortfoliosResponse } from "../model/portfolio.model";

import { Validation } from "../schema/validation";
import { PortfolioSchema } from "../schema/portfolio.schema";

import { ResponseError } from "../error/response.error";

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
    const response: PortfolioParams = Validation.validate<PortfolioParams>(PortfolioSchema.GET_DETAIL, request);

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
    const response: PortfolioFilters = Validation.validate<PortfolioFilters>(PortfolioSchema.GET_ALL, filters);

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

  public static async create(user: (User & { permissions: UserPermission | null }) | undefined, request: PortfolioRequest, files: Express.Multer.File[] | undefined): Promise<PortfolioResponse> {
    // request validation
    const response: PortfolioRequest = Validation.validate<PortfolioRequest>(PortfolioSchema.CREATE, request);

    // if status is DRAFT
    if (response.status === "DRAFT") {
      // change title
      response.title = `${response.title} #${(await prisma.portfolio.count({ where: { authorId: user?.id! } })) + 1}`;

      // delete files
      if (files && Array.isArray(files)) {
        for (const file of files) {
          try {
            if (fs.existsSync(`public/portfolio/${file.path}`)) {
              fs.unlinkSync(`public/portfolio/${file.path}`);
            }
          } catch (err) {
            console.error("Failed to clean file:", err);
          }
        }
      }
    }

    // check if client exists
    let findClient: Client | null = null;

    // if client exists in request, find it
    if (response.client) {
      findClient = await prisma.client.findUnique({ where: { id: response.client } });

      // if client not found then throw error
      if (!findClient) throw new ResponseError("Client not found");
    }

    // create portfolio
    const createPortfolio: Portfolio & { client: Client | null } = await prisma.portfolio.create({
      data: {
        title: response.title,
        description: response.description ?? null,
        status: response.status,
        clientId: findClient?.id ?? null,
        authorId: user?.id!,
        mainImage: response.status === "DRAFT" ? null : files?.[0]?.path ?? null,
        secondImage: response.status === "DRAFT" ? null : files?.[1]?.path ?? null,
        thirdImage: response.status === "DRAFT" ? null : files?.[2]?.path ?? null,
        fourthImage: response.status === "DRAFT" ? null : files?.[3]?.path ?? null,
        fifthImage: response.status === "DRAFT" ? null : files?.[4]?.path ?? null,
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
}
