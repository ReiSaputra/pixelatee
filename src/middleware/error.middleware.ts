import express from "express";
import z from "zod";
import jwt from "jsonwebtoken";

import { ResponseError } from "../error/response.error";

export class ErrorMiddleware {
  public static handle(error: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
    if (error instanceof ResponseError) {
      res.status(error.status).json({ status: "Error", code: error.status, error: error.name, message: error.message });
    } else if (error instanceof z.ZodError) {
      res.status(400).json({ status: "Error", code: 400, error: error.name, message: error.issues.map((issue) => issue.message) });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ status: "Error", code: 401, error: error.name, message: error.message });
    } else {
      res.status(500).json({ status: "Error", code: 500, error: error.name, message: error.message });
    }
  }
}
