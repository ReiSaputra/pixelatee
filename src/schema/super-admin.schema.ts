import z from "zod";

import { AdminFilters, AdminParams, AdminPermissionRequest, AdminRegisterRequest } from "../model/super-admin.model";

export class SuperAdminSchema {
  public static readonly REGISTER_ADMIN: z.ZodType<AdminRegisterRequest> = z
    .strictObject({
      name: z.string({ error: "Invalid type of name, must be string" }).nonempty({ error: "Name is required" }),
      password: z.string({ error: "Invalid type of password, must be string" }).nonempty({ error: "Password is required" }).default("12345678"),
      email: z
        .email({ error: "Invalid email address" })
        .regex(/^[A-Za-z0-9._%+-]+@pixelatee\.com$/, { message: "Email must end with @pixelatee.com" })
        .nonempty({ error: "Email is required" }),
      dateOfBirth: z.string({ error: "Invalid type of date of birth, must be string" }).nonempty({ error: "Date of birth is required" }),
      phoneNumber: z.string({ error: "Invalid type of phone number, must be string" }).nonempty({ error: "Phone number is required" }),
      userRole: z.enum(["SUPER_ADMIN", "ADMIN"], { error: "Invalid type of user role, must be SUPER_ADMIN or ADMIN" }),
      address: z.strictObject({
        city: z.string({ error: "Invalid type of city, must be string" }).nullable(),
        country: z.string({ error: "Invalid type of country, must be string" }).nullable(),
        zipCode: z.string({ error: "Invalid type of zipCode, must be string" }).nullable(),
      }),
    })
    .required();

  public static readonly DETAIL: z.ZodType<AdminParams> = z
    .strictObject({
      adminId: z.string({ error: "Invalid type of admin ID" }).nonempty({ error: "Admin ID is required" }),
    })
    .required();

  public static readonly FILTER: z.ZodType<AdminFilters> = z.strictObject({
    page: z.coerce.number({ error: "Invalid type of page, must be number" }).min(1, { error: "Page must be greater than 0" }).default(1),
    search: z.string({ error: "Invalid type of search, must be string" }).optional(),
    role: z.enum(["SUPER_ADMIN", "ADMIN"], { error: "Invalid type of role, must be SUPER_ADMIN or ADMIN" }).optional(),
  });

  public static readonly UPDATE_PERMISSION_ADMIN: z.ZodType<AdminPermissionRequest> = z
    .strictObject({
      canReadNewsletter: z.boolean({ error: "Invalid type of canReadNewsletter, must be boolean" }),
      canWriteNewsletter: z.boolean({ error: "Invalid type of canWriteNewsletter, must be boolean" }),
      canUpdateNewsletter: z.boolean({ error: "Invalid type of canUpdateNewsletter, must be boolean" }),
      canDeleteNewsletter: z.boolean({ error: "Invalid type of canDeleteNewsletter, must be boolean" }),

      canReadClient: z.boolean({ error: "Invalid type of canReadClient, must be boolean" }),
      canWriteClient: z.boolean({ error: "Invalid type of canWriteClient, must be boolean" }),
      canUpdateClient: z.boolean({ error: "Invalid type of canUpdateClient, must be boolean" }),
      canDeleteClient: z.boolean({ error: "Invalid type of canDeleteClient, must be boolean" }),

      canReadPortfolio: z.boolean({ error: "Invalid type of canReadPortfolio, must be boolean" }),
      canWritePortfolio: z.boolean({ error: "Invalid type of canWritePortfolio, must be boolean" }),
      canUpdatePortfolio: z.boolean({ error: "Invalid type of canUpdatePortfolio, must be boolean" }),
      canDeletePortfolio: z.boolean({ error: "Invalid type of canDeletePortfolio, must be boolean" }),

      canReadContact: z.boolean({ error: "Invalid type of canReadContact, must be boolean" }),
      canWriteContact: z.boolean({ error: "Invalid type of canWriteContact, must be boolean" }),
      canUpdateContact: z.boolean({ error: "Invalid type of canUpdateContact, must be boolean" }),
      canDeleteContact: z.boolean({ error: "Invalid type of canDeleteContact, must be boolean" }),

      canReadAdmin: z.boolean({ error: "Invalid type of canReadAdmin, must be boolean" }),
      canWriteAdmin: z.boolean({ error: "Invalid type of canWriteAdmin, must be boolean" }),
      canUpdateAdmin: z.boolean({ error: "Invalid type of canUpdateAdmin, must be boolean" }),
      canDeleteAdmin: z.boolean({ error: "Invalid type of canDeleteAdmin, must be boolean" }),
    })
    .required();
}
