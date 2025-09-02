import request from "supertest";

import { web } from "../src/application/web";

import { NewsletterResponseError, NewsletterResponseSuccess, NewsletterUtil } from "./util/newsletter.util";

describe("POST /api/v1/public/newsletters/join", () => {
  beforeEach(async () => {
    await NewsletterUtil.deleteAllMember();
  });

  afterEach(async () => {
    await NewsletterUtil.deleteAllMember();
  });

  it("should pass - join newsletter", async () => {
    const response: request.Response = await request(web).post("/api/v1/public/newsletters/join").send({ email: "fathurraihan.edu@gmail.com" });

    const body: NewsletterResponseSuccess = response.body as NewsletterResponseSuccess;

    expect(response.status).toBe(200);

    expect(body.status).toBe("Success");
  });

  it("should pass - different domain", async () => {
    const response: request.Response = await request(web).post("/api/v1/public/newsletters/join").send({ email: "fathurraihan@example.com" });

    const body: NewsletterResponseSuccess = response.body as NewsletterResponseSuccess;

    expect(response.status).toBe(200);

    expect(body.status).toBe("Success");
  });

  it("should fail - invalid email", async () => {
    const response: request.Response = await request(web).post("/api/v1/public/newsletters/join").send({ email: "fathurraihan" });

    const body: NewsletterResponseError = response.body as NewsletterResponseError;

    expect(response.status).toBe(400);

    expect(body.error).toBe("ZodError");
  });

  it("should fail - email already exist", async () => {
    await NewsletterUtil.createMember("fathurraihan.edu@gmail.com");

    const response: request.Response = await request(web).post("/api/v1/public/newsletters/join").send({ email: "fathurraihan.edu@gmail.com" });

    const body: NewsletterResponseError = response.body as NewsletterResponseError;

    expect(response.status).toBe(400);

    expect(body.error).toBe("ResponseError");
  });

  it("should fail - missing email", async () => {
    const response: request.Response = await request(web).post("/api/v1/public/newsletters/join").send({});

    const body: NewsletterResponseError = response.body as NewsletterResponseError;

    expect(response.status).toBe(400);

    expect(body.error).toBe("ZodError");
  });

  it("should fail - string empty email", async () => {
    const response: request.Response = await request(web).post("/api/v1/public/newsletters/join").send({ email: "" });

    const body: NewsletterResponseError = response.body as NewsletterResponseError;

    expect(response.status).toBe(400);

    expect(body.error).toBe("ZodError");
  });

  it("should fail - null email", async () => {
    const response: request.Response = await request(web).post("/api/v1/public/newsletters/join").send({ email: null });

    const body: NewsletterResponseError = response.body as NewsletterResponseError;

    expect(response.status).toBe(400);

    expect(body.error).toBe("ZodError");
  });
});

describe("GET /api/v1/public/newsletters/activate", () => {
  let admin1: string;

  beforeEach(async () => {
    admin1 = await NewsletterUtil.createMember("fthrn.s14@gmail.com");
  });

  afterEach(async () => {
    await NewsletterUtil.deleteMember("fthrn.s14@gmail.com");
  });

  it("should pass - activate newsletter subscription", async () => {
    const response: request.Response = await request(web).get(`/api/v1/public/newsletters/activate?memberId=${admin1}`);

    expect(response.status).toBe(302);
  });

  it("should fail - member not found", async () => {
    const response: request.Response = await request(web).get("/api/v1/public/newsletters/activate?memberId=1");

    const body: NewsletterResponseError = response.body as NewsletterResponseError;

    expect(response.status).toBe(400);

    expect(body.error).toBe("ResponseError");
  });

  it("should fail - no sending query params", async () => {
    const response: request.Response = await request(web).get("/api/v1/public/newsletters/activate");

    const body: NewsletterResponseError = response.body as NewsletterResponseError;

    expect(response.status).toBe(400);

    expect(body.error).toBe("ZodError");
  });
});

describe("GET /api/v1/public/newsletters/thank-you", () => {
  let admin1: string;

  beforeEach(async () => {
    admin1 = await NewsletterUtil.createMember("fthrn.s14@gmail.com");
  });

  afterEach(async () => {
    await NewsletterUtil.deleteMember("fthrn.s14@gmail.com");
  });

  it("should pass - get thanks data", async () => {
    const response: request.Response = await request(web).get(`/api/v1/public/newsletters/thank-you?memberId=${admin1}`);

    const body: NewsletterResponseSuccess = response.body as NewsletterResponseSuccess;

    expect(response.status).toBe(200);

    expect(body.status).toBe("Success");
  });

  it("should fail - member not found", async () => {
    const response: request.Response = await request(web).get("/api/v1/public/newsletters/thank-you?memberId=1");

    const body: NewsletterResponseError = response.body as NewsletterResponseError;

    expect(response.status).toBe(400);

    expect(body.error).toBe("ResponseError");
  });

  it("should fail - no sending query params", async () => {
    const response: request.Response = await request(web).get("/api/v1/public/newsletters/thank-you");

    const body: NewsletterResponseError = response.body as NewsletterResponseError;

    expect(response.status).toBe(400);

    expect(body.error).toBe("ZodError");
  });
});
