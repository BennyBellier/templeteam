import 'server-only';
import { PrismaClient } from "@prisma/client";
import logger from "@/server/logger";

import { env } from "@/env.mjs";

const createPrismaClient = () =>
  new PrismaClient({
    log: [
      {
        emit: "event",
        level: "query",
      },
      {
        emit: "event",
        level: "error",
      },
      {
        emit: "event",
        level: "info",
      },
      {
        emit: "event",
        level: "warn",
      },
    ],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/* prisma.$on("query", (e) => {
  logger.debug({
    type: "prisma",
    query: e.query,
    params: e.params,
    duration: e.duration,
    function: this,
  });
}); */

prisma.$on("error", (e) => {
  logger.error({
    type: "prisma",
    message: e.message,
    target: e.target,
  });
});

prisma.$on("info", (e) => {
  logger.info({
    type: "prisma",
    message: e.message,
    target: e.target,
  });
});

prisma.$on("warn", (e) => {
  logger.warn({
    type: "prisma",
    message: e.message,
    target: e.target,
  });
});