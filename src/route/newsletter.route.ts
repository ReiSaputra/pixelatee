import express from "express";

import { NewsletterController } from "../controller/newsletter.controller";

import { AuthMiddleware } from "../middleware/auth.middleware";
import { FileUploadMiddleware } from "../middleware/file-upload.middleware";
import { GuestMiddleware } from "../middleware/guest.middleware";

export const newsletterRoute: express.Router = express.Router();

newsletterRoute.post("/public/newsletters/join", GuestMiddleware.dailyVisit, NewsletterController.join);
newsletterRoute.get("/public/newsletters/activate", GuestMiddleware.dailyVisit, NewsletterController.activate);
newsletterRoute.get("/public/newsletters/thank-you", GuestMiddleware.dailyVisit, NewsletterController.thanks);
newsletterRoute.delete("/public/newsletters/unsubscribe", GuestMiddleware.dailyVisit, NewsletterController.unsubscribe);

newsletterRoute.get("/admin/newsletters", AuthMiddleware.authentication, AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]), AuthMiddleware.permission("canReadNewsletter"), NewsletterController.adminGetAll);
newsletterRoute.get("/admin/newsletters/scheduled", AuthMiddleware.authentication, AuthMiddleware.authorization(["ADMIN", "SUPER_ADMIN"]), AuthMiddleware.permission("canReadNewsletter"), NewsletterController.adminGetAllScheduled);
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
