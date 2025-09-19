import express from "express";

import { UserController } from "../controller/user.controller";

import { AuthMiddleware } from "../middleware/auth.middleware";
import { FileUploadMiddleware } from "../middleware/file-upload.middleware";

export const userRoute: express.Router = express.Router();

userRoute.get("/users/profiles", AuthMiddleware.authentication, AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]), UserController.profile);
userRoute.get("/users/profiles/photo/preview", AuthMiddleware.authentication, AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]), UserController.updatePhotoPreview);
userRoute.get("/users/profiles/personal-info/preview", AuthMiddleware.authentication, AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]), UserController.updatePersonalInfoPreview);
// userRoute.get("/users/profiles/addresses/preview", AuthMiddleware.authentication, AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]), UserController.updateAddressPreview);

userRoute.patch("/users/profiles/photo", AuthMiddleware.authentication, AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]), FileUploadMiddleware.handleSingle("user", 2, "photo"), UserController.updatePhoto);
userRoute.patch("/users/profiles/personal-info", AuthMiddleware.authentication, AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]), UserController.updatePersonalInfo);
userRoute.patch("/users/profiles/password", AuthMiddleware.authentication, AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]), UserController.updatePassword);
// userRoute.post("/users/profile", AuthMiddleware.authentication, AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]), UserController.changeProfile);
// userRoute.get("/users/permissions", AuthMiddleware.authentication, AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]), UserController.permissions);
userRoute.post("/users/logout", AuthMiddleware.authentication, AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]), UserController.logout);
