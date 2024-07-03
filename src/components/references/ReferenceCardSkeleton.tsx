import { Skeleton } from "../ui/skeleton";

export const ReferenceCardSkeleton = () => {
  return (
    <div className="group/item ease flex h-[100px] w-[280px] cursor-pointer items-center gap-5 rounded-xl px-4 py-2 shadow-lg dark:shadow-none dark:bg-card">
      <Skeleton className="min-h-14 min-w-14" />
      <div className="w-full flex flex-col gap-2 items-start justify-start translate-y-1">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
};
