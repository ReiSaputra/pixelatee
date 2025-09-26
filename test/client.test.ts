import request from "supertest";
import fs from "fs";

import { web } from "../src/application/web";

import { ClientResponseSuccess, ClientUtil } from "./util/client.util";
import { AdminUtil } from "./util/admin.util";

describe("GET /api/v1/admin/clients", () => {
  let admin1: string;
  let token: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han", "fthrn.s27@pixelatee.com", "patangpuluhpatang", "ADMIN", false);
    await AdminUtil.updateAdminPermission(admin1, true, true, true, true);
    token = await AdminUtil.login("fthrn.s27@pixelatee.com", "patangpuluhpatang");
    await ClientUtil.createAllClient(15);
  });

  afterEach(async () => {
    await AdminUtil.deleteAdmin(admin1);
    await ClientUtil.deleteAllClient();
  });

  it("should pass - get all client", async () => {
    const response: request.Response = await request(web).get("/api/v1/admin/clients").set("Authorization", `Bearer ${token}`);

    const body: ClientResponseSuccess = response.body as ClientResponseSuccess;

    expect(response.status).toBe(200);

    expect(body.data).toHaveLength(15);
  });

  it("should pass - get all client with zero data", async () => {
    await ClientUtil.deleteAllClient();

    const response: request.Response = await request(web).get("/api/v1/admin/clients").set("Authorization", `Bearer ${token}`);

    const body: ClientResponseSuccess = response.body as ClientResponseSuccess;

    expect(response.status).toBe(200);

    expect(body.data).toHaveLength(0);
  });

  it("should fail - no authorization", async () => {
    const response: request.Response = await request(web).get("/api/v1/admin/clients");

    expect(response.status).toBe(401);
  });

  it("should fail - no permission", async () => {
    await AdminUtil.updateAdminPermission(admin1, false, false, false, false);

    const response: request.Response = await request(web).get("/api/v1/admin/clients").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });
});

describe("POST /api/v1/admin/clients", () => {
  let admin1: string;
  let token: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han", "fthrn.s27@pixelatee.com", "patangpuluhpatang", "ADMIN", false);
    await AdminUtil.updateAdminPermission(admin1, true, true, true, true);
    token = await AdminUtil.login("fthrn.s27@pixelatee.com", "patangpuluhpatang");
  });

  afterEach(async () => {
    await AdminUtil.deleteAdmin(admin1);
    await ClientUtil.deleteAllClient();

    if (fs.existsSync("public/client")) fs.rmSync("public/client", { recursive: true, force: true });
  });

  it("should pass - create client", async () => {
    const response: request.Response = await request(web).post("/api/v1/admin/clients").set("Authorization", `Bearer ${token}`).field("name", "Client A").attach("logo", "public/test/Kortlink.png");

    expect(response.status).toBe(201);
  });

  it("should fail - no logo", async () => {
    const response: request.Response = await request(web).post("/api/v1/admin/clients").set("Authorization", `Bearer ${token}`).field("name", "Client A");

    expect(response.status).toBe(400);
  });

  it("should fail - no permission", async () => {
    await AdminUtil.updateAdminPermission(admin1, false, false, false, false);

    const response: request.Response = await request(web).post("/api/v1/admin/clients").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });

  it("should fail - no authorization", async () => {
    const response: request.Response = await request(web).post("/api/v1/admin/clients");

    expect(response.status).toBe(401);
  });
});

