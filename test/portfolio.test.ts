import request from "supertest";
import fs from "fs";

import { web } from "../src/application/web";

import { PortfolioPaginationResponseSuccess, PortfolioResponseError, PortfolioResponseSuccess, PortfoliosResponseSuccess, PortfolioUtil } from "./util/portfolio.util";
import { AdminUtil } from "./util/admin.util";
import { ClientUtil } from "./util/client.util";

describe("GET /api/v1/public/portfolios", () => {
  let admin1: string;
  let client1: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han", "Saputra", "fthrn.s27@gmail.com", "patangpuluhpatang", "ADMIN", false);
    client1 = await ClientUtil.createClient("Nomod");
    await PortfolioUtil.createAllPortfolio(10, admin1, client1);
  });

  afterEach(async () => {
    await PortfolioUtil.deleteAllPortfolio();
    await AdminUtil.deleteAdmin(admin1);
    await ClientUtil.deleteAllClient();
  });

  it("should pass - get all portfolio", async () => {
    const response: request.Response = await request(web).get("/api/v1/public/portfolios");

    const body: PortfoliosResponseSuccess = response.body as PortfoliosResponseSuccess;

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
  let client1: string;
  let portfolio1: string;
  let portfolio2: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han", "Saputra", "fthrn.s27@gmail.com", "patangpuluhpatang", "ADMIN", false);
    client1 = await ClientUtil.createClient("Nomod");
    portfolio1 = await PortfolioUtil.createPortfolio("Kortlink App", "Kortlink is shortener App", "PUBLISHED", admin1, client1);
    portfolio2 = await PortfolioUtil.createPortfolio("Kortlink App", "Kortlink is shortener App", "PUBLISHED", admin1, client1, true, true, true, true);
  });

  afterEach(async () => {
    await PortfolioUtil.deletePortfolio(portfolio1);
    await PortfolioUtil.deletePortfolio(portfolio2);
    await AdminUtil.deleteAdmin(admin1);
    await ClientUtil.deleteAllClient();
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

describe("GET /api/v1/admin/portfolios", () => {
  let admin1: string;
  let admin2: string;
  let client1: string;
  let client2: string;
  let token: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han", "Saputra", "fthrn.s27@pixelatee.com", "patangpuluhpatang", "ADMIN", false);
    admin2 = await AdminUtil.createAdmin("Aya", "Saputra", "aya28@pixelatee.com", "patangpuluhpatang", "ADMIN", false);
    await AdminUtil.updateAdminPermission(admin1, true, true, true, true);
    client1 = await ClientUtil.createClient("Air Nomad");
    client2 = await ClientUtil.createClient("Kakatua");
    await PortfolioUtil.createAllPortfolio(30, admin1, client1);
    await PortfolioUtil.createAllPortfolio(30, admin2, client2);
    await PortfolioUtil.createPortfolio("Kortlink App", "Kortlink is shortener App", "PUBLISHED", admin1, client2, true, true, true, true);

    token = await AdminUtil.login("fthrn.s27@pixelatee.com", "patangpuluhpatang");
  });

  afterEach(async () => {
    await PortfolioUtil.deleteAllPortfolio();
    await AdminUtil.deleteAdmin(admin1);
    await AdminUtil.deleteAdmin(admin2);
    await ClientUtil.deleteAllClient();
  });

  it("should pass - authorized page 1", async () => {
    const response: request.Response = await request(web).get("/api/v1/admin/portfolios").set("Authorization", `Bearer ${token}`);

    const body: PortfolioPaginationResponseSuccess = response.body as PortfolioPaginationResponseSuccess;

    expect(response.status).toBe(200);
  });

  it("should pass - authorized page 2", async () => {
    const response: request.Response = await request(web).get("/api/v1/admin/portfolios?page=2").set("Authorization", `Bearer ${token}`);

    const body: PortfolioPaginationResponseSuccess = response.body as PortfolioPaginationResponseSuccess;

    expect(response.status).toBe(200);
  });

  it("should pass - authorized page 3", async () => {
    const response: request.Response = await request(web).get("/api/v1/admin/portfolios?page=3").set("Authorization", `Bearer ${token}`);

    const body: PortfolioPaginationResponseSuccess = response.body as PortfolioPaginationResponseSuccess;

    expect(response.status).toBe(200);
    expect(body.data.portfolios.length).toBe(1);
  });

  it("should pass - search title", async () => {
    const response: request.Response = await request(web).get("/api/v1/admin/portfolios?title=Kortlink").set("Authorization", `Bearer ${token}`);

    const body: PortfolioPaginationResponseSuccess = response.body as PortfolioPaginationResponseSuccess;

    expect(response.status).toBe(200);

    expect(body.data.portfolios.length).toBe(1);
  });

  it("should pass - search client", async () => {
    const response: request.Response = await request(web).get("/api/v1/admin/portfolios?client=Kakatua").set("Authorization", `Bearer ${token}`);

    const body: PortfolioPaginationResponseSuccess = response.body as PortfolioPaginationResponseSuccess;

    expect(response.status).toBe(200);

    expect(body.data.portfolios.length).toBe(1);
  });

  it("should fail - no authorization", async () => {
    const response: request.Response = await request(web).get("/api/v1/admin/portfolios");

    const body: PortfolioResponseError = response.body as PortfolioResponseError;

    expect(response.status).toBe(401);

    expect(body.error).toBe("ResponseError");
  });

  it("should fail - authorization wrong", async () => {
    const response: request.Response = await request(web).get("/api/v1/admin/portfolios").set("Authorization", `Bearer invalid`);

    const body: PortfolioResponseError = response.body as PortfolioResponseError;

    expect(response.status).toBe(401);

    expect(body.error).toBe("JsonWebTokenError");
  });
});

