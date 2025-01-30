"use client"

import { ReferenceCardSkeleton } from "@/components/references/ReferenceCardSkeleton";
import ReferenceCard from "@/components/references/referenceCard";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/TrpcProvider";
import { useReferenceCategory } from "./template";
import { useEffect, useRef, useCallback, useMemo } from "react";
import { useInView } from "framer-motion";

function CategorySelector() {
    const { category, setCategory } = useReferenceCategory();
    const categoriesQuery = trpc.references.getCategory.useSuspenseQuery();
    const categories = categoriesQuery[0];

    const handleCategory = (newCategory: number) => {
      if (category === newCategory) setCategory(null);
      else setCategory(newCategory);
    };

    return (
      <aside
        className={cn(
          "flex max-w-36 flex-col items-center gap-2 rounded-xl bg-muted/50 lg:bg-transparent",
        )}
      >
        <Typography as="h1" variant="h3">
          Catégories
        </Typography>
        {categories?.map((data) => (
          <Button
            key={data.id}
            variant="ghost"
            className={cn(
              "text-md ease font-light hover:scale-x-110 hover:scale-y-105 hover:bg-transparent",
              category === data.id
                ? "font-medium hover:scale-x-90 hover:scale-y-95"
                : "",
            )}
            onClick={() => handleCategory(data.id)}
          >
            {data.name}
          </Button>
        ))}
      </aside>
    );
  }

export default function ReferencesWithSelectors() {
    const { category } = useReferenceCategory();
  const buttonRef = useRef(null);
  const isInView = useInView(buttonRef, {});

  const query = trpc.references.get.useSuspenseInfiniteQuery(
    {
      category,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
  const references = useMemo(() => query[0].pages, [query]);

  const handleFetchNextPage = useCallback(async () => {
    if (query[1].hasNextPage) await query[1].fetchNextPage();
  }, [query]);

  useEffect(() => {

    if (isInView) {
      void handleFetchNextPage();
    }
  }, [isInView, handleFetchNextPage]);

    return (<>
        <CategorySelector />
        <ul className="relative grid h-fit w-full grid-cols-1 justify-around gap-4 pb-16 pt-6 md:grid-cols-2 lg:grid-cols-3">
          {references?.map((page) => {
            return page.items.map((reference) => (
              <li key={reference.id}>
                <ReferenceCard reference={reference} />
              </li>
            ));
          })}
          {query[1].isFetching &&
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
            disabled={!query[1].hasNextPage || query[1].isFetching}
            className={cn(
              "absolute -bottom-8 left-1/2 -translate-x-1/2",
              !query[1].hasNextPage ? "hidden" : "",
            )}
          >
            Afficher plus
          </Button>
        </ul></>);
}