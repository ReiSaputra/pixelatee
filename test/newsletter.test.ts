import request from "supertest";
import fs from "fs";

import { web } from "../src/application/web";

import { NewsletterResponseError, NewsletterResponseSuccess, NewsletterUtil } from "./util/newsletter.util";
import { AdminUtil } from "./util/admin.util";
import { GuestUtil } from "./util/guest.util";

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

describe("GET /api/v1/public/newsletters/unsubscribe", () => {
  let admin1: string;

  beforeEach(async () => {
    admin1 = await NewsletterUtil.createMember("fthrn.s14@gmail.com");
  });

  afterEach(async () => {
    await NewsletterUtil.deleteAllMember();
  });

  it("should pass - unsubscribe newsletter subscription", async () => {
    const response: request.Response = await request(web).delete(`/api/v1/public/newsletters/unsubscribe?memberId=${admin1}`);
    
    expect(response.status).toBe(200);
  });
});

describe("POST /api/v1/admin/newsletters", () => {
  let admin1: string;
  let token: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han", "fthrn.s27@pixelatee.com", "patangpuluhpatang", "ADMIN", true);
    await AdminUtil.updateAdminPermission(admin1, true, true, true, true);
    await NewsletterUtil.createMember("fthrn.s14@gmail.com");
    await NewsletterUtil.createMember("fathurraihan.edu@gmail.com");
    token = await AdminUtil.login("fthrn.s27@pixelatee.com", "patangpuluhpatang");
  });

  afterEach(async () => {
    await AdminUtil.deleteAdmin(admin1);
    await NewsletterUtil.deleteAllMember();
    await NewsletterUtil.deleteAllNewsletter();

    if (fs.existsSync("public/newsletter")) fs.rmSync("public/newsletter", { recursive: true, force: true });
  });

  it("should pass - create newsletter PUBLISHED", async () => {
    const response: request.Response = await request(web)
      .post("/api/v1/admin/newsletters")
      .set("Authorization", `Bearer ${token}`)
      .field("title", "Test")
      .field("content", "test")
      .field("type", "TECH")
      .field("isScheduled", false)
      .field("status", "PUBLISHED")
      .attach("photo", "public/test/Kortlink.png");

    expect(response.status).toBe(200);
  }, 100000);

  it("should pass - create newsletter SCHEDULED", async () => {
    const response: request.Response = await request(web)
      .post("/api/v1/admin/newsletters")
      .set("Authorization", `Bearer ${token}`)
      .field("title", "Test")
      .field("content", "test")
      .field("type", "TECH")
      .field("isScheduled", true)
      .field("status", "PUBLISHED")
      .attach("photo", "public/test/Kortlink.png");

    expect(response.status).toBe(200);
  }, 100000);

  it("should fail - no sending anything", async () => {
    const response: request.Response = await request(web).post("/api/v1/admin/newsletters").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it("should fail - no authorization", async () => {
    const response: request.Response = await request(web).post("/api/v1/admin/newsletters");

    expect(response.status).toBe(401);
  });

  it("should fail - no permission", async () => {
    await AdminUtil.updateAdminPermission(admin1, false, false, false, false);

    const response: request.Response = await request(web).post("/api/v1/admin/newsletters").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });
});

describe("GET /api/v1/admin/newsletters", () => {
  let admin1: string;
  let token: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han", "fthrn.s27@pixelatee.com", "patangpuluhpatang", "ADMIN", true);
    await AdminUtil.updateAdminPermission(admin1, true, true, true, true);
    await NewsletterUtil.createAllNewsletter(5, admin1);
    token = await AdminUtil.login("fthrn.s27@pixelatee.com", "patangpuluhpatang");
  });

  afterEach(async () => {
    await AdminUtil.deleteAdmin(admin1);
    await NewsletterUtil.deleteAllMember();
    await NewsletterUtil.deleteAllNewsletter();
  });

  it("should pass - get all newsletters", async () => {
    const response: request.Response = await request(web).get("/api/v1/admin/newsletters").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("should fail - no authorization", async () => {
    const response: request.Response = await request(web).get("/api/v1/admin/newsletters");

    expect(response.status).toBe(401);
  });

  it("should fail - no permission", async () => {
    await AdminUtil.updateAdminPermission(admin1, false, false, false, false);

    const response: request.Response = await request(web).get("/api/v1/admin/newsletters").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });
});

describe("GET /api/v1/admin/newsletters/:newsletterId", () => {
  let admin1: string;
  let newsletter1: string;
  let token: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han", "fthrn.s27@pixelatee.com", "patangpuluhpatang", "ADMIN", true);
    await AdminUtil.updateAdminPermission(admin1, true, true, true, true);
    newsletter1 = await NewsletterUtil.createNewsletter("Test", "test", "test.png", "TECH", "PUBLISHED", admin1);
    token = await AdminUtil.login("fthrn.s27@pixelatee.com", "patangpuluhpatang");
  });

  afterEach(async () => {
    await AdminUtil.deleteAdmin(admin1);
    await NewsletterUtil.deleteAllMember();
    await NewsletterUtil.deleteAllNewsletter();
  });

  it("should pass - get all newsletters", async () => {
    const response: request.Response = await request(web).get(`/api/v1/admin/newsletters/${newsletter1}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("should fail - no authorization", async () => {
    const response: request.Response = await request(web).get(`/api/v1/admin/newsletters/${newsletter1}`);

    expect(response.status).toBe(401);
  });

  it("should fail - no permission", async () => {
    await AdminUtil.updateAdminPermission(admin1, false, false, false, false);

    const response: request.Response = await request(web).get(`/api/v1/admin/newsletters/${newsletter1}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });

  it("should fail - invalid id", async () => {
    const response: request.Response = await request(web).get(`/api/v1/admin/newsletters/invalid`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });
});

