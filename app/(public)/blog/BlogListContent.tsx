"use client";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { categoryToText, cn } from "@/lib/utils";
import { trpc } from "@/trpc/TrpcProvider";
import { BlogCategory } from "@prisma/client";
import { Suspense, useState, useTransition } from "react";
import PostCard from "./PostCard";
import PostSkeleton from "./PostSkeleton";
import { v4 as uuidv4 } from "uuid";

export default function BlogPostsList({
  category,
  // page,
}: {
  category: BlogCategory;
  // page: number;
}) {
  const query = trpc.blogposts.get.useSuspenseInfiniteQuery(
    {
      category,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const handleFetchNextPage = async () => {
    await query[1].fetchNextPage();
  };

  const posts = query[0].pages;

  return (
    <>
      {posts?.map((page) => {
        return page.items.map((post) => {
          if (query[1].isFetching) {
            return <PostSkeleton key={uuidv4()} />;
          }
          return (
            <li key={post.id}>
              <PostCard
                post={post}
                displayCategory={category === BlogCategory.ALL}
              />
            </li>
          );
        });
      })}

      <Button
        onClick={handleFetchNextPage}
        disabled={!query[1].hasNextPage}
        className="absolute -bottom-8"
      >
        Plus de posts
      </Button>
    </>
  );
}

export function BlogListContent() {
  const [category, setCategory] = useState<BlogCategory | undefined>("ALL");
  const [page, setPage] = useState(0);
  const [isPending, startTransition] = useTransition();

  const handleCategory = (newCategory?: BlogCategory) => {
    startTransition(() => {
      setCategory(newCategory);
      setPage(0);
    });
  };

  const handlePagination = () => {
    startTransition(() => {
      setPage((prevPage) => prevPage + 1);
    });
  };

  return (
    <>
      <Typography as="h1" variant="h1" className="mb-4">
        Derniers articles
      </Typography>
      <ul
        className={cn(
          "flex flex-col items-center gap-4 rounded-xl bg-muted/50 px-6 py-3 md:flex-row",
        )}
      >
        <li>
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
        </li>
        <li>
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
        </li>
        <li>
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
        </li>
        <li>
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
        </li>
      </ul>
      <Suspense fallback={<div>Loading...</div>}>
        <BlogPostsList category={category ?? "ALL"} />
      </Suspense>
      <Button onClick={handlePagination} disabled={isPending}>
        Load more
      </Button>
    </>
  );
}
