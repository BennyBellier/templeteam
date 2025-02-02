"use client";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { categoryToText, cn } from "@/lib/utils";
import { trpc } from "@/trpc/TrpcProvider";
import { BlogCategory } from "@prisma/client";
import PostCard from "./PostCard";
import PostSkeleton from "./PostSkeleton";
import { useBlogCategory } from "./template";

export function CategorySelector() {
  const { category, setCategory } = useBlogCategory();

  const handleCategory = (newCategory?: BlogCategory) => {
    setCategory(newCategory);
  };

  return (
    <div>
      <Typography as="h1" variant="h1" className="mb-4">
        Derniers articles
      </Typography>
      <div
        className={cn(
          "flex flex-col items-center gap-4 rounded-xl bg-muted/50 px-6 py-3 md:flex-row",
        )}
      >
        {Object.values(BlogCategory).map((data) => (
          <Button
            key={data}
            variant="ghost"
            className={cn(
              "text-md hover:bg-muted",
              category === data
                ? "font-medium hover:scale-100 hover:bg-transparent"
                : "font-light",
            )}
            onClick={() => handleCategory(data)}
          >
            {categoryToText(data)}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default function BlogPost() {
  const { category } = useBlogCategory();
  const { data, fetchNextPage, hasNextPage, isFetching, isError, error } =
    trpc.blogposts.get.useInfiniteQuery(
      { category },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  if (isError) {
    return (
      <div className="text-red-500">
        Une erreur est survenue : {error.message}
      </div>
    );
  }

  const handleFetchNextPage = async () => {
    if (hasNextPage) await fetchNextPage();
  };

  // Vérifier si `data` existe et s'assurer qu'il est bien défini
  const posts = data?.pages?.flatMap((page) => page.items) ?? [];

  return (
    <ul className="relative grid h-fit w-full grid-cols-1 justify-around gap-4 pb-16 pt-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
          <li key={post.id}>
            <PostCard
              post={post}
              displayCategory={category === BlogCategory.ALL}
            />
          </li>
        ))}
      {isFetching &&
        Array.from({ length: 6 }).map((_, i) => (
          <li key={i} className="focus-visible:ring-primary">
            <PostSkeleton />
          </li>
        ))}
      <Button
        variant="outline"
        onClick={handleFetchNextPage}
        disabled={!hasNextPage || isFetching}
        className={cn(
          "absolute -bottom-8 left-1/2 -translate-x-1/2",
          !hasNextPage ? "hidden" : "",
        )}
      >
        Afficher plus
      </Button>
    </ul>
  );
}