describe("DELETE /api/v1/admin/newsletters/:newsletterId", () => {
  let admin1: string;
  let newsletter1: string;
  let token: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han", "fthrn.s27@pixelatee.com", "patangpuluhpatang", "ADMIN", true);
    await AdminUtil.updateAdminPermission(admin1, true, true, true, true);
    newsletter1 = await NewsletterUtil.createNewsletter("Test", "test", "test.png", "TECH", "PUBLISHED", admin1);
    token = await AdminUtil.login("fthrn.s27@pixelatee.com", "patangpuluhpatang");
  });

  afterEach(async () => {
    await AdminUtil.deleteAdmin(admin1);
    await NewsletterUtil.deleteAllMember();
    await NewsletterUtil.deleteAllNewsletter();
  });

  it("should pass - delete newsletter", async () => {
    const response: request.Response = await request(web).delete(`/api/v1/admin/newsletters/${newsletter1}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("should fail - invalid id", async () => {
    const response: request.Response = await request(web).delete(`/api/v1/admin/newsletters/invalid`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it("should fail - no authorization", async () => {
    const response: request.Response = await request(web).delete(`/api/v1/admin/newsletters/${newsletter1}`);

    expect(response.status).toBe(401);
  });

  it("should fail - no permission", async () => {
    await AdminUtil.updateAdminPermission(admin1, false, false, false, false);

    const response: request.Response = await request(web).delete(`/api/v1/admin/newsletters/${newsletter1}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });
});

describe("GET /api/v1/admin/newsletters/:newsletterId/preview", () => {
  let admin1: string;
  let newsletter1: string;
  let token: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han", "fthrn.s27@pixelatee.com", "patangpuluhpatang", "ADMIN", true);
    await AdminUtil.updateAdminPermission(admin1, true, true, true, true);
    newsletter1 = await NewsletterUtil.createNewsletter("Test", "test", "test.png", "TECH", "PUBLISHED", admin1);
    token = await AdminUtil.login("fthrn.s27@pixelatee.com", "patangpuluhpatang");
  });

  afterEach(async () => {
    await AdminUtil.deleteAdmin(admin1);
    await NewsletterUtil.deleteAllMember();
    await NewsletterUtil.deleteAllNewsletter();
  });

  it("should pass - get all newsletters", async () => {
    const response: request.Response = await request(web).get(`/api/v1/admin/newsletters/${newsletter1}/preview`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("should fail - no authorization", async () => {
    const response: request.Response = await request(web).get(`/api/v1/admin/newsletters/${newsletter1}/preview`);

    expect(response.status).toBe(401);
  });

  it("should fail - no permission", async () => {
    await AdminUtil.updateAdminPermission(admin1, false, false, false, false);

    const response: request.Response = await request(web).get(`/api/v1/admin/newsletters/${newsletter1}/preview`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });
});

describe("PATCH /api/v1/admin/newsletters/:newsletterId", () => {
  let admin1: string;
  let newsletter1: string;
  let token: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han", "fthrn.s27@pixelatee.com", "patangpuluhpatang", "ADMIN", true);
    await AdminUtil.updateAdminPermission(admin1, true, true, true, true);
    newsletter1 = await NewsletterUtil.createNewsletter("Test", "test", "test.png", "TECH", "PUBLISHED", admin1);
    token = await AdminUtil.login("fthrn.s27@pixelatee.com", "patangpuluhpatang");
  });

  afterEach(async () => {
    await AdminUtil.deleteAdmin(admin1);
    await NewsletterUtil.deleteAllMember();
    await NewsletterUtil.deleteAllNewsletter();

    if (fs.existsSync("public/newsletter")) {
      fs.rmSync("public/newsletter", { recursive: true, force: true });
    }
  });

  it("should pass - update newsletter", async () => {
    const response: request.Response = await request(web)
      .patch(`/api/v1/admin/newsletters/${newsletter1}`)
      .set("Authorization", `Bearer ${token}`)
      .field("title", "Test 2")
      .field("content", "test 2")
      .field("type", "TECH")
      .field("isScheduled", "true")
      .field("status", "PUBLISHED")
      .attach("photo", "public/test/Kortlink.png");

    expect(response.status).toBe(200);
  });

  it("should pass - update newsletter without photo", async () => {
    const response: request.Response = await request(web)
      .patch(`/api/v1/admin/newsletters/${newsletter1}`)
      .set("Authorization", `Bearer ${token}`)
      .field("title", "Test 2")
      .field("content", "test 2")
      .field("type", "TECH")
      .field("isScheduled", "true")
      .field("status", "PUBLISHED");

    expect(response.status).toBe(200);
  });

  it("should pass - no authorization", async () => {
    const response: request.Response = await request(web).patch(`/api/v1/admin/newsletters/${newsletter1}`).field("title", "Test 2").field("content", "test 2").field("type", "TECH").field("isScheduled", "true").field("status", "PUBLISHED");
    expect(response.status).toBe(401);
  });

  it("should fail - no permission", async () => {
    await AdminUtil.updateAdminPermission(admin1, false, false, false, false);

    const response: request.Response = await request(web)
      .patch(`/api/v1/admin/newsletters/${newsletter1}`)
      .set("Authorization", `Bearer ${token}`)
      .field("title", "Test 2")
      .field("content", "test 2")
      .field("type", "TECH")
      .field("isScheduled", "true")
      .field("status", "PUBLISHED");
    
    expect(response.status).toBe(403);
  });
});

afterAll(async () => {
  await GuestUtil.deleteAllVisitor();
});