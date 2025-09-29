import request from "supertest";

import { web } from "../src/application/web";

import { ContactPaginationResponseSuccess, ContactResponseError, ContactResponseSuccess, ContactUtil } from "./util/contact.util";
import { AdminUtil } from "./util/admin.util";
import { GuestUtil } from "./util/guest.util";

describe("POST /api/v1/public/contacts", () => {
  beforeEach(async () => {
    await ContactUtil.deleteAllContact();
  });

  afterEach(async () => {
    await ContactUtil.deleteAllContact();
  });

  it("should pass - create contact", async () => {
    const response: request.Response = await request(web)
      .post("/api/v1/public/contacts")
      .set("User-Agent", "jest-test-agent")
      .send({ name: "Fathurraihan Saputra", email: "fathurraihan@example.com", subject: "test", message: "test", type: "IT_CONSULTATION" });

    const body: ContactResponseSuccess = response.body as ContactResponseSuccess;

    expect(response.status).toBe(201);
  });

  it("should fail - wrong type", async () => {
    const response: request.Response = await request(web)
      .post("/api/v1/public/contacts")
      .set("User-Agent", "jest-test-agent")
      .send({ name: "Fathurraihan Saputra", email: "fathurraihan@example.com", subject: "test", message: "test", type: "IT" });

    const body: ContactResponseError = response.body as ContactResponseError;

    expect(response.status).toBe(400);

    expect(body.error).toBe("ZodError");
  });

  it("should fail - null properties", async () => {
    const response: request.Response = await request(web).post("/api/v1/public/contacts").set("User-Agent", "jest-test-agent").send({ name: null, email: null, subject: null, message: null, type: null });

    const body: ContactResponseError = response.body as ContactResponseError;

    expect(response.status).toBe(400);

    expect(body.error).toBe("ZodError");
  });

  it("should fail - empty string properties", async () => {
    const response: request.Response = await request(web).post("/api/v1/public/contacts").set("User-Agent", "jest-test-agent").send({ name: "", email: "", subject: "", message: "", type: "" });

    const body: ContactResponseError = response.body as ContactResponseError;

    expect(response.status).toBe(400);

    expect(body.error).toBe("ZodError");
  });

  it("should fail - undefined properties", async () => {
    const response: request.Response = await request(web).post("/api/v1/public/contacts").set("User-Agent", "jest-test-agent").send({ name: undefined, email: undefined, subject: undefined, message: undefined, type: undefined });

    const body: ContactResponseError = response.body as ContactResponseError;

    expect(response.status).toBe(400);

    expect(body.error).toBe("ZodError");
  });
});

describe("GET /api/v1/admin/contacts", () => {
  let admin1: string;
  let token: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han", "fthrn.s27@pixelatee.com", "patangpuluhpatang", "ADMIN", false);
    token = await AdminUtil.login("fthrn.s27@pixelatee.com", "patangpuluhpatang");
    await AdminUtil.updateAdminPermission(admin1, true, true, true, true);
    await ContactUtil.createAllContact(20, admin1);
    await ContactUtil.createContact("Contact A", "contacta@example.com", "Subject A", "Message A", "IT_CONSULTATION");
    await ContactUtil.createContact("Contact B", "contactb@example.com", "Subject B", "Message B", "IT_CONSULTATION");
  });

  afterEach(async () => {
    await AdminUtil.deleteAdmin(admin1);
    await ContactUtil.deleteAllContact();
  });

  it("should pass - get all contact on page 1", async () => {
    const response: request.Response = await request(web).get("/api/v1/admin/contacts?page=1").set("Authorization", `Bearer ${token}`);

    const body: ContactPaginationResponseSuccess = response.body as ContactPaginationResponseSuccess;

    expect(response.status).toBe(200);
  });

  it("should pass - get all contact on page 2", async () => {
    const response: request.Response = await request(web).get("/api/v1/admin/contacts?page=2").set("Authorization", `Bearer ${token}`);

    const body: ContactPaginationResponseSuccess = response.body as ContactPaginationResponseSuccess;

    expect(response.status).toBe(200);
  });

  it("should pass - get all contact on search (name)", async () => {
    const response: request.Response = await request(web).get("/api/v1/admin/contacts?search=Contact%20A").set("Authorization", `Bearer ${token}`);

    const body: ContactPaginationResponseSuccess = response.body as ContactPaginationResponseSuccess;

    expect(response.status).toBe(200);
  });

  it("should pass - get all contact on search (email)", async () => {
    const response: request.Response = await request(web).get("/api/v1/admin/contacts?search=contactb@example.com").set("Authorization", `Bearer ${token}`);

    const body: ContactPaginationResponseSuccess = response.body as ContactPaginationResponseSuccess;

    expect(response.status).toBe(200);
  });

  it("should pass - get all contact on type IT_CONSULTATION", async () => {
    const response: request.Response = await request(web).get("/api/v1/admin/contacts?type=IT_CONSULTATION").set("Authorization", `Bearer ${token}`);

    const body: ContactPaginationResponseSuccess = response.body as ContactPaginationResponseSuccess;

    expect(response.status).toBe(200);
  });

  it("should fail - no authorization", async () => {
    const response: request.Response = await request(web).get("/api/v1/admin/contacts");

    const body: ContactResponseError = response.body as ContactResponseError;

    expect(response.status).toBe(401);
  });

  it("should fail - no permission", async () => {
    await AdminUtil.updateAdminPermission(admin1, false, false, false, false);

    const response: request.Response = await request(web).get("/api/v1/admin/contacts").set("Authorization", `Bearer ${token}`);

    const body: ContactResponseError = response.body as ContactResponseError;

    expect(response.status).toBe(403);
  });
});

