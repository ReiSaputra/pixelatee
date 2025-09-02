import request from "supertest";

import { web } from "../src/application/web";
import { ContactResponseError, ContactResponseSuccess, ContactUtil } from "./util/contact.util";

describe("POST /api/v1/contacts", () => {
  beforeEach(async () => {
    await ContactUtil.deleteAllContact();
  });

  afterEach(async () => {
    await ContactUtil.deleteAllContact();
  });

  it("should pass - create contact", async () => {
    const response: request.Response = await request(web).post("/api/v1/public/contacts").send({ name: "Fathurraihan Saputra", email: "fathurraihan@example.com", subject: "test", message: "test" });

    const body: ContactResponseSuccess = response.body as ContactResponseSuccess;

    expect(response.status).toBe(200);
  });

  it("should fail - null properties", async () => {
    const response: request.Response = await request(web).post("/api/v1/public/contacts").send({ name: null, email: null, subject: null, message: null });

    const body: ContactResponseError = response.body as ContactResponseError;

    expect(response.status).toBe(400);

    expect(body.error).toBe("ZodError");
  });

  it("should fail - empty string properties", async () => {
    const response: request.Response = await request(web).post("/api/v1/public/contacts").send({ name: "", email: "", subject: "", message: "" });

    const body: ContactResponseError = response.body as ContactResponseError;

    expect(response.status).toBe(400);

    expect(body.error).toBe("ZodError");
  });

  it("should fail - undefined properties", async () => {
    const response: request.Response = await request(web).post("/api/v1/public/contacts").send({ name: undefined, email: undefined, subject: undefined, message: undefined });

    const body: ContactResponseError = response.body as ContactResponseError;

    expect(response.status).toBe(400);

    expect(body.error).toBe("ZodError");
  });
});
