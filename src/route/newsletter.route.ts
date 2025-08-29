import express from "express";

import { NewsletterController } from "../controller/newsletter.controller";

export const newsletterRoute: express.Router = express.Router();

newsletterRoute.post("/newsletters/join", NewsletterController.join);
// newsletterRoute.post("/newsletters/", NewsletterController.)
