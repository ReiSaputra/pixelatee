import request from "supertest";
import fs from "fs";

import { web } from "../src/application/web";

import { AdminUtil } from "./util/admin.util";
import { PortfolioUtil } from "./util/portfolio.util";
import { ClientUtil } from "./util/client.util";
import { ContactUtil } from "./util/contact.util";
import { GuestUtil } from "./util/guest.util";
import { prisma } from "../src/application/database";

describe.only("GET /api/v1/users/dashboard", () => {
  let admin1: string;
  let token: string;
  let client1: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han", "fthrn.s27@pixelatee.com", "patangpuluhpatang", "ADMIN", true);
    token = await AdminUtil.login("fthrn.s27@pixelatee.com", "patangpuluhpatang");
    client1 = await ClientUtil.createClient("Air Nomad");
    await PortfolioUtil.createAllPortfolio(10, admin1, client1);
    await ContactUtil.createAllContact(20, admin1);
    await GuestUtil.createAllVisitor(20);
  });

  afterEach(async () => {
    await GuestUtil.deleteAllVisitor();
    await PortfolioUtil.deleteAllPortfolio();
    await ContactUtil.deleteAllContact();
    await AdminUtil.deleteAdmin(admin1);
  });

  it("should pass - get dashboard", async () => {
    const response = await request(web).get("/api/v1/users/dashboard").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("should fail - no authorization", async () => {
    const response = await request(web).get("/api/v1/users/dashboard");

    expect(response.status).toBe(401);
  });
});

describe("GET /api/v1/users/profiles", () => {
  let admin1: string;
  let token: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han", "fthrn.s27@pixelatee.com", "patangpuluhpatang", "ADMIN", true);
    token = await AdminUtil.login("fthrn.s27@pixelatee.com", "patangpuluhpatang");
  });

  afterEach(async () => {
    await AdminUtil.deleteAdmin(admin1);
  });

  it("should pass - get profile", async () => {
    const response: request.Response = await request(web).get("/api/v1/users/profiles").set("Authorization", `Bearer ${token}`);
    console.info(response.body.data);
    expect(response.status).toBe(200);
  });

  it("should fail - no authorization", async () => {
    const response: request.Response = await request(web).get("/api/v1/users/profiles");

    expect(response.status).toBe(401);
  });
});

describe("POST /api/v1/users/logout", () => {
  let admin1: string;
  let token: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han", "fthrn.s27@pixelatee.com", "patangpuluhpatang", "ADMIN", true);
    token = await AdminUtil.login("fthrn.s27@pixelatee.com", "patangpuluhpatang");
  });

  afterEach(async () => {
    await AdminUtil.deleteAdmin(admin1);
  });

  it("should pass - logout", async () => {
    const response: request.Response = await request(web).post("/api/v1/users/logout").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("should fail - no authorization", async () => {
    const response: request.Response = await request(web).post("/api/v1/users/logout");

    expect(response.status).toBe(401);
  });
});

describe("GET /api/v1/users/profiles/photo/preview", () => {
  let admin1: string;
  let token: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han", "fthrn.s27@pixelatee.com", "patangpuluhpatang", "ADMIN", true);
    token = await AdminUtil.login("fthrn.s27@pixelatee.com", "patangpuluhpatang");
  });

  afterEach(async () => {
    await AdminUtil.deleteAdmin(admin1);
  });

  it("should pass - get profile photo", async () => {
    const response: request.Response = await request(web).get("/api/v1/users/profiles/photo/preview").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("should fail - no authorization", async () => {
    const response: request.Response = await request(web).get("/api/v1/users/profiles/photo/preview");

    expect(response.status).toBe(401);
  });
});

describe("PATCH /api/v1/users/profiles/photo", () => {
  let admin1: string;
  let token: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han", "fthrn.s27@pixelatee.com", "patangpuluhpatang", "ADMIN", true);
    token = await AdminUtil.login("fthrn.s27@pixelatee.com", "patangpuluhpatang");
  });

  afterEach(async () => {
    await AdminUtil.deleteAdmin(admin1);

    if (fs.existsSync("public/user")) fs.rmSync("public/user", { recursive: true, force: true });
  });

  it("should pass - update profile photo", async () => {
    const response: request.Response = await request(web).patch("/api/v1/users/profiles/photo").set("Authorization", `Bearer ${token}`).attach("photo", "public/test/Kortlink.png");

    expect(response.status).toBe(200);
  });

  it("should fail - no sending anything", async () => {
    const response: request.Response = await request(web).patch("/api/v1/users/profiles/photo").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it("should fail - no authorization", async () => {
    const response: request.Response = await request(web).patch("/api/v1/users/profiles/photo");

    expect(response.status).toBe(401);
  });
});

