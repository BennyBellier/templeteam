import "server-only";

import { prisma } from "@/trpc/server";
import { cache } from "react";
import logger from "./logger";

export const preloadReferences = () => {
  void getReferences();
};

export const getReferences = cache(async () => {
  try {
    const references = await prisma.site.references.getAll();

    logger.debug({
      context: "NextCached",
      requestPath: "getReferences",
      data: references,
      message: `Find ${references.length} references.`,
    });

    return references;
  } catch (error) {
    logger.error({
      context: "NextCached",
      requestPath: "getReferences",
      data: error,
      message: `Error while fetching cached references.`,
    });
  }
  return [];
});
