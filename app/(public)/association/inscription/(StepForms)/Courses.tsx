"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { cn, displayTime } from "@/lib/utils";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Rocket } from "lucide-react";
import { Prisma } from "@prisma/client";
import type { CoursesSchema } from "../page";
import type { z } from "zod";

/* --------------------------------------------------------
            Localisation element for First Form
   -------------------------------------------------------- */

const LocationInfo =
  Prisma.validator<Prisma.CourseSessionLocationDefaultArgs>()({
    omit: {
      id: true,
      createdAt: true,
      updatedAt: true,
    },
  });

function Localisation({
  location,
}: {
  location: Prisma.CourseSessionLocationGetPayload<typeof LocationInfo>;
}) {
  const isMac =
    typeof window !== "undefined"
      ? navigator.userAgent.toUpperCase().indexOf("MAC") >= 0
      : false;

  return (
    <div className="col-start-2 row-span-2 row-start-1 flex w-full flex-col items-center justify-center gap-1">
      {isMac ? (
        <a
          target="_blank"
          href={`http://maps.apple.com/?address=${location.query}`}
        >
          <Image
            src="/img/icon/apple_map_icon.png"
            alt="Bouton d'actions rapide apple maps"
            width="64"
            height="64"
            className="w-16 object-contain "
          />
        </a>
      ) : (
        <a
          target="_blank"
          href={`https://www.google.com/maps/search/?api=1&query=${location.query}`}
          className="w-14"
        >
          <Image
            src="/img/icon/google_map_icon.png"
            alt="Bouton d'actions rapide google maps"
            width="64"
            height="64"
            className="w-16 object-contain "
          />
        </a>
      )}
      <div className="flex flex-col justify-start gap-0.5">
        <Typography as="h3" variant="base" className="text-base font-normal">
          {location.place}
        </Typography>
        <Typography as="span" variant="base" className="font-light">
          {location.city}, {location.postalCode}
        </Typography>
      </div>
    </div>
  );
}

/* --------------------------------------------------------
 *                          Form
   -------------------------------------------------------- */

const coursesQueryProps = Prisma.validator<Prisma.CourseDefaultArgs>()({
  select: {
    name: true,
    description: true,
    info: true,
    sessions: {
      select: {
        id: true,
        dayOfWeek: true,
        startHour: true,
        endHour: true,
        location: {
          select: {
            place: true,
            city: true,
            postalCode: true,
            query: true,
          },
        },
      },
    },
  },
});



export default function Courses({
  query,
}: {
  query: Prisma.CourseGetPayload<typeof coursesQueryProps>[];
}) {
  const form = useFormContext<z.infer<typeof CoursesSchema>>();

  return (
    <>
      <CardHeader className="flex-none pb-2 pt-4">
        <Typography as={CardTitle} variant="h1" className="lg:text-4xl">
          Adhésion
        </Typography>
        <Typography as={CardDescription} variant="lead">
          Choisissez le cours où vous souhaitez vous inscrire.
        </Typography>
      </CardHeader>
      <CardContent className="grid h-full gap-6">
        <Alert>
          <Rocket className="h-4 w-4" />
          <AlertTitle>Pour toute pré-inscription</AlertTitle>
          <AlertDescription>
            La licence est offert (soit 20 €) !
          </AlertDescription>
        </Alert>

        {query?.map((course, index) => (
          <FormField
            key={course.name}
            control={form.control}
            name={`checkboxes.${index}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={cn(
                    "flex cursor-pointer items-center gap-4 rounded-lg border p-6",
                    field.value ? "border-primary" : "",
                  )}
                >
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="hidden"
                    />
                  </FormControl>
                  <div className="grid w-full grid-cols-[3fr_1fr] grid-rows-[1.75rem_auto] gap-2">
                    <Typography
                      as="h1"
                      variant="lead"
                      className={cn(
                        "col-span-2 col-start-1 row-start-1 text-foreground",
                        field.value ? "text-primary" : "",
                      )}
                    >
                      {course.name}
                    </Typography>
                    <div className="flex flex-col gap-2 font-normal">
                      <div className="flex gap-2">
                        {course.sessions.map((session) => (
                          <Typography
                            key={session.id}
                            variant="base"
                            className="col-start-1 row-start-2 self-start font-light"
                          >
                            {`${session.dayOfWeek} - ${displayTime(session.startHour)} / ${displayTime(session.endHour)} `}
                          </Typography>
                        ))}
                      </div>
                      <Typography
                        as="p"
                        variant="base"
                        className="col-start-1 row-start-2"
                      >
                        {course.description}
                      </Typography>
                    </div>
                    {course.sessions?.[0] && (
                      <Localisation location={course.sessions[0].location} />
                    )}
                  </div>
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </CardContent>
    </>
  );
}
