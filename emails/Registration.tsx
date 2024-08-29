import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { baseUrl, type RegistrationProps } from "./utils";

export default function RegistrationTemplate({
  firstname,
  lastname,
  birthdate,
  mail,
  Phone,
  Sexe,
  Address,
  City,
  CodePostal,
  Country,
  PictureFile,
  EmergencyContactName1,
  EmergencyContactPhone1,
  EmergencyContactName2,
  EmergencyContactPhone2,
  MedicalComment,
}: RegistrationProps) {
  const formatedDate = new Intl.DateTimeFormat('fr', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date());

  const previewText = `Nouvelle inscription : ${firstname} ${lastname}`;
  
  const baseUrl = 'https://templeteam.fr';

  return (
    <Html lang="fr">
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mx-auto flex justify-center">
              <Img
                src={`${baseUrl}/img/logo-light.png`}
                alt="Temple Team"
                width={100}
                className="mx-0 my-0 inline-block"
              />
              <Text className="mx-0 inline-block -translate-x-4 text-center text-3xl font-bold">
                emple Team
              </Text>
            </Section>

            <Hr />

            {/* Informations du membre */}
            <Section className="border border-solid border-gray-300 rounded-lg p-4 mb-4">
              <Text className="font-bold mb-2">Informations du membre :</Text>
              <Row className="mb-2">
                <Text className="m-0">Nom : {firstname} {lastname}</Text>
              </Row>
              <Row className="mb-2">
                <Text className="m-0">Email : <Link href={`mailto:${mail}`} className="text-blue-500 underline">{mail}</Link></Text>
              </Row>
              <Row className="mb-2">
                <Text className="m-0">Téléphone : {Phone}</Text>
              </Row>
              <Row className="mb-2">
                <Text className="m-0">Sexe : {Sexe}</Text>
              </Row>
              <Row className="mb-2">
                <Text className="m-0">Date de naissance : {new Intl.DateTimeFormat('fr', { dateStyle: 'long' }).format(birthdate)}</Text>
              </Row>
              <Row className="mb-2">
                <Text className="m-0">Adresse : {Address}, {CodePostal} {City}, {Country}</Text>
              </Row>
            </Section>

            {/* Informations médicales */}
            {MedicalComment && (
              <Section className="border border-solid border-gray-300 rounded-lg p-4 mb-4">
                <Text className="font-bold mb-2">Informations médicales :</Text>
                <Text className="m-0">{MedicalComment}</Text>
              </Section>
            )}

            {/* Contacts d'urgence */}
            <Section className="border border-solid border-gray-300 rounded-lg p-4 mb-4">
              <Text className="font-bold mb-2">Contacts d'urgence :</Text>
              <Row className="mb-2">
                <Text className="m-0">Contact 1 : {EmergencyContactName1} - {EmergencyContactPhone1}</Text>
              </Row>
              <Row className="mb-2">
                <Text className="m-0">Contact 2 : {EmergencyContactName2} - {EmergencyContactPhone2}</Text>
              </Row>
            </Section>

            {/* Pied de page */}
            <Section className="mt-16 rounded bg-neutral-100 px-6 py-4 border border-solid border-gray-300">
              <Row className="h-12">
                <Column>
                  <Link href="https://templeteam.fr" className="">
                    <Img
                      src={`${baseUrl}/img/logo-light.png`}
                      width={50}
                      className="mr-0 inline-block"
                    />
                    <Text className="ml-0 inline-block -translate-x-2 font-bold text-black">
                      emple Team
                    </Text>
                  </Link>
                </Column>
                <Column className="flex h-full items-center justify-end gap-2">
                  <Link
                    href="https://youtube.com/@TempleTeam"
                    className="text-black"
                  >
                    <Youtube size={24} />
                  </Link>
                  <Link
                    href="https://instagram.com/templeteam.off"
                    className="text-black"
                  >
                    <Instagram size={20} />
                  </Link>
                  <Link
                    href="https://facebook.com/templeteam.off"
                    className="text-black"
                  >
                    <Facebook size={19} />
                  </Link>
                </Column>
              </Row>
              <Row>
                <Column className="flex w-full justify-center gap-2 text-xs">
                  <Link
                    href="https://templeteam.fr/cgu"
                    className="h-full border-y-0 border-l-0 border-r border-solid border-neutral-400 pr-2 text-neutral-500"
                  >
                    CGU
                  </Link>
                  <Link
                    href="https://templeteam.fr/pdc"
                    className="text-neutral-500"
                  >
                    Politique de confidentialité
                  </Link>
                </Column>
              </Row>
              <Row>
                <Text className="text-xs text-neutral-500">
                  Conformément au règlement général sur la protection des
                  données à caractère personnel du 25 mai 2018, vous pouvez{" "}
                  <Link
                    href="mailto:support@templeteam.fr"
                    className="underline"
                  >
                    exercer vos droits d’accès, de suppression et de
                    rectification
                  </Link>{" "}
                  aux informations qui vous concernent.
                </Text>
              </Row>
              <Hr />
              <Text className="mx-auto mb-0 text-center text-xs text-neutral-500">
                Temple Team © 2024 • association sportive loi 1901 <br /> 24 Rue de Criel • Voiron 38500
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

RegistrationTemplate.PreviewProps = {
  firstname: "Alan",
  lastname: "Turing",
  birthdate: Date.now(),
  mail: "alan@example.com",
  Phone: "0600000000",
  Sexe: "M",
  Address: "Cette rue",
  City: "Grenoble",
  CodePostal: "38000",
  Country: "France",
  PictureFile: null,
  EmergencyContactName1: "Emergency 1",
  EmergencyContactPhone1: "0600000000",
  EmergencyContactName2: "Emergency 2",
  EmergencyContactPhone2: "0600000000",
  MedicalComment:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus voluptate eum nam dolor, libero sit dolores dolorem. Alias ullam dolorem perspiciatis placeat minus voluptates dicta pariatur enim qui, ducimus cumque.",
};
