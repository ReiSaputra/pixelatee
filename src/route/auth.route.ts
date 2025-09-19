import express from "express";

import { AuthController } from "../controller/auth.controller";

export const authRoute: express.Router = express.Router();

authRoute.post("/public/auth/login", AuthController.login);
