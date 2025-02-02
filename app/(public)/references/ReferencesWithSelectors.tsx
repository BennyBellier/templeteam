"use client";

import { ReferenceCardSkeleton } from "@/components/references/ReferenceCardSkeleton";
import ReferenceCard from "@/components/references/referenceCard";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/TrpcProvider";
import { useReferenceCategory } from "./template";
import { useEffect, useRef, useCallback, memo } from "react";
import { useInView } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export const CategorySelector = memo(function CategorySelector() {
  const { category: currentCategory, setCategory } = useReferenceCategory();
  const { data, isLoading } = trpc.references.getCategory.useQuery();

  const handleCategory = useCallback((newCategory: number) => {
    if (currentCategory === newCategory) setCategory(null);
    else setCategory(newCategory);
  }, [currentCategory, setCategory]);

  return (
    <aside
      className={cn(
        "flex max-w-36 flex-col items-center gap-2 rounded-xl bg-muted/50 lg:bg-transparent",
      )}
    >
      <Typography as="h1" variant="h3">
        Catégories
      </Typography>
      {isLoading &&
        Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-12" />
        ))}
      {!isLoading &&
        data?.map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            className={cn(
              "text-md ease font-light hover:scale-x-110 hover:scale-y-105 hover:bg-transparent",
              currentCategory === category.id
                ? "font-medium hover:scale-x-90 hover:scale-y-95"
                : "",
            )}
            onClick={() => handleCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
    </aside>
  );
});

export default function ReferencesWithSelectors() {
  const { category } = useReferenceCategory();
  const buttonRef = useRef(null);
  const isInView = useInView(buttonRef, {});

  const { data, fetchNextPage, hasNextPage, isFetching, isError, error } =
    trpc.references.get.useInfiniteQuery(
      {
        category,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const handleFetchNextPage = useCallback(async () => {
    if (hasNextPage) await fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  useEffect(() => {
    if (isInView) {
      void handleFetchNextPage();
    }
  }, [isInView, handleFetchNextPage]);

  if (isError) {
    return (
      <div className="text-red-500">
        Une erreur est survenue : {error.message}
      </div>
    );
  }

  const references = data?.pages?.flatMap((page) => page.items) ?? [];

  return (
    <ul className="relative grid h-fit w-full grid-cols-1 justify-around gap-4 pb-16 pt-6 md:grid-cols-2 lg:grid-cols-3">
      {references?.map((reference) => (
        <li key={reference.id}>
          <ReferenceCard reference={reference} />
        </li>
      ))}
      {isFetching &&
        references.length === 0 &&
        Array.from({ length: 6 }).map((_, i) => (
          <li key={i}>
            <ReferenceCardSkeleton />
          </li>
        ))}
      <Button
        ref={buttonRef}
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
