import "server-only";

import { prisma } from "@/trpc/server";
import { cache } from "react";
import { logger } from "./logger";

export const preloadReferences = () => {
  void getReferences();
};

export const getReferences = cache(async () => {
  try {
    const references = await prisma.references.getAll();

    logger.debug("getReferences: ", references);

    return references;
  } catch (error) {
    logger.error(error);
  }
  return [];
});
