import express from "express";

import { ClientController } from "../controller/client.controller";

import { AuthMiddleware } from "../middleware/auth.middleware";
import { FileUploadMiddleware } from "../middleware/file-upload.middleware";

export const clientRoute: express.Router = express.Router();

clientRoute.get("/admin/clients", AuthMiddleware.authentication, AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]), AuthMiddleware.permission("canReadClient"), ClientController.adminGetAll);
clientRoute.get("/admin/clients/form", AuthMiddleware.authentication, AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]), AuthMiddleware.permission("canReadClient"), ClientController.formGetAll);
clientRoute.post(
  "/admin/clients",
  AuthMiddleware.authentication,
  AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]),
  AuthMiddleware.permission("canWriteClient"),
  FileUploadMiddleware.handleSingle("client", 2, "logo"),
  ClientController.adminCreate
);
clientRoute.patch(
  "/admin/clients/:clientId",
  AuthMiddleware.authentication,
  AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]),
  AuthMiddleware.permission("canUpdateClient"),
  FileUploadMiddleware.handleSingle("client", 2, "logo"),
  ClientController.adminUpdate
);
clientRoute.delete("/admin/clients/:clientId", AuthMiddleware.authentication, AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]), AuthMiddleware.permission("canDeleteClient"), ClientController.adminDelete);
