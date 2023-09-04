import { exampleRouter } from "~/server/api/routers/example";
import { contentRouter } from "~/server/api/routers/content";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  content: contentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
