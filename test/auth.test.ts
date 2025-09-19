import request from "supertest";

import { web } from "../src/application/web";

import { AdminUtil, AuthResponseError, AuthResponseSuccess } from "./util/admin.util";

describe("POST /api/v1/public/auth/login", () => {
  let admin1: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Kafka", "franzkafka@pixelatee.com", "patangpuluhpatang", "ADMIN", false);
  });

  afterEach(async () => {
    await AdminUtil.deleteAdmin(admin1);
  });

  it("should pass - logged in", async () => {
    const response: request.Response = await request(web).post("/api/v1/public/auth/login").send({ email: "franzkafka@pixelatee.com", password: "patangpuluhpatang" });

    const body: AuthResponseSuccess = response.body as AuthResponseSuccess;

    expect(response.status).toBe(200);

    expect(body.data.token).toBeDefined();
  });

  it("should fail - invalid email", async () => {
    const response: request.Response = await request(web).post("/api/v1/public/auth/login").send({ email: "invalid", password: "patangpuluhpatang" });

    const body: AuthResponseError = response.body as AuthResponseError;

    expect(response.status).toBe(400);

    expect(body.error).toBe("ZodError");
  });

  it("should fail - invalid password", async () => {
    const response: request.Response = await request(web).post("/api/v1/public/auth/login").send({ email: "franzkafka@pixelatee.com", password: "invalid" });

    const body: AuthResponseError = response.body as AuthResponseError;

    expect(response.status).toBe(400);

    expect(body.message).toBe("Username/Password is incorrect");
  });

  it("should fail - undefined properties", async () => {
    const response: request.Response = await request(web).post("/api/v1/public/auth/login").send({ email: undefined, password: undefined });

    const body: AuthResponseError = response.body as AuthResponseError;

    expect(response.status).toBe(400);

    expect(body.error).toBe("ZodError");
  });

  it("should fail - empty string properties", async () => {
    const response: request.Response = await request(web).post("/api/v1/public/auth/login").send({ email: "", password: "" });

    const body: AuthResponseError = response.body as AuthResponseError;

    expect(response.status).toBe(400);

    expect(body.error).toBe("ZodError");
  });

  it("should fail - null properties", async () => {
    const response: request.Response = await request(web).post("/api/v1/public/auth/login").send({ email: null, password: null });

    const body: AuthResponseError = response.body as AuthResponseError;

    expect(response.status).toBe(400);

    expect(body.error).toBe("ZodError");
  });
});
