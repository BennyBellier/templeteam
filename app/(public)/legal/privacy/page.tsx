import {
  Layout,
  LayoutDescription,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
} from "@/components/layout/layout";
import { Typography } from "@/components/ui/typography";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Découvrez la politique de confidentialité de l'association Temple Team pour comprendre comment nous protégeons vos données personnelles et respectons la réglementation en vigueur.",
  authors: {
    name: "BELLIER Benjamin",
    url: "https://github.com/BennyBellier",
  },
  category: "sports",
};

export default function Legal() {
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Politique de confidentialité</LayoutTitle>
        <LayoutDescription>
          Découvrez la politique de confidentialité de l&apos;association Temple Team
          pour comprendre comment nous protégeons vos données personnelles et
          respectons la réglementation en vigueur.
        </LayoutDescription>
      </LayoutHeader>
      <LayoutSection className="items-start space-y-2">
        <Typography>
          L&apos;association <strong>Temple Team</strong> est soucieuse de protéger
          la vie privée et les données personnelles de ses utilisateurs. Nous
          nous engageons à respecter les lois en vigueur relatives à la
          protection des données personnelles, notamment le Règlement général
          sur la protection des données (RGPD).
        </Typography>
      </LayoutSection>
      <LayoutSection className="items-start space-y-2">
        <Typography variant="h3">Collecte des données personnelles</Typography>
        <Typography>
          Lorsque vous utilisez notre site web, nous pouvons collecter certaines
          données personnelles vous concernant, telles que votre nom, votre
          adresse e-mail, votre numéro de téléphone, votre adresse IP ou
          d&apos;autres informations similaires. Nous ne transférons ni ne vendons
          ces données à des tiers.
        </Typography>
      </LayoutSection>
      <LayoutSection className="items-start space-y-2">
        <Typography variant="h3">
          Utilisation des données personnelles
        </Typography>
        <Typography>
          Les données personnelles collectées sont utilisées pour répondre à vos
          demandes, vous informer de nos activités et personnaliser votre
          expérience sur notre site web. Nous utilisons également ces données
          pour remplir nos obligations légales et réglementaires.
        </Typography>
      </LayoutSection>
      <LayoutSection className="items-start space-y-2">
        <Typography variant="h3">Cookies</Typography>
        <Typography>
          Le site web de Temple Team ne génère qu&apos;un seul cookie qui a
          simplement pour but de retenir le thème d&apos;affichage que l&apos;utilisateur
          a sélectionné en dernier. Ces cookies ne sont pas implantés pour
          collecter des informations sur vous à d&apos;autres fins, comme le
          marketing ou les analyses. Toutefois, la page de contact utilise des
          cookies tiers de Google pour faire fonctionner la carte interactive.
          Ces cookies tiers sont utilisés pour stocker des informations sur
          l&apos;emplacement géographique de l&apos;utilisateur, afin de pouvoir afficher
          la carte interactive correctement. Temple Team ne collecte ni ne
          transfère à aucun destinataire les données personnelles collectées par
          ces cookies tiers. Si vous avez des questions sur les cookies utilisés
          sur le site web de Temple Team, veuillez envoyer un e-mail à
          contact@templeteam.fr avec en début d&apos;en-tête &quot;[Confidentialité]&quot;.
        </Typography>
      </LayoutSection>
      <LayoutSection className="items-start space-y-2">
        <Typography variant="h3">Sécurité des données</Typography>
        <Typography>
          Nous avons mis en place des mesures de sécurité techniques et
          organisationnelles appropriées pour protéger les données personnelles
          que nous collectons contre toute perte, destruction, altération, accès
          non autorisé ou divulgation. Nous ne conservons les données
          personnelles que pendant une durée nécessaire aux finalités pour
          lesquelles elles ont été collectées.
        </Typography>
      </LayoutSection>
      <LayoutSection className="items-start space-y-2">
        <Typography variant="h3">Vos droits</Typography>
        <Typography>
          Vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression, de
          limitation et d&apos;opposition au traitement de vos données personnelles.
          Pour exercer ces droits ou pour toute question relative à la
          protection des données personnelles, vous pouvez nous contacter à
          l&apos;adresse e-mail suivante :{" "}
          <strong>
            <a href="mailto:contact@templeteam.fr?subject=[Confidentialité]">
              contact@templeteam.fr
            </a>
          </strong>{" "}
          en indiquant <strong>&quot;[Confidentialité] Votre objet&quot;</strong> dans
          l&apos;objet de votre message.
        </Typography>
      </LayoutSection>
      <LayoutSection className="items-start space-y-2">
        <Typography variant="h3">
          Modification de la politique de confidentialité
        </Typography>
        <Typography>
          Nous nous réservons le droit de modifier cette politique de
          confidentialité à tout moment, conformément aux lois en vigueur en
          matière de protection des données personnelles. Nous vous encourageons
          à consulter régulièrement cette page pour prendre connaissance des
          éventuelles modifications.
        </Typography>
      </LayoutSection>
      <LayoutSection className="items-start space-y-2">
        <Typography variant="h3">Lois applicables</Typography>
        <Typography>
          Le site web de l&apos;association Temple Team est soumis aux lois en
          vigueur en France. Tout litige relatif à l&apos;utilisation du site web
          sera soumis à la compétence des tribunaux français.
        </Typography>
      </LayoutSection>
    </Layout>
  );
}
