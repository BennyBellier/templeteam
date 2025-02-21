import { type inferReactQueryProcedureOptions } from "@trpc/react-query";
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { blogPostsRouter } from "./routers/blog";
import { photosRouter } from "./routers/photos";
import { referencesRouter } from "./routers/references";
import { teamMembersRouter } from "./routers/team";
import { AssociationRouter } from "./routers/association";
import { TreasurerRouter } from "./routers/treasurer";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  association: AssociationRouter,
  treasurer: TreasurerRouter,
  references: referencesRouter,
  teamMembers: teamMembersRouter,
  photos: photosRouter,
  blogposts: blogPostsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

// export type of router procedure
export type RouterDefinition = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