describe("GET /api/v1/admin/contacts/:contactId", () => {
  let admin1: string;
  let token: string;
  let contact1: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han", "fthrn.s27@pixelatee.com", "patangpuluhpatang", "ADMIN", false);
    token = await AdminUtil.login("fthrn.s27@pixelatee.com", "patangpuluhpatang");
    await AdminUtil.updateAdminPermission(admin1, true, true, true, true);
    contact1 = await ContactUtil.createContact("Contact A", "contacta@example.com", "Subject A", "Message A", "IT_CONSULTATION");
  });

  afterEach(async () => {
    await AdminUtil.deleteAdmin(admin1);
    await ContactUtil.deleteAllContact();
  });

  it("should pass - get contact by id", async () => {
    const response: request.Response = await request(web).get(`/api/v1/admin/contacts/${contact1}`).set("Authorization", `Bearer ${token}`);

    const body: ContactResponseSuccess = response.body as ContactResponseSuccess;

    expect(response.status).toBe(200);
  });

  it("should fail - contact not found", async () => {
    const response: request.Response = await request(web).get(`/api/v1/admin/contacts/invalid`).set("Authorization", `Bearer ${token}`);

    const body: ContactResponseError = response.body as ContactResponseError;

    expect(response.status).toBe(400);
  });

  it("should fail - no authorization", async () => {
    const response: request.Response = await request(web).get(`/api/v1/admin/contacts/${contact1}`);

    const body: ContactResponseError = response.body as ContactResponseError;

    expect(response.status).toBe(401);
  });

  it("should fail - no permission", async () => {
    await AdminUtil.updateAdminPermission(admin1, false, false, false, false);

    const response: request.Response = await request(web).get(`/api/v1/admin/contacts/${contact1}`).set("Authorization", `Bearer ${token}`);

    const body: ContactResponseError = response.body as ContactResponseError;

    expect(response.status).toBe(403);
  });
});

describe("DELETE /api/v1/admin/contacts/:contactId", () => {
  let admin1: string;
  let token: string;
  let contact1: string;

  beforeEach(async () => {
    admin1 = await AdminUtil.createAdmin("Han", "fthrn.s27@pixelatee.com", "patangpuluhpatang", "ADMIN", true);
    token = await AdminUtil.login("fthrn.s27@pixelatee.com", "patangpuluhpatang");
    contact1 = await ContactUtil.createContact("Contact A", "contacta@example.com", "Subject A", "Message A", "IT_CONSULTATION");
  });

  afterEach(async () => {
    await AdminUtil.deleteAdmin(admin1);
    await ContactUtil.deleteAllContact();
  });

  it("should pass - delete contact by id", async () => {
    const response: request.Response = await request(web).delete(`/api/v1/admin/contacts/${contact1}`).set("Authorization", `Bearer ${token}`);

    const body: ContactResponseSuccess = response.body as ContactResponseSuccess;

    expect(response.status).toBe(200);
  });

  it("should fail - contact not found", async () => {
    const response: request.Response = await request(web).delete(`/api/v1/admin/contacts/invalid`).set("Authorization", `Bearer ${token}`);

    const body: ContactResponseError = response.body as ContactResponseError;

    expect(response.status).toBe(400);
  });

  it("should fail - no authorization", async () => {
    const response: request.Response = await request(web).delete(`/api/v1/admin/contacts/${contact1}`);

    const body: ContactResponseError = response.body as ContactResponseError;

    expect(response.status).toBe(401);
  });
});

afterAll(async () => {
  await GuestUtil.deleteAllVisitor();
});
