import express from "express";

import { NewsletterController } from "../controller/newsletter.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { FileUploadMiddleware } from "../middleware/file-upload.middleware";

export const newsletterRoute: express.Router = express.Router();

newsletterRoute.post("/public/newsletters/join", NewsletterController.join);
newsletterRoute.get("/public/newsletters/activate", NewsletterController.activate);
newsletterRoute.get("/public/newsletters/thank-you", NewsletterController.thanks);
newsletterRoute.delete("/public/newsletters/unsubscribe", NewsletterController.unsubscribe);

newsletterRoute.get("/admin/newsletters", AuthMiddleware.authentication, AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]), AuthMiddleware.permission("canReadNewsletter"), NewsletterController.adminGetAll);
newsletterRoute.get("/admin/newsletters/:newsletterId", AuthMiddleware.authentication, AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]), AuthMiddleware.permission("canReadNewsletter"), NewsletterController.adminGetDetail);
newsletterRoute.get("/admin/newsletters/:newsletterId/preview", AuthMiddleware.authentication, AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]), AuthMiddleware.permission("canWriteNewsletter"), NewsletterController.adminEditPreview);
newsletterRoute.post(
  "/admin/newsletters",
  AuthMiddleware.authentication,
  AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]),
  AuthMiddleware.permission("canWriteNewsletter"),
  FileUploadMiddleware.handleSingle("newsletter", 2, "photo"),
  NewsletterController.adminCreate
);
newsletterRoute.patch(
  "/admin/newsletters/:newsletterId",
  AuthMiddleware.authentication,
  AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]),
  AuthMiddleware.permission("canUpdateNewsletter"),
  FileUploadMiddleware.handleSingle("newsletter", 2, "photo"),
  NewsletterController.adminUpdate
);
newsletterRoute.delete("/admin/newsletters/:newsletterId", AuthMiddleware.authentication, AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]), AuthMiddleware.permission("canDeleteNewsletter"), NewsletterController.adminDelete);
