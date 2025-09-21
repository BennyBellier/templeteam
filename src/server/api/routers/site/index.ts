import { createTRPCRouter } from "@/server/api/trpc";
import { blogPostsRouter } from "./blog";
import { photosRouter } from "./photos";
import { referencesRouter } from "./references";
import { teamMembersRouter } from "./team";

export const SiteRouter = createTRPCRouter({
  references: referencesRouter,
  teamMembers: teamMembersRouter,
  photos: photosRouter,
  blogposts: blogPostsRouter,
});