"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/TrpcProvider";

export const SeasonMemberCounter = () => {
  const season = trpc.association.getCurrentSeason.useQuery();
  const membersCounter = trpc.association.dashboard.getSeasonMemberCount.useQuery({});

  return (
    <Card className={cn(season.isLoading || membersCounter.isLoading ? "animate-pulse" : "", "size-48")}>
      {!membersCounter.isLoading && (
        <>
          <Typography
            as={CardHeader}
            variant="h3"
            className="pt-2 text-center"
          >{`Saison ${season.data}`}</Typography>
          <Typography as={CardContent} variant="h2" className="text-center">
            {membersCounter.data}
          </Typography>
          <Typography
            as={CardFooter}
            variant="lead"
            className="w-full justify-center pb-2"
          >
            adhérents
          </Typography>
        </>
      )}
    </Card>
  );
};

export const SeasonMemberPerCoursesCounter = () => {
  const membersCounter = trpc.association.dashboard.getSeasonMemberPerCourses.useQuery(
    {},
  );

  return (
    <Card className={cn(membersCounter.isLoading ? "animate-pulse" : "")}>
      {!membersCounter.isLoading && (
        <>
          <Typography as={CardContent} variant="h2" className="text-center">
            {membersCounter.data?.map((val) => (
              <div key={`memberPerCourses${val.name}`}>
                <span>{`${val.name} ${val._count.Files}`}</span>
              </div>
            ))}
          </Typography>
        </>
      )}
    </Card>
  );
};
