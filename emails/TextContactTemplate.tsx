import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { type ContactProps } from "./utils";

export default function TextContactTemplate({
  name,
  mail,
  subject,
  message,
}: ContactProps) {
  const formatedDate = new Intl.DateTimeFormat("fr", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(Date.now());

  const previewText = `Contact depuis le site web par ${name}`;

  return (
    <Html lang="fr">
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body>
          <Container>
            <Section>
              <Text>Temple Team</Text>
            </Section>

            <Hr />

            {/* Mail informations */}
            <Section>
              <Row>J
                <Text>Nom : {name}</Text>
              </Row>
              <Row>
                <Text>
                  Email :{" "}
                  <Link
                    href={`mailto:${mail}`}
                    className="text-blue-500 underline"
                  ></Link>
                </Text>
              </Row>
              <Row>
                <Column>
                  <Text>Émis le {formatedDate}</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text>Sujet : {subject}</Text>
                </Column>
              </Row>
            </Section>

            {/* Mail Content */}
            <Section>
              <Text>Message :</Text>
              <Text>{message}</Text>
            </Section>

            <Hr />

            <Section>
              <Row>
                <Column>
                  <Text>Temple Team</Text>
                  <Text>
                    La <Link href="templeteam.fr"></Link> s&apos;occupe de tout!
                  </Text>
                  <Text>
                    Découvrez la Temple Team, un collectif de 7 athlètes
                    spécialisés dans le parkour, le freerunning, la gymnastique
                    et le tricking.
                  </Text>
                </Column>
                <br/>
                <br/>
                <Column>
                  <Text>Nos réseaux :</Text>
                  <Text>
                    Youtube : <Link href="youtube.com/@TempleTeam" />
                  </Text>
                  <Text>
                    Instagram <Link href="instagram.com/templeteam.off" />
                  </Text>
                  <Text>
                    Facebook <Link href="facebook.com/templeteam.off" />
                  </Text>
                </Column>
              </Row>
              <Hr />
              <Row>
                <Column>
                  <Text>Protection des données :</Text>
                </Column>
                <Column>
                  CGU :{" "}
                  <Link
                    href="https://templeteam.fr/cgu"
                  />{" "}
                  | Politique de confidentialité :{" "}
                  <Link
                    href="https://templeteam.fr/pdc"
                  />
                </Column>
              </Row>
              <Row>
                <Text>
                  Conformément au règlement général sur la protection des
                  données à caractère personnel du 25 mai 2018, vous pouvez
                  exercer vos droits d’accès, de suppression et de rectification
                  aux informations qui vous concernent par mail à l&apos;adresse{" "}
                  <Link href="mailto:support@templeteam.fr" />.
                </Text>
              </Row>
              <Hr />
              <Text>
                Temple Team © 2024 • association sportive loi 1901 | 24 Rue de
                Criel • Voiron 38500
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

TextContactTemplate.PreviewProps = {
  name: "alanturing",
  mail: "alan@example.com",
  subject: "Demande d'informations",
  message:
    "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam ut beatae ab autem voluptas! Maiores id pariatur, odit repellat iste tempore in magni vel saepe, commodi ipsa. Et, reiciendis distinctio.",
};
