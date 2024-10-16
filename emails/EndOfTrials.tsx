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
import { calculCotisation, type EndOfTrialsProps } from "./utils";

export default function EndOfTrialTemplate({
  cours,
  memberId,
}: EndOfTrialsProps) {
  const previewText = `Fin de la période d'essaie !`;

  const baseUrl = "https://templeteam.fr";

  const cotisation = calculCotisation(cours);

  return (
    <Html lang="fr">
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mx-auto flex justify-center">
              <Img
                src={`${baseUrl}/static/img/logo/templeteam/logo-light.svg`}
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
              Nous vous rappelons que les séances d&apos;essai sont
              officiellement terminées, et nous vous informons que pour
              participer aux prochaines séances, il est désormais nécessaire que
              votre cotisation d&apos;un montant de{" "}
              <span className="font-semibold underline">
                {cotisation} euros
              </span>{" "}
              soit réglée.
            </Text>
            <Text>
              Vous pouvez effectuer le paiement par chèque ou virement bancaire.
              Les réductions familles et/ou ancien adhérent ne sont inclus dans
              le tarif indiqué ci-dessus (celle-ci seront à voir directement
              lors des permanences).
            </Text>
            <Text>
              Si besoin, nous vous proposons la possibilité de payer en 3 fois,
              3 chèques différents encaissés en début de mois. Attention, les 3
              chèques doivent nous être remis ensemble pour être acceptés. Sinon
              la cotisation est compté comme impayé.
            </Text>
            <Text>
              Une permière permanence sera mises en place le samedi 19 et
              octobre de 19 h à 19 h 30 pour l&apos;encaissement des
              cotisations.
            </Text>
            <Text>
              Nous vous prions aussi, dès que vous en avez la possibilité, de
              remplir le formulaire à l&apos;adresse suivante, permettant de
              compléter les pièces manquantes du dossier (certificat médical et
              photo) :
              <Link
                href={`https://preinscription.templeteam.fr/finaliser-adhesion?id=${memberId}`}
                className="mt-0 inline-block"
              >
                Formulaire des pièces complémentaires
              </Link>
            </Text>

            <Text>
              Pour une communication simplifié, nous vous prions de bien
              rejoindre les groupes whatsapp suivant :
            </Text>

            <Section>
              <Row className="border-spacing-3">
                {cours.templeRun && (<Column>
                  <Img
                    alt="QrCode - Groupe Whatsapp Temple Run"
                    className="mx-auto"
                    height={150}
                    src="https://preinscription.templeteam.fr/public/static/association/templeRun.jpg"
                  />
                  <Link
                    href="https://chat.whatsapp.com/IrBEQpo4Qrh9yc6vVBF7ub"
                    className="mt-0 inline-block text-sm text-center w-full"
                  >
                    Temple Run 17h - 18h30
                  </Link>
                </Column>)}
                {cours.templeGymJunior && (<Column>
                  <Img
                    alt="QrCode - Groupe Whatsapp Temple Run"
                    className="mx-auto"
                    height={150}
                    src="https://preinscription.templeteam.fr/public/static/association/templeGymJunior.jpg"
                  />
                  <Link
                    href="https://chat.whatsapp.com/CF6sAgRyQ4e3a1tHv255Pm"
                    className="mt-0 inline-block text-sm text-center w-full"
                  >
                    Temple Gym Junior 19h - 20h15
                  </Link>
                </Column>)}
                {cours.templeGym && (<Column>
                  <Img
                    alt="QrCode - Groupe Whatsapp Temple Run"
                    className="mx-auto"
                    height={150}
                    src="https://preinscription.templeteam.fr/public/static/association/templeGym.jpg"
                  />
                  <Link
                    href="https://chat.whatsapp.com/DeEC4cgPNly2b7u0goOZej"
                    className="mt-0 inline-block text-sm text-center w-full"
                  >
                    Temple Gym 20h15 - 21h15
                  </Link>
                </Column>)}
              </Row>
            </Section>

            <Text>
              Par ailleurs, nous regrettons de devoir annuler le cours Temple
              Break le vendredi de 17 h à 18 h en raison d&apos;un manque
              d&apos;inscrit.
            </Text>

            <Text>Sportivement,</Text>

            {/* Pied de page */}
            <Section className="rounded border border-solid border-gray-300 bg-neutral-100 px-6 py-4">
              <Row className="h-12">
                <Column>
                  <Link href="https://templeteam.fr" className="">
                    <Img
                      src={`${baseUrl}/static/img/logo/templeteam/logo-light.svg`}
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

EndOfTrialTemplate.PreviewProps = {
  cours: {
    templeGym: true,
    templeRun: true,
  },
  memberId: "123456789",
};
