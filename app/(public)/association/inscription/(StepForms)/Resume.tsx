import { Typography } from "@/components/ui/typography";
import {
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRegisterFormStore } from "@/stores/registerFormStore";
import { Gender } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

export default function Resume() {
  const { member, legalGuardians, authorization } = useRegisterFormStore(
    (state) => state,
  );

  const photo = member ? URL.createObjectURL(member?.photo) : "";

  let gender: string;
  switch (member?.gender) {
    case Gender.Male:
      gender = "Masculin";
      break;

    case Gender.Female:
      gender = "Féminin";
      break;

    default:
      gender = "Non spécifié";
      break;
  }

  return (
    <>
      <CardHeader className="flex-none pb-2 pt-4">
        <Typography as={CardTitle} variant="h1" className="lg:text-4xl">
          Résumé
        </Typography>
      </CardHeader>
      <CardContent className="grid h-full gap-4 sm:gap-6">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage
              src={photo}
              alt={`${member?.lastname} ${member?.firstname}`}
            />
            <AvatarFallback className="capitalize">{`${member?.lastname.charAt(0)}${member?.firstname.charAt(0)}`}</AvatarFallback>
          </Avatar>
          <div>
            <Typography variant="large">
              {member?.lastname} {member?.firstname}
            </Typography>
            <Typography variant="muted">
              Né(e) le {member?.birthdate.toLocaleDateString()} - {gender}
            </Typography>
          </div>
        </div>
        <div className="flex flex-wrap gap-6"><div>
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
            {member?.phone ?? "Non renseigné"}
          </Typography>
        </div></div>
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
              information médicale
            </Typography>
            <Typography variant="small">{member?.medicalComment}</Typography>
          </div>
        )}
        {legalGuardians?.length && legalGuardians.length > 0 && (
          <div>
            <Typography
              variant="large"
              className="text-foreground-muted text-base"
            >
              Responsables légaux
            </Typography>
            {legalGuardians?.map((legalGuardian) => (
              <div key={`${legalGuardian.lastname} ${legalGuardian.firstname}`}>
                <Typography
                  variant="large"
                  className="text-foreground-muted"
                >{`${legalGuardian.lastname} ${legalGuardian.firstname}`}</Typography>
                <Typography>Tél: {legalGuardian.phone}</Typography>
                {legalGuardian.mail && (
                  <Typography>Email: {legalGuardian.mail}</Typography>
                )}
              </div>
            ))}
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
        <Image
          src={authorization?.signature ?? ""}
          alt="signature"
          width={200}
          height={75}
          className="justify-center"
        />
      </CardContent>
    </>
  );
}
