"use client";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/ui/typography";
import { uploadFile } from "@/lib/uploadFile";
import { calculateAge, cn, handleResult } from "@/lib/utils";
import { useRegisterFormStore } from "@/stores/registerFormStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type z from "zod";
import Authorization from "./(StepForms)/Authorization";
import Courses from "./(StepForms)/Courses";
import LegalGuardians from "./(StepForms)/LegalGuardians";
import Member from "./(StepForms)/Member";
import Resume from "./(StepForms)/Resume";
import {
  type AuthorizationSchema,
  type CoursesProps,
  type CoursesSchema,
  type LegalGuardiansSchema,
  type MemberSchema,
  useStepper,
} from "./formUtils";
import { registerMemberForYear } from "./registerMember";

export default function RegisterForm({ courses }: { courses: CoursesProps[] }) {
  const stepper = useStepper();
  const store = useRegisterFormStore((state) => state);
  const { scrollTo } = useScrollArea();

  const form = useForm({
    mode: "onTouched",
    resolver: zodResolver(stepper.current.schema),
    defaultValues: {
      courses: courses.map((course) => store.courses?.[course.name] ?? false),
      ...store.member,
      birthdate: store.member?.birthdate ?? undefined,
      photo: null,
      country: store.member?.country ?? "France",
      legalGuardians: store.legalGuardians ?? [
        {
          firstname: undefined,
          lastname: undefined,
          phone: "",
          mail: undefined,
        },
      ],
      ...store.authorization,
      undersigner: store.authorization?.undersigner,
    },
  });

  const onSubmit = async (values: z.infer<typeof stepper.current.schema>) => {
    switch (stepper.current.id) {
      case "courses":
        const data = values as z.infer<typeof CoursesSchema>;
        const coursesSelected: Record<string, boolean> = courses.reduce(
          (acc, course, index) => ({
            ...acc,
            [course.name]: data.courses[index],
          }),
          {},
        );
        store.setCourses(coursesSelected);
        stepper.next();
        break;

      case "informations":
        const memberInfo = values as z.infer<typeof MemberSchema>;
        const firstname =
          memberInfo.firstname.trim()[0]?.toUpperCase() +
          memberInfo.firstname.trim().slice(1);
        const lastname = memberInfo.lastname.trim().toUpperCase();
        const address = memberInfo.address.trim().toUpperCase();
        const city = memberInfo.city.trim().toUpperCase();
        const postalCode = memberInfo.postalCode.trim();
        const mail = memberInfo.mail === "" ? undefined : memberInfo.mail;
        const phone =
          memberInfo.phone && memberInfo.phone.length <= 3
            ? undefined
            : memberInfo.phone;

        if (memberInfo.photo[0]) {
          store.setMember({
            ...memberInfo,
            photo: memberInfo.photo[0],
            firstname,
            lastname,
            mail,
            phone,
            address,
            city,
            postalCode,
          });

          if (calculateAge(memberInfo.birthdate) >= 18) {
            stepper.goTo("authorization");
          } else {
            stepper.next();
          }
        }
        break;

      case "legalGuardians":
        const legalGuardiansValues = values as z.infer<
          typeof LegalGuardiansSchema
        >;
        const dataLegalGuardians = legalGuardiansValues.legalGuardians.map(
          (lg) => {
            const firstname =
              lg.firstname.trim()[0]?.toUpperCase() +
              lg.firstname.trim().slice(1);
            const lastname = lg.lastname.trim().toUpperCase();
            return {
              ...lg,
              firstname,
              lastname,
            };
          },
        );
        store.setLegalGuardians(dataLegalGuardians);
        stepper.next();
        break;

      case "authorization":
        const authorizationValues = values as z.infer<
          typeof AuthorizationSchema
        >;
        store.setAuthorization({ ...authorizationValues });
        stepper.next();
        break;

      case "resume":
        const toastId = toast.loading("Traitement de l'inscription...");

        if (!store.member) {
          toast.error("Vérifier que toutes les étapes soient bien remplies.");
          return;
        }

        const photo_filename = await handleResult(
          uploadFile(store.member.photo),
          toastId,
        );

        if (!photo_filename) return;

        const res = await handleResult(
          registerMemberForYear({
            member: store.member,
            photo: photo_filename,
            legalGuardians: store.legalGuardians,
            authorization: store.authorization,
            courseRecords: store.courses,
          }),
          toastId,
        );

        if (!res) return;

        toast.success(res, {
          id: toastId,
          duration: 3000,
        });

        // Registration success -> reset all state
        store.reset();
        stepper.reset();
        form.reset();
        break;

      default:
        break;
    }
    scrollTo(0, 190);
  };

  const onPrev = () => {
    switch (stepper.current.id) {
      case "authorization":
        if (!store.member?.birthdate) {
          stepper.goTo("informations");
        } else if (calculateAge(store.member.birthdate) >= 18) {
          stepper.goTo("informations");
        } else {
          stepper.prev();
        }
        break;

      default:
        stepper.prev();
        break;
    }
    scrollTo(0, 190);
  };

  return (
    <>
      <ol className="flex w-full gap-2 px-2 sm:px-6">
        {stepper.all.map((step, index) => {
          if (step.id === "informations") {
            return (
              <li
                key={step.id}
                className="relative flex w-full flex-1 flex-col gap-0.5"
              >
                <div className="relative flex">
                  <Separator
                    className={cn(
                      "h-0.5 w-1/2 bg-border",
                      index < stepper.current.index && "bg-blue-500",
                    )}
                  />
                  <Separator
                    className={cn(
                      "h-0.5 w-1/2 bg-border",
                      index + 1 < stepper.current.index && "bg-blue-500",
                    )}
                  />
                </div>
                <Typography
                  as="span"
                  className="w-fit text-[0.8rem] font-light"
                >
                  {step.label}
                </Typography>
              </li>
            );
          } else if (step.id !== "legalGuardians") {
            return (
              <li
                key={step.id}
                className="relative flex w-full flex-1 flex-col gap-0.5"
              >
                <Separator
                  className={cn(
                    "h-0.5 w-full bg-border",
                    index < stepper.current.index && "bg-blue-500",
                  )}
                />
                <Typography
                  as="span"
                  className="w-fit text-[0.8rem] font-light"
                >
                  {step.label}
                </Typography>
              </li>
            );
          }
          return null;
        })}
      </ol>
      <Form {...form}>
        <form id="registerForm" onSubmit={form.handleSubmit(onSubmit)}>
          <Card
            className={cn(
              "ease flex h-full w-full max-w-[750px] flex-col space-y-2 overflow-hidden transition-transform duration-500 sm:space-y-6",
            )}
          >
            {stepper.when("courses", () => (
              <Courses query={courses} />
            ))}
            {stepper.when("informations", () => (
              <Member />
            ))}
            {stepper.when("legalGuardians", () => (
              <LegalGuardians />
            ))}
            {stepper.when("authorization", () => (
              <Authorization />
            ))}
            {stepper.when("resume", () => (
              <Resume />
            ))}
            <CardFooter className={cn("mt-0 h-12 w-full rounded-none p-0")}>
              {!stepper.isFirst && (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    onPrev();
                  }}
                  variant="secondary"
                  className="h-full w-full rounded-b-lg rounded-l-none rounded-t-none hover:scale-100 focus-visible:scale-100 disabled:opacity-100"
                >
                  Precédent
                </Button>
              )}
              <Button
                type="submit"
                form="registerForm"
                className="h-full w-full rounded-b-lg rounded-l-none rounded-t-none hover:scale-100 focus-visible:scale-100 disabled:opacity-100"
              >
                {stepper.isFirst && "Commencer"}
                {stepper.isLast && "Valider"}
                {!(stepper.isFirst || stepper.isLast) && "Suivant"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
}
