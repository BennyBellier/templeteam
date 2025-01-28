import {
  Body,
  Column,
  Container,
  Head,
  Hr,
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
import { type RegistrationProps } from "./utils";
import { Gender } from "@prisma/client";
import type { RouterOutputs } from "@/server/api/root";
import { getPhoneData } from "@/components/ui/phone-input";

type Props = RouterOutputs["association"]["getConfirmationMailInformations"];

export default function RegistrationTemplate({
  photo,
  firstname,
  lastname,
  birthdate,
  phone,
  mail,
  gender,
  address,
  postalCode,
  city,
  country,
  medicalComment,
  legalGuardians,
  courses,
}: Props) {
  const previewText = `Nouvelle inscription : ${firstname} ${lastname}`;

  const baseUrl = "https://templeteam.fr";

  return (
    <Html lang="fr">
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mx-auto flex justify-center">
              <Img
                src={`${baseUrl}/static/img/logo/templeteam/header70-light.png`}
                alt="Temple Team"
                width={70}
                className="mx-0 my-0 inline-block"
              />
              <Text className="mx-0 ml-0.5 inline-block -translate-x-4 text-center text-3xl font-bold">
                emple Team
              </Text>
            </Section>

            <Hr />

            {/* Informations du membre */}
            <Section className="mb-4 rounded-lg border border-solid border-gray-300 p-4">
              <Text className="mb-2 font-bold">Informations du membre :</Text>
              <Row className="mb-2">
                <Img
                  src="cid:memberPhoto"
                  alt={`${lastname} ${firstname}`}
                  width="100"
                  height="100"
                  className="rounded-full object-contain text-sm leading-[100px] bg-neutral-100"
                />
              </Row>
              <Row className="mb-2">
                <Text className="m-0">
                  Nom : {firstname} {lastname}
                </Text>
              </Row>
              <Row className="mb-2">
                <Text className="m-0">
                  Email :{" "}
                  <Link
                    href={`mailto:${mail}`}
                    className="text-blue-500 underline"
                  >
                    {mail}
                  </Link>
                </Text>
              </Row>
              <Row className="mb-2">
                <Text className="m-0">Téléphone : {phone}</Text>
              </Row>
              <Row className="mb-2">
                <Text className="m-0">
                  Sexe :{" "}
                  {gender === Gender.Male
                    ? "Masculin"
                    : gender === Gender.Female
                      ? "Féminin"
                      : "Non spécifié"}
                </Text>
              </Row>
              <Row className="mb-2">
                <Text className="m-0">
                  Date de naissance :{" "}
                  {new Intl.DateTimeFormat("fr", { dateStyle: "long" }).format(
                    birthdate,
                  )}
                </Text>
              </Row>
              <Row className="mb-2">
                <Text className="m-0">
                  Adresse : {address}, {postalCode} {city}, {country}
                </Text>
              </Row>
            </Section>

            {/* Cours */}
            <Section className="mb-4 rounded-lg border border-solid border-gray-300 p-4">
              <Text className="mb-2 font-bold">Cours :</Text>
              {courses.map((course) => (
                <Row key={course} className="mb-2">
                  <Text className="m-0">{course}</Text>
                </Row>
              ))}
            </Section>

            {/* Informations médicales */}
            {medicalComment && (
              <Section className="mb-4 rounded-lg border border-solid border-gray-300 p-4">
                <Text className="mb-2 font-bold">Informations médicales :</Text>
                <Text className="m-0">{medicalComment}</Text>
              </Section>
            )}

            {/* Contacts d'urgence */}
            <Section className="mb-4 rounded-lg border border-solid border-gray-300 p-4">
              <Text className="mb-2 font-bold">Contacts d'urgence :</Text>
              {legalGuardians.map((lg) => {
                return (
                  <Row key={lg.phone} className="mb-2">
                    <Text className="m-0">
                      Contact 1 : {lg.lastname} {lg.firstname} - {"0" + lg.phone.substring(3)}
                    </Text>
                  </Row>
                );
              })}
            </Section>

            {/* Pied de page */}
            <Section className="mt-16 rounded border border-solid border-gray-300 bg-neutral-100 px-6 py-4">
              <Row className="h-12">
                <Column>
                  <Link href="https://templeteam.fr" className="">
                    <Img
                      src={`${baseUrl}/static/img/logo-light.png`}
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
                Temple Team © 2024 • association sportive loi 1901 <br /> 24
                Rue de Criel • Voiron 38500
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
  lastname: "TURING",
  birthdate: new Date("2002-01-01"),
  mail: "alan@example.com",
  phone: "+33612345678",
  gender: Gender.Male,
  address: "4 RUE WILFRID ET CONRAD KILIAN",
  city: "GRENOBLE",
  postalCode: "38000",
  country: "FRANCE",
  photo: null,
  medicalComment: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus voluptate eum nam dolor, libero sit dolores dolorem. Alias ullam dolorem perspiciatis placeat minus voluptates dicta pariatur enim qui, ducimus cumque.",
  courses: ["Temple Run", "Temple Gym"],
  legalGuardians: [
    {
      firstname: "Billy",
      lastname: "JONES",
      mail: "billy.jones@example.com",
      phone: "+33687654321",
    },
    {
      firstname: "Charlie",
      lastname: "BROWN",
      mail: "charlie.brown@example.com",
      phone: "+33698765432",
    },
  ],
  price: 200,
};