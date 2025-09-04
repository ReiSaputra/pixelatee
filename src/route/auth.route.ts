import express from "express";

import { AuthController } from "../controller/auth.controller";

import { AuthMiddleware } from "../middleware/auth.middleware";

export const authRoute: express.Router = express.Router();

/**
 * Public
 */
authRoute.post("/public/auth/login", AuthController.login);

/**
 * Super Admin
 */
authRoute.post("/super-admin/auth/register", AuthMiddleware.authentication, AuthMiddleware.authorization("SUPER_ADMIN"));