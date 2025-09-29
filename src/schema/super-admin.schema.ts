import z from "zod";

import { AdminFilters, AdminParams, AdminRegisterRequest } from "../model/super-admin.model";

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
}
