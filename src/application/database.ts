import { PrismaClient } from "../generated/prisma/client";

import { logger } from "./log";

export const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "warn",
    },
    {
      emit: "event",
      level: "error",
    },
  ],
});

prisma.$on("info", (e) => {
  logger.info(e.message);
});

prisma.$on("query", (e) => {
  logger.info(e.query);
});

prisma.$on("warn", (e) => {
  logger.warn(e.message);
});

prisma.$on("error", (e) => {
  logger.error(e.message);
});