describe("GET /api/v1/users/profiles/personal-info/preview", () => {
  let admin1: string;
  let token: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han", "fthrn.s27@pixelatee.com", "patangpuluhpatang", "ADMIN", true);
    token = await AdminUtil.login("fthrn.s27@pixelatee.com", "patangpuluhpatang");
  });

  afterEach(async () => {
    await AdminUtil.deleteAdmin(admin1);
  });

  it("should pass - get personal info", async () => {
    const response: request.Response = await request(web).get("/api/v1/users/profiles/personal-info/preview").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("should fail - no authorization", async () => {
    const response: request.Response = await request(web).get("/api/v1/users/profiles/personal-info/preview");

    expect(response.status).toBe(401);
  });
});

describe("PATCH /api/v1/users/profiles/personal-info", () => {
  let admin1: string;
  let token: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han", "fthrn.s27@pixelatee.com", "patangpuluhpatang", "ADMIN", true);
    token = await AdminUtil.login("fthrn.s27@pixelatee.com", "patangpuluhpatang");
  });

  afterEach(async () => {
    await AdminUtil.deleteAdmin(admin1);
  });

  it("should pass - update personal info", async () => {
    const response: request.Response = await request(web).patch("/api/v1/users/profiles/personal-info").set("Authorization", `Bearer ${token}`).send({
      name: "Han Solo",
      email: "fthrn27@gmail.com",
      phoneNumber: "08123456789",
      dateOfBirth: new Date(),
    });

    expect(response.status).toBe(200);
  });
});

describe("PATCH /api/v1/users/profiles/password", () => {
  let admin1: string;
  let token: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han", "fthrn.s27@pixelatee.com", "patangpuluhpatang", "ADMIN", true);
    token = await AdminUtil.login("fthrn.s27@pixelatee.com", "patangpuluhpatang");
  });

  afterEach(async () => {
    await AdminUtil.deleteAdmin(admin1);
  });

  it("should pass - update password", async () => {
    const response: request.Response = await request(web).patch("/api/v1/users/profiles/password").set("Authorization", `Bearer ${token}`).send({ password: "asam lambung jir" });

    expect(response.status).toBe(200);
  });

  it("should fail - no authorization", async () => {
    const response: request.Response = await request(web).patch("/api/v1/users/profiles/password").send({ password: "asam lambung jir" });

    expect(response.status).toBe(401);
  });
});

describe("GET /api/v1/users/profiles/addresses/preview", () => {
  let admin1: string;
  let token: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han", "fthrn.s27@pixelatee.com", "patangpuluhpatang", "ADMIN", true);
    token = await AdminUtil.login("fthrn.s27@pixelatee.com", "patangpuluhpatang");
  });

  afterEach(async () => {
    await AdminUtil.deleteAdmin(admin1);
  });

  it("should pass - get addresses", async () => {
    const response: request.Response = await request(web).get("/api/v1/users/profiles/addresses/preview").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("should pass - get addresses when there is no address (null)", async () => {
    await AdminUtil.updateAdminAddress(admin1, null, null, null);

    const response: request.Response = await request(web).get("/api/v1/users/profiles/addresses/preview").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("should fail - no authorization", async () => {
    const response: request.Response = await request(web).get("/api/v1/users/profiles/addresses/preview");

    expect(response.status).toBe(401);
  });
});

describe("PATCH /api/v1/users/profiles/addresses", () => {
  let admin1: string;
  let token: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han", "fthrn.s27@pixelatee.com", "patangpuluhpatang", "ADMIN", true);
    token = await AdminUtil.login("fthrn.s27@pixelatee.com", "patangpuluhpatang");
  });

  afterEach(async () => {
    await AdminUtil.deleteAdmin(admin1);
  });

  it("should pass - update address", async () => {
    const response: request.Response = await request(web).patch("/api/v1/users/profiles/addresses").set("Authorization", `Bearer ${token}`).send({
      city: "Jakarta",
      country: "Indonesia",
      zipCode: "12345",
    });

    expect(response.status).toBe(200);
  });

  it("should pass - all null", async () => {
    const response: request.Response = await request(web).patch("/api/v1/users/profiles/addresses").set("Authorization", `Bearer ${token}`).send({
      city: null,
      country: null,
      zipCode: null,
    });

    expect(response.status).toBe(200);
  });

  it("should fail - all undefined", async () => {
    const response: request.Response = await request(web).patch("/api/v1/users/profiles/addresses").set("Authorization", `Bearer ${token}`).send({
      city: undefined,
      country: undefined,
      zipCode: undefined,
    });

    expect(response.status).toBe(400);
  });

  it("should fail - no authorization", async () => {
    const response: request.Response = await request(web).patch("/api/v1/users/profiles/addresses").send({
      city: "Jakarta",
      country: "Indonesia",
      zipCode: "12345",
    });

    expect(response.status).toBe(401);
  });
});

afterAll(async () => {
  await GuestUtil.deleteAllVisitor();
});
