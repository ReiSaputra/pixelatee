import express from "express";

import { ContactController } from "../controller/contact.controller";

export const contactRoute: express.Router = express.Router();

contactRoute.post("/public/contacts", ContactController.create);

contactRoute.get("/admin/contacts", ContactController.adminGetAll);
