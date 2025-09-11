import express from "express";

import { ContactController } from "../controller/contact.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

export const contactRoute: express.Router = express.Router();

contactRoute.post("/public/contacts", ContactController.create);

contactRoute.get("/admin/contacts", AuthMiddleware.authentication, AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]), AuthMiddleware.permission("canReadContact"), ContactController.adminGetAll);
contactRoute.get("/admin/contacts/:contactId", AuthMiddleware.authentication, AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]), AuthMiddleware.permission("canReadContact"), ContactController.adminGetDetail);
contactRoute.delete("/admin/contacts/:contactId", AuthMiddleware.authentication, AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]), AuthMiddleware.permission("canDeleteContact"), ContactController.adminDelete);
