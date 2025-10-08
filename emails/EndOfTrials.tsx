import {
  Body,
  Column,
  Container,
  Font,
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
import { translateDayOfWeek, type EndOfTrialsProps } from "./utils";

export default function EndOfTrialTemplate({
  courses,
  price,
  memberId,
}: EndOfTrialsProps) {
  const previewText = `Fin des cours d'essaie, cotisation, règlement !`;

  const baseUrl = "https://templeteam.fr";

  const formatHour = (date: Date) => {
    return new Date(date).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const coursesName = courses.map((course) => course.name);

  const hasTempleRun = coursesName.includes("Temple Run");
  const hasTempleGym = coursesName.includes("Temple Gym");
  const hasTempleGymJunior = coursesName.includes("Temple Gym Junior");

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
                src={`${baseUrl}/public/img/logo-light.svg`}
                alt="Temple Team"
                width={100}
                className="mx-0 my-0 inline-block"
              />
              <Text className="mx-0 inline-block -translate-x-4 text-center text-3xl font-bold">
                emple Team
              </Text>
            </Section>

            <Hr />

            <Text>Bonjour, </Text>
            <Text>
              Nous vous rappelons que les séances d&apos;essai se terminent
              après ce samedi 11 octobre. Pour participer aux prochaines
              séances, il est désormais nécessaire que votre cotisation
              d&apos;un montant de{" "}
              <span className="font-semibold underline">{price} euros</span>{" "}
              soit réglée.
            </Text>

            {/* Section Vos cours */}
            <Section className="my-6">
              <Text className="mb-3 text-lg font-semibold">📋 Vos cours</Text>
              {courses.map((course, index) => (
                <Section
                  key={index}
                  className="mb-4 rounded border border-solid border-gray-100 bg-gray-50 p-3"
                >
                  <Text className="mb-3 border-b border-gray-200 pb-1 text-base font-semibold text-gray-800">
                    {course.name}
                  </Text>

                  {course.sessions.map((session, sIndex) => (
                    <Row
                      key={sIndex}
                      className={`px-1 py-2 ${
                        sIndex > 0
                          ? "mt-2 border-t border-dashed border-gray-300 pt-3"
                          : ""
                      } ${sIndex % 2 === 0 ? "bg-white" : "bg-gray-100"} rounded`}
                    >
                      <Column className="w-2/3">
                        <Text className="my-1 text-sm">
                          📅 {translateDayOfWeek(session.dayOfWeek)} • 🕐{" "}
                          {formatHour(session.startHour)} -{" "}
                          {formatHour(session.endHour)}
                        </Text>
                        <Text className="my-1 text-sm">
                          📍 {session.place}, {session.city}{" "}
                          {session.postalCode}
                        </Text>
                      </Column>
                      <Column className="w-1/3" align="center">
                        <Link
                          href={`https://www.google.com/maps/search/?api=1&query=${session.query}`}
                          className="inline-block rounded bg-blue-600 px-3 py-2 text-xs font-medium text-white"
                        >
                          📍 Itinéraire
                        </Link>
                      </Column>
                    </Row>
                  ))}
                </Section>
              ))}
            </Section>

            <Hr />

            {/* Section Modalités de paiement */}
            <Section className="my-6">
              <Text className="mb-3 text-lg font-semibold">
                💳 Modalités de paiement
              </Text>
              <Text>
                Vous pouvez effectuer le paiement par chèque ou virement
                bancaire. Les réductions familles ne sont pas incluses dans le
                tarif indiqué ci-dessus (celles-ci seront à voir directement
                lors des permanences).
              </Text>
              <Text>
                Si besoin, nous vous proposons la possibilité de payer en 3
                fois, 3 chèques différents encaissés en début de mois.
                Attention, les 3 chèques doivent nous être remis ensemble pour
                être acceptés. Sinon la cotisation est comptée comme impayée.
              </Text>
            </Section>

            <Hr />

            {/* Section Permanences */}
            <Section className="my-6">
              <Text className="mb-3 text-lg font-semibold">🏢 Permanences</Text>
              <Text>
                Des permanences seront mises en place les samedis suivants de
                19h à 19h30 pour l&apos;encaissement des cotisations :
              </Text>
              <Text className="ml-4 font-medium">
                • Samedi 11 octobre
                <br />
                • Samedi 18 octobre
                <br />• Samedi 25 octobre
              </Text>
            </Section>

            <Hr />

            {/* Section Certificat médical */}
            {/* Section Certificat médical */}
            <Section className="my-6">
              <Text className="mb-3 text-lg font-semibold">
                🏥 Certificat médical
              </Text>
              <Text className="mb-4">
                Merci de fournir votre certificat médical en cliquant sur le
                bouton ci-dessous :
              </Text>
              <Row>
                <Column align="center">
                  <Link
                    href={`${baseUrl}/association/inscription/${memberId}`}
                    className="inline-block rounded bg-blue-600 px-6 py-3 text-sm font-medium text-white"
                    style={{
                      backgroundColor: "#2563eb",
                      color: "#ffffff",
                      textDecoration: "none",
                      borderRadius: "6px",
                      padding: "12px 24px",
                      display: "inline-block",
                      fontSize: "14px",
                    }}
                  >
                    📋 Soumettre mon certificat médical
                  </Link>
                </Column>
              </Row>
            </Section>

            <Hr />

            {/* Section Groupes WhatsApp */}
            <Section className="my-6">
              <Text className="mb-3 text-lg font-semibold">
                💬 Groupes WhatsApp
              </Text>
              <Text className="mb-4">
                Pour une communication simplifiée, nous vous prions de bien
                rejoindre les groupes WhatsApp suivants :
              </Text>

              <Row className="gap-4">
                {hasTempleRun && (
                  <Column className="mb-4 px-2">
                    <Img
                      alt="QrCode - Groupe Whatsapp Temple Run"
                      className="mx-auto"
                      height={120}
                      width={120}
                      src="https://www.templeteam.fr/static/association/templeRun.jpg"
                    />
                    <Link
                      href="https://chat.whatsapp.com/IrBEQpo4Qrh9yc6vVBF7ub"
                      className="mt-3 block rounded bg-green-600 px-3 py-2 text-center text-xs font-medium text-white"
                      style={{
                        backgroundColor: "#25D366",
                        color: "#ffffff",
                        textDecoration: "none",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        display: "block",
                        marginTop: "12px",
                        textAlign: "center",
                        fontSize: "12px",
                      }}
                    >
                      💬 Rejoindre Temple Run
                    </Link>
                  </Column>
                )}
                {hasTempleGymJunior && (
                  <Column className="mb-4 px-2">
                    <Img
                      alt="QrCode - Groupe Whatsapp Temple Gym Junior"
                      className="mx-auto"
                      height={120}
                      width={120}
                      src="https://www.templeteam.fr/static/association/templeGymJunior.jpg"
                    />
                    <Link
                      href="https://chat.whatsapp.com/CF6sAgRyQ4e3a1tHv255Pm"
                      className="mt-3 block rounded bg-green-600 px-3 py-2 text-center text-xs font-medium text-white"
                      style={{
                        backgroundColor: "#25D366",
                        color: "#ffffff",
                        textDecoration: "none",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        display: "block",
                        marginTop: "12px",
                        textAlign: "center",
                        fontSize: "12px",
                      }}
                    >
                      💬 Rejoindre Temple Gym Junior
                    </Link>
                  </Column>
                )}
                {hasTempleGym && (
                  <Column className="mb-4 px-2">
                    <Img
                      alt="QrCode - Groupe Whatsapp Temple Gym"
                      className="mx-auto"
                      height={120}
                      width={120}
                      src="https://www.templeteam.fr/static/association/templeGym.jpg"
                    />
                    <Link
                      href="https://chat.whatsapp.com/DeEC4cgPNly2b7u0goOZej"
                      className="mt-3 block rounded bg-green-600 px-3 py-2 text-center text-xs font-medium text-white"
                      style={{
                        backgroundColor: "#25D366",
                        color: "#ffffff",
                        textDecoration: "none",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        display: "block",
                        marginTop: "12px",
                        textAlign: "center",
                        fontSize: "12px",
                      }}
                    >
                      💬 Rejoindre Temple Gym
                    </Link>
                  </Column>
                )}
              </Row>
            </Section>

            <Text className="mt-6">Sportivement,</Text>
            <Text className="font-semibold">L&apos;équipe Temple Team</Text>

            {/* Pied de page */}
            <Section className="rounded border border-solid border-gray-300 bg-neutral-100 px-6 py-4">
              <Row className="h-12">
                <Column>
                  <Link href="https://templeteam.fr" className="">
                    <Img
                      src={`${baseUrl}/public/img/logo-light.svg`}
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
                    exercer vos droits d&apos;accès, de suppression et de
                    rectification
                  </Link>{" "}
                  aux informations qui vous concernent.
                </Text>
              </Row>
              <Hr />
              <Text className="mx-auto mb-0 text-center text-xs text-neutral-500">
                Temple Team © 2025 • association sportive loi 1901 <br />{" "}
                Gymnase Pierre de Coubertin • 6 Rue George Sand • Voiron 38500
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

EndOfTrialTemplate.PreviewProps = {
  courses: [
    {
      name: "Temple Run",
      sessions: [
        {
          dayOfWeek: "Saturday",
          startHour: "1970-01-01T17:00:00.000Z",
          endHour: "1970-01-01T18:30:00.000Z",
          place: "Salle des prairies",
          city: "Voiron",
          postalCode: "38500",
          query: "temple-run",
        },
      ],
    },
  ],
  price: 340,
  memberId: "123456789",
};
