import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function PostSkeleton() {
  return (
    <Card className="hover:bg-accent ">
      <CardHeader className="space-y-0 overflow-hidden px-0 pt-0 rounded-b-none">
        <Skeleton className="h-48" />
      </CardHeader>
      <CardContent className="flex flex-col gap-6 pb-6 px">
        <Skeleton className="h-12 w-72" />
        <Skeleton className="h-24 w-72" />
      </CardContent>
      <Separator orientation="horizontal" />
      <CardFooter className="flex flex-row justify-between py-2 font-thin">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-6 w-12" />
      </CardFooter>
    </Card>
  );
}