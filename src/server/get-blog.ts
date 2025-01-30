import "server-only";

import { prisma } from "@/trpc/server";
import { cache } from "react";
import type { CategoryEnum } from "./api/routers/blog";
import logger from "./logger";

export const preloadBlogPosts = () => {
  void getBlogPosts();
};

export const getBlogPosts = cache(
  async (category?: CategoryEnum, page?: number) => {
    try {
      const posts = await prisma.blogposts.get({ category, page });

      logger.debug({
        context: "NextCached",
        requestPath: "getBlogPosts",
        data: posts,
        message: `Find ${posts.items.length} photos.`,
      });

      return posts;
    } catch (error) {
      logger.error({
        context: "NextCached",
        requestPath: "getBlogPosts",
        data: error,
        message: `Error while fetching cached references.`,
      });
    }
    return [];
  },
);
