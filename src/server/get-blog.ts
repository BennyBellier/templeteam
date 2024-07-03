import "server-only";

import { prisma } from "@/trpc/server";
import { cache } from "react";
import type { CategoryEnum } from "./api/routers/blog";
import { logger } from "./logger";

export const preloadBlogPosts = () => {
  void getBlogPosts();
};

export const getBlogPosts = cache(
  async (category?: CategoryEnum, page?: number) => {
    try {
      // const posts = await prisma.blogposts.get({ category, page });

      const posts = "Google IDX - prisma deactivated"

      logger.debug("getBlogPosts: ", posts);

      return posts;
    } catch (error) {
      logger.error(error);
    }
    return [];
  },
);
