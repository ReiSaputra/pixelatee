import request from "supertest";

import { web } from "../src/application/web";

import { AdminUtil } from "./util/admin.util";
import { prisma } from "../src/application/database";

describe("POST /api/v1/super-admin/admins/register", () => {
  let admin1: string;
  let token: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han Saputra", "fthrn.s27@pixelatee.com", "patangpuluhpatang", "SUPER_ADMIN", true);
    token = await AdminUtil.login("fthrn.s27@pixelatee.com", "patangpuluhpatang");
  });

  afterEach(async () => {
    await AdminUtil.deleteAllAdmin();
  });

  it("should pass - register admin", async () => {
    const response: request.Response = await request(web)
      .post("/api/v1/super-admin/admins/register")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Joko Saputra",
        email: "fthrn.s28@pixelatee.com",
        dateOfBirth: new Date(),
        phoneNumber: "08123456789",
        userRole: "ADMIN",
        address: {
          city: "Jakarta",
          country: "Indonesia",
          zipCode: "12345",
        },
      });

    expect(response.status).toBe(201);
  });

  it("should pass - register admin with address null", async () => {
    const response: request.Response = await request(web)
      .post("/api/v1/super-admin/admins/register")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Joko Saputra",
        email: "fthrn.s28@pixelatee.com",
        dateOfBirth: new Date(),
        phoneNumber: "08123456789",
        userRole: "ADMIN",
        address: {
          city: null,
          country: null,
          zipCode: null,
        },
      });

    expect(response.status).toBe(201);
  });

  it("should fail - register admin with address undefined", async () => {
    const response: request.Response = await request(web).post("/api/v1/super-admin/admins/register").set("Authorization", `Bearer ${token}`).send({
      name: "Joko Saputra",
      email: "fthrn.s28@pixelatee.com",
      dateOfBirth: new Date(),
      phoneNumber: "08123456789",
      userRole: "ADMIN",
      address: undefined,
    });

    expect(response.status).toBe(400);
  });

  it("should fail - email already exist", async () => {
    const response: request.Response = await request(web)
      .post("/api/v1/super-admin/admins/register")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Joko Saputra",
        email: "fthrn.s27@pixelatee.com",
        dateOfBirth: new Date(),
        phoneNumber: "08123456789",
        userRole: "ADMIN",
        address: {
          city: "Jakarta",
          country: "Indonesia",
          zipCode: "12345",
        },
      });

    expect(response.status).toBe(400);
  });

  it("should fail - no authorization", async () => {
    const response: request.Response = await request(web)
      .post("/api/v1/super-admin/admins/register")
      .send({
        name: "Joko Saputra",
        email: "fthrn.s28@pixelatee.com",
        dateOfBirth: new Date(),
        phoneNumber: "08123456789",
        userRole: "ADMIN",
        address: {
          city: "Jakarta",
          country: "Indonesia",
          zipCode: "12345",
        },
      });

    expect(response.status).toBe(401);
  });
});

describe("GET /api/v1/super-admin/admins", () => {
  let admin1: string;
  let token: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han Saputra", "fthrn.s27@pixelatee.com", "patangpuluhpatang", "SUPER_ADMIN", true);
    token = await AdminUtil.login("fthrn.s27@pixelatee.com", "patangpuluhpatang");
    await AdminUtil.createAllAdmin(20);
  });

  afterEach(async () => {
    await AdminUtil.deleteAllAdmin();
  });

  it("should pass - get all admin", async () => {
    const response: request.Response = await request(web).get("/api/v1/super-admin/admins").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("should fail - no permission", async () => {
    await AdminUtil.updateAdminPermission(admin1, false, false, false, false);

    const response: request.Response = await request(web).get("/api/v1/super-admin/admins").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });

  it("should fail - no authorization", async () => {
    const response: request.Response = await request(web).get("/api/v1/super-admin/admins");

    expect(response.status).toBe(401);
  });
});

describe("DELETE /api/v1/super-admin/admins/:adminId", () => {
  let admin1: string;
  let admin2: string;
  let token: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han Saputra", "fthrn.s27@pixelatee.com", "patangpuluhpatang", "SUPER_ADMIN", true);
    admin2 = await AdminUtil.createAdmin("Aya Saputra", "aya28@pixelatee.com", "patangpuluhpatang", "ADMIN", true);
    token = await AdminUtil.login("fthrn.s27@pixelatee.com", "patangpuluhpatang");
  });

  afterEach(async () => {
    await AdminUtil.deleteAllAdmin();
  });

  it("should pass - delete admin", async () => {
    const response: request.Response = await request(web).delete(`/api/v1/super-admin/admins/${admin2}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("should fail - admin not found", async () => {
    const response: request.Response = await request(web).delete(`/api/v1/super-admin/admins/invalid`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it("should fail - no permission", async () => {
    await AdminUtil.updateAdminPermission(admin1, false, false, false, false);

    const response: request.Response = await request(web).delete(`/api/v1/super-admin/admins/${admin2}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });
});
