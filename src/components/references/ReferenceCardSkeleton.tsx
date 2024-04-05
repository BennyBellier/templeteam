import { CarouselItem } from "../ui/carousel";
import { Skeleton } from "../ui/skeleton";

export const ReferenceCardSkeleton = () => {
  return (
    <CarouselItem className="md:basis-1/2 lg:basis-1/3">
      <Skeleton className="group/item ease ease flex h-[100px] w-[280px] cursor-pointer gap-5 rounded-2xl bg-neutral-50 px-4 py-2 shadow-lg transition-transform duration-300 hover:scale-90 dark:bg-neutral-800 dark:shadow-none" />
    </CarouselItem>
  );
};
