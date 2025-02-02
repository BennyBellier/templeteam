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

prisma.$on("query", (e) => {
  logger.debug({
    context: "Prisma",
    message: `${this}`,
    data: e
  });
});

prisma.$on("error", (e) => {
  logger.error({
    context: "Prisma",
    message: this + " " + e.message,
    data: e,
  });
});

prisma.$on("info", (e) => {
  logger.info({
    context: "Prisma",
    message: this + " " + e.message,
    data: e,
  });
});

prisma.$on("warn", (e) => {
  logger.warn({
    context: "Prisma",
    message: this + " " + e.message,
    data: e,
  });
});