describe.only("POST /api/v1/admin/portfolios", () => {
  let admin1: string;
  let client1: string;
  let token: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han", "Saputra", "fthrn.s27@pixelatee.com", "patangpuluhpatang", "ADMIN", false);
    await AdminUtil.updateAdminPermission(admin1, true, true, true, true);
    client1 = await ClientUtil.createClient("Example Client");
    token = await AdminUtil.login("fthrn.s27@pixelatee.com", "patangpuluhpatang");
  });

  afterEach(async () => {
    await PortfolioUtil.deleteAllPortfolio();
    await AdminUtil.deleteAdmin(admin1);
    await ClientUtil.deleteAllClient();

    if (fs.existsSync("public/portfolio")) fs.rmSync("public/portfolio", { recursive: true, force: true });
  });

  it("should pass - create portfolio", async () => {
    const response: request.Response = await request(web)
      .post("/api/v1/admin/portfolios")
      .set("Authorization", `Bearer ${token}`)
      .field("title", "Kortlink App")
      .field("description", "Kortlink is shortener App")
      .field("status", "PUBLISHED")
      .field("client", client1)
      .attach("photos", "public/test/Kortlink.png")
      .attach("photos", "public/test/Kortlink.png")
      .attach("photos", "public/test/Kortlink.png")
      .attach("photos", "public/test/Kortlink.png")
      .attach("photos", "public/test/Kortlink.png");

    expect(response.status).toBe(200);
  });

  it("should pass - create portfolio with 1 image", async () => {
    const response: request.Response = await request(web)
      .post("/api/v1/admin/portfolios")
      .set("Authorization", `Bearer ${token}`)
      .field("title", "Kortlink App")
      .field("description", "Kortlink is shortener App")
      .field("status", "PUBLISHED")
      .field("client", client1)
      .attach("photos", "public/test/Kortlink.png");

    expect(response.status).toBe(200);
  });

  it("should pass - create portfolio with 2 image", async () => {
    const response: request.Response = await request(web)
      .post("/api/v1/admin/portfolios")
      .set("Authorization", `Bearer ${token}`)
      .field("title", "Kortlink App")
      .field("description", "Kortlink is shortener App")
      .field("status", "PUBLISHED")
      .field("client", client1)
      .attach("photos", "public/test/Kortlink.png")
      .attach("photos", "public/test/Kortlink.png");

    expect(response.status).toBe(200);
  });

  it("should pass - create portfolio with 3 image", async () => {
    const response: request.Response = await request(web)
      .post("/api/v1/admin/portfolios")
      .set("Authorization", `Bearer ${token}`)
      .field("title", "Kortlink App")
      .field("description", "Kortlink is shortener App")
      .field("status", "PUBLISHED")
      .field("client", client1)
      .attach("photos", "public/test/Kortlink.png")
      .attach("photos", "public/test/Kortlink.png")
      .attach("photos", "public/test/Kortlink.png");

    expect(response.status).toBe(200);
  });

  it("should pass - create portfolio with 4 image", async () => {
    const response: request.Response = await request(web)
      .post("/api/v1/admin/portfolios")
      .set("Authorization", `Bearer ${token}`)
      .field("title", "Kortlink App")
      .field("description", "Kortlink is shortener App")
      .field("status", "PUBLISHED")
      .field("client", client1)
      .attach("photos", "public/test/Kortlink.png")
      .attach("photos", "public/test/Kortlink.png")
      .attach("photos", "public/test/Kortlink.png")
      .attach("photos", "public/test/Kortlink.png");

    expect(response.status).toBe(200);
  });

  it("should pass - all null properties except title, description, client defined and status DRAFT and 2 image", async () => {
    const response: request.Response = await request(web)
      .post("/api/v1/admin/portfolios")
      .set("Authorization", `Bearer ${token}`)
      .field("title", "Akaza")
      .field("description", "fullstack")
      .field("status", "DRAFT")
      .field("client", client1)
      .attach("photos", "public/test/Kortlink.png")
      .attach("photos", "public/test/Kortlink.png");

    expect(response.status).toBe(200);
  });

  it.only("should fail - second Photos is not image (.pdf)", async () => {
    const response: request.Response = await request(web)
      .post("/api/v1/admin/portfolios")
      .set("Authorization", `Bearer ${token}`)
      .set("Authorization", `Bearer ${token}`)
      .field("title", "Akaza")
      .field("description", "fullstack")
      .field("status", "PUBLISHED")
      .field("client", client1)
      .attach("photos", "public/test/Kortlink.png")
      .attach("photos", "public/test/LAPORAN PRAKTIKUM - DASAR PEMROGRAMAN DART - 2205076 M FATHURRAIHAN S.pdf");
  });

  it("should fail - no authorization", async () => {
    const response: request.Response = await request(web).post("/api/v1/admin/portfolios");

    expect(response.status).toBe(401);
  });

  it("should fail - permission denied", async () => {
    await AdminUtil.updateAdminPermission(admin1, false, false, false, false);
    const response: request.Response = await request(web).post("/api/v1/admin/portfolios").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });
});
