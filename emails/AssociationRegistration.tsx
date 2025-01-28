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
  Font,
} from "@react-email/components";
import { Facebook, Instagram, Youtube } from "lucide-react";

const sectionClassName =
  "mb-4 rounded-lg border border-solid border-gray-300 p-2";
const sectionTitleClassName = "m-0 mb-1 font-bold";

interface RegistrationProps {
  firstname: string;
  lastname: string;
  birthdate: Date;
  gender: "Male" | "Female" | "NotSpecified";
  mail: string | null;
  phone: string | null;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  medicalComment: string | null;
  legalGuardians: {
    firstname: string;
    lastname: string;
    phone: string;
    mail: string | null;
  }[];
  courses: string[];
}

export default function RegistrationTemplate({
  firstname,
  lastname,
  birthdate,
  gender,
  mail,
  phone,
  address,
  city,
  postalCode,
  country,
  medicalComment,
  legalGuardians,
  courses,
}: RegistrationProps) {
  const phoneParser = (phone: string) => "0" + phone.substring(3);

  const previewText = `Confirmation de l'inscription de ${firstname} ${lastname}`;

  return (
    <Html lang="fr">
      <Head>
        <Font
          fontFamily="Rubik"
          fallbackFontFamily={["Arial", "serif"]}
          webFont={{
            url: "https://fonts.gstatic.com/s/rubik/v28/iJWKBXyIfDnIV7nBrXw.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mx-auto flex justify-center">
              <Img
                src={`https://templeteam.fr/static/img/logo/templeteam/header70-light.png`}
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
            <Section className={sectionClassName}>
              <Text className={sectionTitleClassName}>
                Informations du membre :
              </Text>
              <Row className="mb-2">
                <Column className="w-[70px]">
                  <Img
                    src="cid:photo"
                    alt={`${lastname[0]}${firstname[0]}`}
                    width="70"
                    height="70"
                    className="rounded-full bg-neutral-100 object-contain pr-2 text-center text-sm leading-[70px]"
                  />
                </Column>
                <Column className="m-0 ml-1.5">
                  <Text className="m-0 mb-0.5 text-base font-semibold">
                    {lastname} {firstname}
                  </Text>
                  <Text className="m-0 text-xs text-neutral-500">
                    Né(e) le{" "}
                    {new Intl.DateTimeFormat("fr", {
                      dateStyle: "long",
                    }).format(birthdate)}{" "}
                    -{" "}
                    {gender === "Male"
                      ? "Masculin"
                      : gender === "Female"
                        ? "Féminin"
                        : "Non spécifié"}
                  </Text>
                </Column>
              </Row>
              <Row className="mb-2">
                <Text className="m-0 font-semibold">Email :</Text>
                <Text className="m-0">{mail ?? "non renseigné"}</Text>
              </Row>
              <Row className="mb-2">
                <Text className="m-0 font-semibold">Téléphone :</Text>
                <Text className="m-0">
                  {phone ? phoneParser(phone) : "Non renseigné"}
                </Text>
              </Row>
              <Row className="mb-2">
                <Text className="m-0 font-semibold">Adresse :</Text>
                <Text className="m-0 text-sm">
                  {address} <br />
                  {postalCode} {city} <br />
                  {country}
                </Text>
              </Row>
            </Section>

            {/* Cours */}
            <Section className={sectionClassName}>
              <Text className={sectionTitleClassName + " flex"}>Cours :</Text>
              <Row>
                {courses.map((course) => (
                  <Column key={course} className="m-0 w-fit">
                    <Text className="mx-auto w-fit rounded-md bg-neutral-950 px-2.5 py-0.5 text-xs font-semibold text-neutral-50">
                      {course}
                    </Text>
                  </Column>
                ))}
              </Row>
            </Section>

            {/* Informations médicales */}
            {medicalComment && (
              <Section className={sectionClassName}>
                <Text className={sectionTitleClassName}>
                  Informations médicales :
                </Text>
                <Text className="m-0">{medicalComment}</Text>
              </Section>
            )}

            {/* Contacts d'urgence */}
            <Section className={sectionClassName}>
              <Text className={sectionTitleClassName}>
                Contacts d&apos;urgence :
              </Text>
              <Row>
                {legalGuardians.map((lg) => {
                  return (
                    <Container key={lg.phone} className="mb-2">
                      <Row className="mb-1">
                        <Text className="m-0 font-semibold italic">
                          {lg.lastname} {lg.firstname}
                        </Text>
                      </Row>
                      <Row className="mb-1 text-xs">
                        Tél: {phoneParser(lg.phone)}
                      </Row>
                      <Row className="text-xs">Email: {lg.mail}</Row>
                    </Container>
                  );
                })}
              </Row>
            </Section>

            {/* Pied de page */}
            <Section className="mt-16 rounded border border-solid border-gray-300 bg-neutral-100 px-6 py-4">
              <Row className="h-12">
                <Column>
                  <Link href="https://templeteam.fr" className="">
                    <Img
                      src={`https://templeteam.fr/static/img/logo/templeteam/header70-light.png`}
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
                Temple Team © 2024 • association sportive loi 1901 <br />{" "}
                Gymnase Pierre de Coubertin - 6 Rue George Sand • Voiron 38500
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
  gender: "Male",
  address: "4 RUE WILFRID ET CONRAD KILIAN",
  city: "GRENOBLE",
  postalCode: "38000",
  country: "FRANCE",
  photo: null,
  medicalComment:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus voluptate eum nam dolor, libero sit dolores dolorem. Alias ullam dolorem perspiciatis placeat minus voluptates dicta pariatur enim qui, ducimus cumque.",
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
