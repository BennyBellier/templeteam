"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useStepper } from "@/components/ui/stepper";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormCard } from "../formCard";
import StepperFormActions from "../StepperFormActions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Rocket } from "lucide-react";
import { trpc } from "@/trpc/TrpcProvider";
import { useRegisterFormStore } from "@/stores/registerFormStore";
import useStore from "@/stores/useStore";
import { Course, Prisma } from "@prisma/client";

/* --------------------------------------------------------
            Localisation element for First Form
   -------------------------------------------------------- */

const LocationInfo = Prisma.validator<Prisma.CourseLocationDefaultArgs>()({
  omit: {
    id: true,
    createdAt: true,
    updatedAt: true,
  }
});

function Localisation({
  location 
}: {location: Prisma.CourseLocationGetPayload<LocationInfo>}) {
  const isMac =
    typeof window !== "undefined"
      ? navigator.userAgent.toUpperCase().indexOf("MAC") >= 0
      : false;

  return (
    <div className="col-start-2 row-span-2 row-start-1 flex w-full flex-col items-center justify-center gap-1">
      {isMac ? (
        <a
          target="_blank"
          href={`http://maps.apple.com/?${location.appleLocation}`}
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
          href={`https://www.google.com/maps/search/?api=1&${location.googleLocation}`}
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
 *                          Schema
   -------------------------------------------------------- */

export const CoursesSchema = z.object({
  checkboxes: z
  .array(z.boolean())
  .min(1, "Veuillez sélectionner au moins 1 cours.")
  .refine((checkboxes) => checkboxes.some((checked) => checked), {
    message: "Veuillez sélectionner au moins 1 cours."
  })
});

/* --------------------------------------------------------
 *                          Form
   -------------------------------------------------------- */

export default function Courses() {
  const { nextStep } = useStepper();
  const [coursesQuery] = trpc.association.getCourses.useSuspenseQuery();
  const { setCourses, courses } = useStore(
    useRegisterFormStore.getState,
    (state) => state,
  );

  const form = useForm<z.infer<typeof CoursesSchema>>({
    resolver: zodResolver(CoursesSchema),
    resetOptions: {
      keepDirtyValues: true,
    },
    defaultValues: {
      checkboxes: new Array(coursesQuery.length).fill(false);
    },
    shouldFocusError: true,
  });

  const onSubmit = async (data: z.infer<typeof CoursesSchema>) => {
    const checkedCourses: Record<string, boolean>[] = coursesQuery.map((course, index) => {
        [course.name]: data.checkboxes[index] ?? false
    });

    setCourses(checkedCourses);
    nextStep();
  };

  return (
    <Form {...form}>
      <form
        id="registerForm"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormCard
          title="Adhésion"
          description="Choisissez le cours où vous souhaitez vous inscrire."
          button={<StepperFormActions />}
          classNames={{ Card: "max-w-[750px]" }}
        >
          <Alert>
            <Rocket className="h-4 w-4" />
            <AlertTitle>Pour toute pré-inscription</AlertTitle>
            <AlertDescription>
              La licence est offert (soit 20 €) !
            </AlertDescription>
          </Alert>

          {coursesQuery.map((course, index) => (
             <FormField
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
                        {course.schedule.map((schedule) => (
                          <Typography
                          variant="base"
                          className="col-start-1 row-start-2 self-start font-light"
                        >
                          {`${schedule.dayOfWeek} - ${schedule.startHour}/${schedule.endHour}`}
                        </Typography>
                        ))}
                       </div>
                       <Typography
                         as="p"
                         variant="base"
                         className="col-start-1 row-start-2"
                       >
                        {course.description}
                         {/* Votre enfant souhaite découvrir le Parkour (art du
                         déplacement) en intérieur, comme en extérieur ? Encadré,
                         on sera l&apos;accompagné dans la découverte de ce sport
                         qui est le nôtre ! */}
                       </Typography>
                     </div>
                     <Localisation
                       location={course.location}
                     />
                   </div>
                 </FormLabel>
                 <FormMessage />
               </FormItem>
             )}
           />
          ))}

          <FormField
            control={form.control}
            name="templeRun"
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
                      Temple Run
                    </Typography>
                    <div className="flex flex-col gap-2 font-normal">
                      <Typography
                        variant="base"
                        className="col-start-1 row-start-2 self-start font-light"
                      >
                        Samedi - 17h30/18h30
                      </Typography>
                      <Typography
                        as="p"
                        variant="base"
                        className="col-start-1 row-start-2"
                      >
                        Votre enfant souhaite découvrir le Parkour (art du
                        déplacement) en intérieur, comme en extérieur ? Encadré,
                        on sera l&apos;accompagné dans la découverte de ce sport
                        qui est le nôtre !
                      </Typography>
                    </div>
                    <Localisation
                      place="Salle des Prairies"
                      city="Voiron"
                      postalCode="38500"
                      locationQuery={{
                        apple:
                          "address=22%20Av.%20Fran%C3%A7ois%20Mitterrand,%2038500%20Voiron",
                        google:
                          "query=22%20Av.%20Fran%C3%A7ois%20Mitterrand,%2038500%20Voiron",
                      }}
                    />
                  </div>
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="templeGymJunior"
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
                      Temple Gym Junior{" "}
                      <Typography as="span" className="pl-2 text-primary">
                        de 6 a 13 ans
                      </Typography>
                    </Typography>
                    <div className="flex flex-col gap-2 font-normal">
                      <Typography
                        variant="base"
                        className="col-start-1 row-start-2 self-start font-light"
                      >
                        Samedi - 19h/20h15
                      </Typography>
                      <Typography
                        as="p"
                        variant="base"
                        className="col-start-1 row-start-2"
                      >
                        Une salle spécialisée gymnastique, de quoi vous
                        entraîner et essayer tout ce qui vous passe par la tête
                        sans vous blesser !
                      </Typography>
                    </div>
                    <Localisation
                      place="Gymnase Pierre de Coubertin"
                      city="Voiron"
                      postalCode="38500"
                      locationQuery={{
                        apple:
                          "address=Gymnase%20Pierre%20de%20Coubertin,%206%20Rue%20George%20Sand,%2038500%20Voiron",
                        google:
                          "query=Gymnase%20Pierre%20de%20Coubertin,%206%20Rue%20George%20Sand,%2038500%20Voiron",
                      }}
                    />
                  </div>
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="templeGym"
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
                      Temple Gym{" "}
                      <Typography as="span" className="pl-2 text-primary">
                        14 ans et +
                      </Typography>
                    </Typography>
                    <div className="flex flex-col gap-2 font-normal">
                      <Typography
                        variant="base"
                        className="col-start-1 row-start-2 self-start font-light"
                      >
                        Samedi - 20h15/21h45
                      </Typography>
                      <Typography
                        as="p"
                        variant="base"
                        className="col-start-1 row-start-2"
                      >
                        Une salle spécialisée gymnastique, de quoi vous
                        entraîner et essayer tout ce qui vous passe par la tête
                        sans vous blesser !
                      </Typography>
                    </div>
                    <Localisation
                      place="Gymnase Pierre de Coubertin"
                      city="Voiron"
                      postalCode="38500"
                      locationQuery={{
                        apple:
                          "address=Gymnase%20Pierre%20de%20Coubertin,%206%20Rue%20George%20Sand,%2038500%20Voiron",
                        google:
                          "query=Gymnase%20Pierre%20de%20Coubertin,%206%20Rue%20George%20Sand,%2038500%20Voiron",
                      }}
                    />
                  </div>
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormCard>
      </form>
    </Form>
  );
}