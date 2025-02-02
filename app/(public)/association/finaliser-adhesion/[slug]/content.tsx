"use client";

import { trpc } from "@/trpc/TrpcProvider";
import { useMemo } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPhoneData } from "@/components/ui/phone-input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { Gender, Prisma } from "@prisma/client";
import {
  AlertTriangle,
  Book,
  Calendar,
  FileText,
  Home,
  Mail,
  Phone,
  Stethoscope,
} from "lucide-react";
import { FormCompletion } from "./form";

const MemberAllInformations = Prisma.validator<Prisma.MemberDefaultArgs>()({
  omit: {
    createdAt: true,
    updatedAt: true,
  },
  include: {
    files: {
      select: {
        id: true,
        medicalCertificate: true,
        courses: {
          select: {
            name: true,
          },
        },
      },
    },
    legalGuardians: {
      omit: {
        id: true,
        createdAt: true,
        updatedAt: true,
      },
    },
  },
});

type MemberAllInformations = Prisma.MemberGetPayload<
  typeof MemberAllInformations
>;

export const Content = ({ memberId }: { memberId: string }) => {
  const { data, isLoading, error, refetch } =
    trpc.association.getMemberResume.useQuery({ memberId });

  const handleRefetch = async () => {
    await refetch();
  };

  if (isLoading) {
    return (
      <>
        <Card
          className={cn(
            "ease flex h-full w-full flex-col overflow-hidden transition-transform duration-500",
          )}
        >
          <Skeleton className="h-[28rem] w-full" />
        </Card>
        <Card
          className={cn(
            "ease flex h-full w-full flex-col overflow-hidden transition-transform duration-500",
          )}
        >
          <Skeleton className="h-[500px] w-full" />
        </Card>
      </>
    );
  }

  if (error ?? !data ?? !data.files[0]) {
    console.log(error);
    return (
      <>
        <span>content.tsx</span>
        <ErrorComponents />
      </>
    );
  }

  return (
    <>
      <FormCompletion
        memberId={memberId}
        fileId={data.files[0]?.id}
        photoExist={!!data.photo}
        medicExist={!!data.files[0]?.medicalCertificate}
        refetch={handleRefetch}
      />
      <MemberCard member={data} />
    </>
  );
};

const MemberCard = ({ member }: { member: MemberAllInformations }) => {
  const gender = useMemo(() => {
    switch (member?.gender) {
      case Gender.Male:
        return "Masculin";

      case Gender.Female:
        return "Féminin";

      default:
        return "Non spécifié";
    }
  }, [member?.gender]);

  return (
    <Card className="mx-auto w-full min-w-52 max-w-xl">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage
            src={`/static/association/members/${member.id}/photos/${member.photo}`}
            alt={`${member?.lastname} ${member?.firstname}`}
          />
          <AvatarFallback className="capitalize">{`${member?.lastname.charAt(0)}${member?.firstname.charAt(0)}`}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-2xl">{`${member.firstname} ${member.lastname}`}</CardTitle>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Né(e) le {member.birthdate?.toLocaleDateString()} - {gender}
          </p>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-2">
          <Home className="h-4 w-4 text-muted-foreground" />
          <span>
            {member.address + ", " + member.postalCode + " " + member.city}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{member.mail ?? "Non renseigné"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>
            {member?.phone
              ? "0" + getPhoneData(member?.phone).nationalNumber
              : "Non renseigné"}
          </span>
        </div>
        <Separator />
        <div>
          <h3 className="mb-2 flex items-center gap-2 font-semibold">
            <Book className="h-4 w-4" />
            Cours
          </h3>
          <div className="flex flex-wrap gap-2">
            {member.files[0]?.courses.map((course) => (
              <Badge variant="secondary" key={course.name}>
                {course.name}
              </Badge>
            ))}
          </div>
        </div>
        <Separator />
        <div>
          <h3 className="mb-2 flex items-center gap-2 font-semibold">
            <Stethoscope className="h-4 w-4" />
            Commentaires médicaux
          </h3>
          <p className="text-sm">{member.medicalComment}</p>
        </div>
        <div>
          <h3 className="mb-2 flex items-center gap-2 font-semibold">
            <FileText className="h-4 w-4" />
            Certificat médical
          </h3>
          <p
            className={`text-sm ${!member.files[0]?.medicalCertificate && "text-destructive"}`}
          >
            {member.files[0]?.medicalCertificate ? "Reçu !" : "Manquant !"}
          </p>
        </div>
        <Separator />
        <div>
          <h3 className="mb-2 flex items-center gap-2 font-semibold">
            <AlertTriangle className="h-4 w-4" />
            Contacts d&apos;urgence
          </h3>
          <ul className="flex flex-wrap gap-4">
            {member.legalGuardians?.map((legalGuardian) => (
              <li key={`${legalGuardian.lastname} ${legalGuardian.firstname}`}>
                <Typography className=" text-foreground-muted font-medium italic">{`${legalGuardian.lastname} ${legalGuardian.firstname}`}</Typography>
                <Typography>
                  Tél:{" "}
                  {legalGuardian.phone
                    ? "0" + getPhoneData(legalGuardian.phone).nationalNumber
                    : "Non renseigné"}
                </Typography>
                <Typography>
                  Email: {legalGuardian.mail ?? "Non renseigné"}
                </Typography>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export const ErrorComponents = () => (
  <Alert variant="destructive" className="mx-auto max-w-lg">
    <AlertTriangle className="h-6 w-6" />
    <AlertTitle>L&apos;adhérent n&apos;existe pas !</AlertTitle>
    <AlertDescription>
      Veuillez réessayer ou contactez un administrateur.
    </AlertDescription>
  </Alert>
);
