export class ResponseError extends Error {
  public name: string = "ResponseError";
  public status: number = 400;

  /**
   * Creates a new instance of ResponseError.
   *
   * @param message The error message.
   * @param status The HTTP status code, defaults to 400.
   */
  constructor(message: string, status: number = 400) {
    super(message);
    this.status = status;
  }
}
