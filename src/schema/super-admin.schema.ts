import z from "zod";

import { AdminRegisterRequest } from "../model/super-admin.model";

export class SuperAdminSchema {
  public static readonly REGISTER_ADMIN: z.ZodType<AdminRegisterRequest> = z
    .strictObject({
      name: z.string({ error: "Invalid type of name, must be string" }).nonempty({ error: "Name is required" }),
      password: z.string({ error: "Invalid type of password, must be string" }).nonempty({ error: "Password is required" }),
      email: z
        .email({ error: "Invalid email address" })
        .regex(/^[A-Za-z0-9._%+-]+@pixelatee\.com$/, { message: "Email must end with @pixelatee.com" })
        .nonempty({ error: "Email is required" }),
      dateOfBirth: z.string({ error: "Invalid type of date of birth, must be string" }).nonempty({ error: "Date of birth is required" }),
      phoneNumber: z.string({ error: "Invalid type of phone number, must be string" }).nonempty({ error: "Phone number is required" }),
      userRole: z.enum(["SUPER_ADMIN", "ADMIN"], { error: "Invalid type of user role, must be SUPER_ADMIN or ADMIN" }),
      address: z.strictObject({
        city: z.string({ error: "Invalid type of city, must be string" }).nonempty({ error: "City is required" }),
        country: z.string({ error: "Invalid type of country, must be string" }).nonempty({ error: "Country is required" }),
        zipCode: z.string({ error: "Invalid type of zipCode, must be string" }).nonempty({ error: "ZipCode is required" }),
      }),
    })
    .required();
}
