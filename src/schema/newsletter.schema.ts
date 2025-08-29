import z from "zod";

export class NewsletterSchema {
  public static readonly JOIN = z
    .strictObject({
      email: z.email({ error: "Invalid email address" }).nonempty({ error: "Email is required" }),
    })
    .required();
}
