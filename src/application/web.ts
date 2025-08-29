import express from "express";
import cors from "cors";

export const web: express.Application = express();

/**
 * Middlewares
 */

web.use(cors());
web.use(express.json());
web.use(express.urlencoded({ extended: true }));

/**
 * Routes
 */
