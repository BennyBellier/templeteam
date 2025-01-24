import { Typography } from "@/components/ui/typography";
import {
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRegisterFormStore } from "@/stores/registerFormStore";
import { Gender } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";
import { getPhoneData } from "@/components/ui/phone-input";
import { createRegisterFormProxy } from "@/stores/registerFormStore";

export default function Resume() {
  const { courses, member, legalGuardians, authorization } = useRegisterFormStore((state) => state);

  const photo = useMemo(
    () => (member ? URL.createObjectURL(member?.photo) : ""),
    [member, member?.photo],
  );

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
    <>
      <CardHeader className="flex-none pb-2 pt-4">
        <Typography as={CardTitle} variant="h1" className="lg:text-4xl">
          Résumé
        </Typography>
      </CardHeader>
      <CardContent className="mx-auto grid h-full w-full gap-4 p-0 px-6 sm:gap-6">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage
              src={photo}
              alt={`${member?.lastname} ${member?.firstname}`}
            />
            <AvatarFallback className="capitalize">{`${member?.lastname.charAt(0)}${member?.firstname.charAt(0)}`}</AvatarFallback>
          </Avatar>
          <div>
            <Typography variant="large" className="w-full">
              {member?.lastname} {member?.firstname}
            </Typography>
            <Typography variant="muted">
              Né(e) le {member?.birthdate.toLocaleDateString()} - {gender}
            </Typography>
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          <div>
            <Typography
              variant="large"
              className="text-foreground-muted text-base"
            >
              Email
            </Typography>
            <Typography variant="small">
              {member?.mail ?? "Non renseigné"}
            </Typography>
          </div>
          <div>
            <Typography
              variant="large"
              className="text-foreground-muted text-base"
            >
              Téléphone
            </Typography>
            <Typography variant="small">
              {member?.phone
                ? "0" + getPhoneData(member?.phone).nationalNumber
                : "Non renseigné"}
            </Typography>
          </div>
        </div>
        <div className="space-y-2">
          <Typography
            variant="large"
            className="text-foreground-muted text-base"
          >
            Cours
          </Typography>
          <div className="flex flex-wrap gap-2">
            {Object.keys(courses!).map(
              (key) =>
                courses?.[key] && (
                  <Badge variant="secondary" key={key}>
                    {key}
                  </Badge>
                ),
            )}
          </div>
        </div>
        <div>
          <Typography
            variant="large"
            className="text-foreground-muted text-base"
          >
            Adresse
          </Typography>
          <Typography variant="small">
            {member?.address}
            <br />
            {`${member?.postalCode} ${member?.city}`}
            <br />
            {member?.country}
          </Typography>
        </div>
        {member?.medicalComment && (
          <div>
            <Typography
              variant="large"
              className="text-foreground-muted text-base"
            >
              Information médicale
            </Typography>
            <Typography variant="small">{member?.medicalComment}</Typography>
          </div>
        )}
        {legalGuardians?.length && legalGuardians.length > 0 && (
          <div>
            <Typography
              variant="large"
              className="text-foreground-muted pb-2 text-base"
            >
              Responsables légaux
            </Typography>
            <div className="flex flex-wrap gap-4">
              {legalGuardians?.map((legalGuardian) => (
                <div
                  key={`${legalGuardian.lastname} ${legalGuardian.firstname}`}
                >
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
                </div>
              ))}
            </div>
          </div>
        )}
        <Typography variant="large" className="text-foreground-muted text-base">
          Autorisations
        </Typography>
        <div className="grid gap-x-4 space-y-2 *:gap-2 sm:grid-cols-2">
          <div className="flex items-center">
            <Checkbox checked />
            <Typography variant="small">Urgence médicale</Typography>
          </div>
          <div className="flex items-center">
            <Checkbox checked />
            <Typography variant="small">Transport</Typography>
          </div>
          <div className="flex items-center">
            <Checkbox checked />
            <Typography variant="small">Droit à l&apos;image</Typography>
          </div>
          <div className="flex items-center">
            <Checkbox checked />
            <Typography variant="small">Non-responsabilité</Typography>
          </div>
          <div className="flex items-center">
            <Checkbox checked />
            <Typography variant="small">Non remboursement</Typography>
          </div>
          <div className="flex items-center">
            <Checkbox checked />
            <Typography variant="small">Réglement intérieur</Typography>
          </div>
        </div>
        <Typography variant="large" className="text-foreground-muted text-base">
          Signature
        </Typography>
        <Typography variant="small">
          Fait à {member?.city} le {new Date().toLocaleDateString()}
        </Typography>
        <Typography variant="small">
          {authorization?.undersigner}
        </Typography>
        <div className="relative h-24 w-24">
          <Image
            src={authorization?.signature ?? ""}
            alt="signature"
            fill
            className="aspect-square justify-center object-contain"
          />
        </div>
      </CardContent>
    </>
  );
}
