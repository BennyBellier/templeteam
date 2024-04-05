import { prisma } from "@/trpc/server";
import { cache } from "react";
import "server-only";

export const preloadReferences = () => {
  void getReferences();
}

export const getReferences = cache(async () => {
  const references = await prisma.references.get();
  return references;
})