describe("PATCH /api/v1/admin/clients/:clientId", () => {
  let admin1: string;
  let client1: string;
  let token: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han", "fthrn.s27@pixelatee.com", "patangpuluhpatang", "ADMIN", true);
    token = await AdminUtil.login("fthrn.s27@pixelatee.com", "patangpuluhpatang");
    await request(web).post("/api/v1/admin/clients").set("Authorization", `Bearer ${token}`).field("name", "Client A").attach("logo", "public/test/Kortlink.png");
    client1 = await ClientUtil.findClient("Client A");
  });

  afterEach(async () => {
    await AdminUtil.deleteAdmin(admin1);
    await ClientUtil.deleteAllClient();

    if (fs.existsSync("public/client")) fs.rmSync("public/client", { recursive: true, force: true });
  });

  it("should pass - update client", async () => {
    const response: request.Response = await request(web)
      .patch(`/api/v1/admin/clients/${client1}`)
      .set("Authorization", `Bearer ${token}`)
      .field("name", "Client B")
      .attach("logo", "public/test/e56802e93b4c67a0615fadb99384e745_bb854484f9a9264d6b18f05f774d6abc_compressed.jpg");

    expect(response.status).toBe(200);
  });

  it("should pass - update with no logo", async () => {
    const response: request.Response = await request(web).patch(`/api/v1/admin/clients/${client1}`).set("Authorization", `Bearer ${token}`).field("name", "Client B");

    expect(response.status).toBe(200);
  });

  it("should fail - no permission", async () => {
    await AdminUtil.updateAdminPermission(admin1, false, false, false, false);

    const response: request.Response = await request(web).patch(`/api/v1/admin/clients/${client1}`).set("Authorization", `Bearer ${token}`).field("name", "Client B");

    expect(response.status).toBe(403);
  });

  it("should fail - no authorization", async () => {
    const response: request.Response = await request(web).patch(`/api/v1/admin/clients/${client1}`).field("name", "Client B");

    expect(response.status).toBe(401);
  });
});

describe("DELETE /api/v1/admin/clients/:clientId", () => {
  let admin1: string;
  let client1: string;
  let token: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Senku", "senku@pixelatee.com", "dontbestranger", "ADMIN", true);
    await AdminUtil.updateAdminPermission(admin1, true, true, true, true);
    token = await AdminUtil.login("senku@pixelatee.com", "dontbestranger");
    await request(web).post("/api/v1/admin/clients").set("Authorization", `Bearer ${token}`).field("name", "Client A").attach("logo", "public/test/Kortlink.png");
    client1 = await ClientUtil.findClient("Client A");
  });

  afterEach(async () => {
    await AdminUtil.deleteAdmin(admin1);
    await ClientUtil.deleteAllClient();

    if (fs.existsSync("public/client")) fs.rmSync("public/client", { recursive: true, force: true });
  });

  it("should pass - delete client", async () => {
    const response: request.Response = await request(web).delete(`/api/v1/admin/clients/${client1}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("should fail - invalid id client", async () => {
    const response: request.Response = await request(web).delete(`/api/v1/admin/clients/invalid`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it("should fail - no authorization", async () => {
    const response: request.Response = await request(web).delete(`/api/v1/admin/clients/${client1}`);

    expect(response.status).toBe(401);
  });

  it("should fail - no permission", async () => {
    await AdminUtil.updateAdminPermission(admin1, false, false, false, false);

    const response: request.Response = await request(web).delete(`/api/v1/admin/clients/${client1}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });
});

describe("GET /api/v1/admin/clients/form", () => {
  let admin1: string;
  let token: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Senku", "senku@pixelatee.com", "dontbestranger", "ADMIN", true);
    await ClientUtil.createAllClient(5);
    token = await AdminUtil.login("senku@pixelatee.com", "dontbestranger");
  });

  afterEach(async () => {
    await AdminUtil.deleteAdmin(admin1);
  });

  it("should pass - get form client", async () => {
    const response: request.Response = await request(web).get("/api/v1/admin/clients/form").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("should fail - no authorization", async () => {
    const response: request.Response = await request(web).get("/api/v1/admin/clients/form");

    expect(response.status).toBe(401);
  });

  it("should fail - no permission", async () => {
    await AdminUtil.updateAdminPermission(admin1, false, false, false, false);

    const response: request.Response = await request(web).get("/api/v1/admin/clients/form").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });
});