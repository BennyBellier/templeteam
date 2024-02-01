import { postRouter } from "./routers/post";
import { referencesRouter } from "./routers/references";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  references: referencesRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
