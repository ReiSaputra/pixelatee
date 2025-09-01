import z from "zod";

export class Validation {
  /**
   * Validate the given request with the given schema.
   * @param schema The Zod schema to validate with.
   * @param request The request to validate.
   * @returns The parsed request, or throws a ZodError if the request does not match the schema.
   */
  public static validate<T>(schema: z.ZodType<T>, request: T): T {
    return schema.parse(request);
  }
}
