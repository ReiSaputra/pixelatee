import z from "zod";

import { UserRequest } from "../model/user.model";

export class UserSchema {
  public static readonly UPDATE_PHOTO: z.ZodType<UserRequest> = z.strictObject({
    photo: z
      .string({ error: "Invalid type of photo, must be string" })
      .regex(/^image\/(png|jpeg)$/, { error: "Photo must be a PNG or JPEG image" })
      .nonempty({ error: "Photo is required" }),
  });

  public static readonly UPDATE_PERSONAL_INFO: z.ZodType<UserRequest> = z.strictObject({
    name: z.string({ error: "Invalid type of name, must be string" }).nonempty({ error: "Name is required" }),
    email: z.string({ error: "Invalid type of email, must be string" }).nonempty({ error: "Email is required" }),
    phoneNumber: z.string({ error: "Invalid type of phone number, must be string" }).nonempty({ error: "Phone number is required" }),
    dateOfBirth: z.string({ error: "Invalid type of date of birth, must be string" }).nonempty({ error: "Date of birth is required" }),
  });

  public static readonly UPDATE_PASSWORD: z.ZodType<UserRequest> = z.strictObject({
    password: z.string({ error: "Invalid type of password, must be string" }).nonempty({ error: "Password is required" }),
  });

  public static readonly UPDATE_ADDRESS: z.ZodType<UserRequest> = z.strictObject({
    city: z.string({ error: "Invalid type of city, must be string" }).nullable(),
    country: z.string({ error: "Invalid type of country, must be string" }).nullable(),
    zipCode: z.string({ error: "Invalid type of zip code, must be string" }).nullable(),
  });
}
