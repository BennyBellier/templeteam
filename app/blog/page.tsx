"use client";

import {
  Layout,
  LayoutDescription,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
} from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { categoryToText, cn } from "@/lib/utils";
import { trpc } from "@/trpc/TrpcProvider";
import { BlogCategory } from "@prisma/client";
import { useState } from "react";
import PostCard from "./PostCard";
import PostSkeleton from "./PostSkeleton";

export default function Blog() {
  const [category, setCategory] = useState<BlogCategory | undefined>("ALL");
  const query = trpc.blogposts.get.useSuspenseInfiniteQuery(
    {
      category,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const handleCategory = (newCategory?: BlogCategory) => {
    setCategory(newCategory);
  };

  const handleFetchNextPage = async () => {
    if (query[1].hasNextPage) await query[1].fetchNextPage();
  };

  const posts = query[0].pages;

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Blog</LayoutTitle>
        <LayoutDescription>
          Obtenez les dernières informations sur l&apos;équipe, les derniers
          articles et bien plus encore.
        </LayoutDescription>
      </LayoutHeader>
      <LayoutSection className="flex gap-6 md:items-start">
        <Typography as="h1" variant="h1" className="mb-4">
          Derniers articles
        </Typography>
        <div
          className={cn(
            "flex flex-col items-center gap-4 rounded-xl bg-muted/50 px-6 py-3 md:flex-row",
          )}
        >
          <Button
            variant="ghost"
            className={cn(
              "text-md hover:bg-muted",
              category === BlogCategory.ALL
                ? "font-medium hover:scale-100 hover:bg-transparent"
                : "font-light",
            )}
            onClick={() => handleCategory(BlogCategory.ALL)}
          >
            Tous
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "text-md hover:bg-muted",
              category === BlogCategory.ARTICLE
                ? "font-medium hover:scale-100 hover:bg-transparent"
                : "font-light",
            )}
            onClick={() => handleCategory(BlogCategory.ARTICLE)}
          >
            Articles
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "text-md hover:bg-muted",
              category === BlogCategory.EVENT
                ? "font-medium hover:scale-100 hover:bg-transparent"
                : "font-light",
            )}
            onClick={() => handleCategory(BlogCategory.EVENT)}
          >
            {categoryToText(BlogCategory.EVENT)}
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "text-md hover:bg-muted",
              category === BlogCategory.INFORMATION
                ? "font-medium hover:scale-100 hover:bg-transparent"
                : "font-light",
            )}
            onClick={() => handleCategory(BlogCategory.INFORMATION)}
          >
            {categoryToText(BlogCategory.INFORMATION)}
          </Button>
        </div>
        <ul className="relative grid h-fit w-full grid-cols-1 justify-around gap-4 pb-16 pt-6 md:grid-cols-2 lg:grid-cols-3">
          {posts?.map((page) => {
            return page.items.map((post) => (
              <li key={post.id}>
                <PostCard
                  post={post}
                  displayCategory={category === BlogCategory.ALL}
                />
              </li>
            ));
          })}
          {query[1].isFetching &&
            Array.from({ length: 6 }).map((_, i) => (
              <li key={i}>
                <PostSkeleton />
              </li>
            ))}
          <Button
            variant="outline"
            onClick={handleFetchNextPage}
            disabled={!query[1].hasNextPage || query[1].isFetching}
            className={cn(
              "absolute -bottom-8 left-1/2 -translate-x-1/2",
              !query[1].hasNextPage ? "hidden" : "",
            )}
          >
            Afficher plus
          </Button>
        </ul>
      </LayoutSection>
    </Layout>
  );
}