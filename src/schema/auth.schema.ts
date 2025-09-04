import z from "zod";

import { AuthLoginRequest } from "../model/auth.model";

export class AuthSchema {
  public static readonly LOGIN: z.ZodType<AuthLoginRequest> = z
    .strictObject({
      email: z
        .email({ error: "Invalid email address" })
        .regex(/^[A-Za-z0-9._%+-]+@pixelatee\.com$/, { message: "Email must end with @pixelatee.com" })
        .nonempty({ error: "Email is required" }),
      password: z.string({ error: "Invalid type of password, must be string" }).nonempty({ error: "Password is required" }),
    })
    .required();

  public static readonly REGISTER: z.ZodType<AuthLoginRequest> = z
    .strictObject({
      email: z
        .email({ error: "Invalid email address" })
        .regex(/^[A-Za-z0-9._%+-]+@pixelatee\.com$/, { message: "Email must end with @pixelatee.com" })
        .nonempty({ error: "Email is required" }),
      password: z.string({ error: "Invalid type of password, must be string" }).nonempty({ error: "Password is required" }),
    })
    .required();
}
