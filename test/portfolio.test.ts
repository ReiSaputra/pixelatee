import request from "supertest";

import { web } from "../src/application/web";

import { AdminUtil } from "./util/admin.util";
import { PortfolioResponseError, PortfolioResponseSuccess, PortfoliosResponseSuccess, PortfolioUtil } from "./util/portfolio.util";

describe("GET /api/v1/public/portfolios", () => {
  let admin1: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han", "Saputra", "fthrn.s27@gmail.com", "patangpuluhpatang", "ADMIN");
    await PortfolioUtil.createAllPortfolio(10, admin1);
  });

  afterEach(async () => {
    await PortfolioUtil.deleteAllPortfolio();
    await AdminUtil.deleteAdmin("fthrn.s27@gmail.com");
  });

  it("should pass - get all portfolio", async () => {
    const response: request.Response = await request(web).get("/api/v1/public/portfolios");

    const body: PortfoliosResponseSuccess = response.body as PortfoliosResponseSuccess;
    console.info(body);
    expect(response.status).toBe(200);

    expect(body.data.length).toBe(10);
  });

  it("should pass - get all portfolio with zero data", async () => {
    await PortfolioUtil.deleteAllPortfolio();

    const response: request.Response = await request(web).get("/api/v1/public/portfolios");

    const body: PortfoliosResponseSuccess = response.body as PortfoliosResponseSuccess;

    expect(response.status).toBe(200);

    expect(body.data.length).toBe(0);
  });
});

describe("GET /api/v1/public/portfolios/:portfolioId", () => {
  let admin1: string;
  let portfolio1: string;
  let portfolio2: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han", "Saputra", "fthrn.s27@gmail.com", "patangpuluhpatang", "ADMIN");
    portfolio1 = await PortfolioUtil.createPortfolio("Kortlink App", "Kortlink is shortener App", admin1);
    portfolio2 = await PortfolioUtil.createPortfolio("Kortlink App", "Kortlink is shortener App", admin1, true, true, true, true);
  });

  afterEach(async () => {
    await PortfolioUtil.deletePortfolio(portfolio1);
    await PortfolioUtil.deletePortfolio(portfolio2);
    await AdminUtil.deleteAdmin("fthrn.s27@gmail.com");
  });

  it("should pass - get detail portfolio", async () => {
    const response: request.Response = await request(web).get(`/api/v1/public/portfolios/${portfolio1}`);

    const body: PortfolioResponseSuccess = response.body as PortfolioResponseSuccess;

    expect(response.status).toBe(200);

    expect(body.data.secondImage).toBeUndefined();
    expect(body.data.thirdImage).toBeUndefined();
    expect(body.data.fourthImage).toBeUndefined();
    expect(body.data.fifthImage).toBeUndefined();
  });

  it("should pass - get detail portfolio with full image", async () => {
    const response: request.Response = await request(web).get(`/api/v1/public/portfolios/${portfolio2}`);

    const body: PortfolioResponseSuccess = response.body as PortfolioResponseSuccess;
    console.info(body);

    expect(response.status).toBe(200);

    expect(body.data.secondImage).toBeDefined();
    expect(body.data.thirdImage).toBeDefined();
    expect(body.data.fourthImage).toBeDefined();
    expect(body.data.fifthImage).toBeDefined();
  });

  it("should fail - portfolio id not found", async () => {
    const response: request.Response = await request(web).get(`/api/v1/public/portfolios/invalid`);

    const body: PortfolioResponseError = response.body as PortfolioResponseError;
    
    expect(response.status).toBe(400);

    expect(body.error).toBe("ResponseError");
  });
});
