import express from "express";

import { SuperAdminController } from "../controller/super-admin.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

export const superAdminRoute: express.Router = express.Router();

superAdminRoute.post("/super-admin/admins/register", AuthMiddleware.authentication, AuthMiddleware.authorization(["SUPER_ADMIN"]), AuthMiddleware.permission("canWriteAdmin"), SuperAdminController.registerAdmin);
superAdminRoute.get("/super-admin/admins", AuthMiddleware.authentication, AuthMiddleware.authorization(["SUPER_ADMIN"]), AuthMiddleware.permission("canReadAdmin"), SuperAdminController.adminList);
superAdminRoute.get("/super-admin/admins/:adminId", AuthMiddleware.authentication, AuthMiddleware.authorization(["SUPER_ADMIN"]), AuthMiddleware.permission("canReadAdmin"), SuperAdminController.adminDetail);
superAdminRoute.patch("/super-admin/admins/:adminId/permissions", AuthMiddleware.authentication, AuthMiddleware.authorization(["SUPER_ADMIN"]), AuthMiddleware.permission("canUpdateAdmin"), SuperAdminController.updateAdminPermissions);
superAdminRoute.delete("/super-admin/admins/:adminId", AuthMiddleware.authentication, AuthMiddleware.authorization(["SUPER_ADMIN"]), AuthMiddleware.permission("canDeleteAdmin"), SuperAdminController.deleteAdmin);