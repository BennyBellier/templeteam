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
import { Checkbox } from "@radix-ui/react-checkbox";
import Image from "next/image";

export default function Resume() {
  const { member, legalGuardians, authorization } = useRegisterFormStore((state) => state);

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
      <CardContent className="grid h-full gap-6">
        <Avatar>
          <AvatarImage
            src={photo}
            alt={`${member?.lastname} ${member?.firstname}`}
          />
          <AvatarFallback className="capitalize">{`${member?.lastname.charAt(0)}${member?.firstname.charAt(0)}`}</AvatarFallback>
        </Avatar>
        <Typography variant="large">
          {member?.lastname} {member?.firstname}
        </Typography>
        <Typography variant="muted">
          Né(e) le {member?.birthdate.toLocaleDateString()} - {gender}
        </Typography>
        <Typography variant="lead">Email</Typography>
        <Typography>{member?.mail ?? "Non renseigné"}</Typography>
        <Typography variant="lead">Téléphone</Typography>
        <Typography>{member?.phone ?? "Non renseigné"}</Typography>
        <Typography variant="lead">Adresse</Typography>
        <Typography>
          {member?.address}
          <br />
          {`${member?.postalCode} ${member?.city}`}
          <br />
          {member?.country}
        </Typography>
        {member?.medicalComment && (
          <>
            <Typography variant="lead">information médicale</Typography>
            <Typography>{member?.medicalComment}</Typography>
          </>
        )}
        {legalGuardians?.map((legalGuardian) => (
          <div key={`${legalGuardian.lastname} ${legalGuardian.firstname}`}>
            <Typography variant="lead">{`${legalGuardian.lastname} ${legalGuardian.firstname}`}</Typography>
            <Typography>Tél: {legalGuardian.phone}</Typography>
            {legalGuardian.mail && (
              <Typography>Email: {legalGuardian.mail}</Typography>
            )}
          </div>
        ))}
        <Typography variant="lead">Autorisations</Typography>
        <div>
          <div>
            <Checkbox checked />
            <Typography>Urgence médicale</Typography>
          </div>
          <div>
            <Checkbox checked />
            <Typography>Transport</Typography>
          </div>
          <div>
            <Checkbox checked />
            <Typography>Droit à l&apos;image</Typography>
          </div>
          <div>
            <Checkbox checked />
            <Typography>Non-responsabilité</Typography>
          </div>
          <div>
            <Checkbox checked />
            <Typography>Non remboursement</Typography>
          </div>
          <div>
            <Checkbox checked />
            <Typography>Non remboursement</Typography>
          </div>
          <div>
            <Checkbox checked />
            <Typography>Réglement intérieur</Typography>
          </div>
        </div>
        <Typography variant="lead">Signature</Typography>
        <Image src={authorization?.signature ?? ""} alt="signature" width={250} height={100} />
      </CardContent>
    </>
  );
}
