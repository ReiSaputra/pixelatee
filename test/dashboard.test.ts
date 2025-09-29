import request from "supertest";

import { web } from "../src/application/web";

describe("GET /api/v1/admin/dashboard", () => {
  beforeEach(async () => {});

  afterEach(async () => {});

  it("should pass - get dashboard", async () => {
    const response: request.Response = await request(web).get("/api/v1/admin/dashboard");
  });
});
