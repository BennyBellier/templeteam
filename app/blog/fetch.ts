"use server";

import type { CategoryEnum } from "@/server/api/routers/blog";
import { getBlogPosts } from "@/server/get-blog";

export async function fetchPosts(category?: CategoryEnum, page?: number) {
  return getBlogPosts(category, page);
}
