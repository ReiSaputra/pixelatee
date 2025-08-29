import request from "supertest";

import { web } from "../src/application/web";

import { NewsletterResponseError, NewsletterResponseSuccess, NewsletterUtil } from "./utils/newsletter.util";

describe("POST /api/v1/newsletters/join", () => {
  beforeEach(async () => {
    await NewsletterUtil.deleteAllMember();
  });

  afterEach(async () => {
    await NewsletterUtil.deleteAllMember();
  });

  it("should pass - join newsletter", async () => {
    const response: request.Response = await request(web).post("/api/v1/newsletters/join").send({ email: "fathurraihan.edu@gmail.com" });

    const body: NewsletterResponseSuccess = response.body as NewsletterResponseSuccess;

    expect(response.status).toBe(200);

    expect(body.status).toBe("Success");
  });

  it("should pass - different domain", async () => {
    const response: request.Response = await request(web).post("/api/v1/newsletters/join").send({ email: "fathurraihan@example.com" });

    const body: NewsletterResponseSuccess = response.body as NewsletterResponseSuccess;

    expect(response.status).toBe(200);

    expect(body.status).toBe("Success");
  });

  it("should fail - invalid email", async () => {
    const response: request.Response = await request(web).post("/api/v1/newsletters/join").send({ email: "fathurraihan" });

    const body: NewsletterResponseError = response.body as NewsletterResponseError;

    expect(response.status).toBe(400);

    expect(body.error).toBe("ZodError");
  });

  it("should fail - email already exist", async () => {
    await NewsletterUtil.createMember("fathurraihan.edu@gmail.com");

    const response: request.Response = await request(web).post("/api/v1/newsletters/join").send({ email: "fathurraihan.edu@gmail.com" });

    const body: NewsletterResponseError = response.body as NewsletterResponseError;

    expect(response.status).toBe(400);

    expect(body.error).toBe("ResponseError");
  });

  it("should fail - missing email", async () => {
    const response: request.Response = await request(web).post("/api/v1/newsletters/join").send({});

    const body: NewsletterResponseError = response.body as NewsletterResponseError;

    expect(response.status).toBe(400);

    expect(body.error).toBe("ZodError");
  });

  it("should fail - string empty email", async () => {
    const response: request.Response = await request(web).post("/api/v1/newsletters/join").send({ email: "" });

    const body: NewsletterResponseError = response.body as NewsletterResponseError;

    expect(response.status).toBe(400);

    expect(body.error).toBe("ZodError");
  });

  it("should fail - null email", async () => {
    const response: request.Response = await request(web).post("/api/v1/newsletters/join").send({ email: null });

    const body: NewsletterResponseError = response.body as NewsletterResponseError;

    expect(response.status).toBe(400);

    expect(body.error).toBe("ZodError");
  })
});
