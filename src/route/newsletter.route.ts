import express from "express";

import { NewsletterController } from "../controller/newsletter.controller";

export const newsletterRoute: express.Router = express.Router();

newsletterRoute.post("/public/newsletters/join", NewsletterController.join);
newsletterRoute.get("/public/newsletters/activate", NewsletterController.activate);