import "server-only";

import { prisma } from "@/trpc/server";
import { cache } from "react";
import type { CategoryEnum } from "./api/routers/blog";
// import { logger } from "./logger";

export const preloadBlogPosts = () => {
  void getBlogPosts();
};

export const getBlogPosts = cache(
  async (category?: CategoryEnum, page?: number) => {
    try {
      const posts = await prisma.blogposts.get({ category, page });

      console.debug("getBlogPosts: ", posts);

      return posts;
    } catch (error) {
      console.error({error});
    }
    return [];
  },
);
