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
import { BlogCategory } from "@prisma/client";
import { Suspense, useState, useTransition } from "react";
import BlogPostsList from "./BlogListContent";
import PostSkeleton from "./PostSkeleton";

export default function Blog() {
  const [category, setCategory] = useState<BlogCategory | undefined>("ALL");
  const [page, setPage] = useState(0);
  const [isPending, startTransition] = useTransition();
  /* const { data, isLoading } = trpc.blogposts.get.useQuery({
    category,
    page,
  }); */

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
        {/* <ul className="flex h-fit w-full flex-wrap justify-around gap-4 pt-6">
          {data?.map((post) => (
            <li key={post.id}>
              <PostCard
                post={post}
                displayCategory={category === BlogCategory.ALL}
              />
            </li>
          ))}
        </ul> */}
        {/* {data?.length === 0 ? (
          <Alert>
            <AlertTriangle />
            <AlertTitle>Aucun post n&apos;est disponible</AlertTitle>
          </Alert>
        ) : (
          <Button variant="ghost" className="self-center justify-self-center">
            Pagination
          </Button>
        )} */}
        <ul className="relative flex h-fit w-full flex-wrap justify-around gap-4 pt-6 pb-16">
        <Suspense fallback={Array.from({ length: 6 }).map((_, i) => (
          <PostSkeleton key={i} />
        ))}>
          <BlogPostsList category={category ?? "ALL"} />
        </Suspense>
        </ul>
      </LayoutSection>
    </Layout>
  );
}
