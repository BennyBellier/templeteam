import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { blogPostsRouter } from "./routers/blog";
import { photosRouter } from "./routers/photos";
import { referencesRouter } from "./routers/references";
import { teamMembersRouter } from "./routers/team";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  references: referencesRouter,
  teamMembers: teamMembersRouter,
  photos: photosRouter,
  blogposts: blogPostsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
