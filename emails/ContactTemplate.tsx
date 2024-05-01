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
  Text
} from "@react-email/components";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { baseUrl, type ContactProps } from "./utils";

export default function ContactTemplate({ name, mail, subject, message }: ContactProps) {
  const formatedDate = new Intl.DateTimeFormat("fr", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(Date.now());

  const previewText = `Contact depuis le site web par ${name}`

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

            {/* Mail informations */}
            <Section>
              <Row className="mb-1 mt-2">
                <Text className="m-0">Nom : {name}</Text>
              </Row>
              <Row className="my-1">
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
              <Row className="my-1">
                <Column>
                  <Text className="m-0">Émis le {formatedDate}</Text>
                </Column>
              </Row>
              <Row className="mt-1 mb-2">
                <Column>
                  <Text className="m-0">Sujet : {subject}</Text>
                </Column>
              </Row>
            </Section>

            {/* Mail Content */}
            <Section className="rounded border border-solid border-[#eaeaea] pl-2">
              <Text className="my-2">Message :</Text>
              <Text className="mb-2 mt-0">{message}</Text>
            </Section>

            <Section className="mt-16 rounded bg-neutral-100 px-6 py-4">
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

ContactTemplate.PreviewProps = {
  name: "alanturing",
  mail: "alan@example.com",
  subject: "Demande d'informations",
  message:
    "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam ut beatae ab autem voluptas! Maiores id pariatur, odit repellat iste tempore in magni vel saepe, commodi ipsa. Et, reiciendis distinctio.",
};