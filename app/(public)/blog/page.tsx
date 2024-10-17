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
import PostCard from "./PostCard";
import PostSkeleton from "./PostSkeleton";
import { useBlogCategory } from "./template";

const BlogCategoryList = (): BlogCategory[] => {
  return Object.values(BlogCategory);
};

function CategorySelector() {
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
        {BlogCategoryList().map((data) => (
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

export default function Blog() {
  const { category } = useBlogCategory();
  const query = trpc.blogposts.get.useSuspenseInfiniteQuery(
    {
      category,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

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
        <CategorySelector />
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
              <li key={i} className="focus-visible:ring-primary">
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
