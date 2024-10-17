import {
    Layout,
    LayoutDescription,
    LayoutHeader,
    LayoutSection,
    LayoutTitle,
  } from "@/components/layout/layout";
import { Typography } from "@/components/ui/typography";

export default function Stage() {
    return(
        <Layout noContact noReferences>
      <LayoutHeader>
        <LayoutTitle>Politique de confidentialité</LayoutTitle>
        <LayoutDescription>
        Découvrez la politique de confidentialité de l'association Temple Team pour comprendre comment nous protégeons vos données personnelles et respectons la réglementation en vigueur.
        </LayoutDescription>
      </LayoutHeader>
      <LayoutSection className="gap-6 justify-start items-start">
        <Typography as="p" variant="base" className="text-center">
            L'association <strong>Temple Team</strong> est soucieuse de protéger la vie privée et les données personnelles de ses utilisateurs. Nous nous engageons à respecter les lois en vigueur relatives à la protection des données personnelles, notamment le Règlement général sur la protection des données (RGPD).
        </Typography>

        {/* Collecte des données personnelles */}
        <article className="flex flex-col gap-4">
        <Typography as="h1" variant="h2" className="text-md">Collecte des données personnelles</Typography>
        <Typography as="p" variant="base" className="leading-relaxed">
            Lorsque vous utilisez notre site web, nous pouvons collecter certaines données personnelles vous concernant, telles que votre nom, votre adresse e-mail, votre numéro de téléphone, votre adresse IP ou d'autres informations similaires. Nous ne transférons ni ne vendons ces données à des tiers.
        </Typography>
        </article>

        {/* Utilisation des données personnelles */}
        <article className="flex flex-col gap-4">
        <Typography as="h1" variant="h2" className="text-md">Utilisation des données personnelles</Typography>
        <Typography as="p" variant="base" className="leading-relaxed">
            Les données personnelles collectées sont utilisées pour répondre à vos demandes, vous informer de nos activités et personnaliser votre expérience sur notre site web. Nous utilisons également ces données pour remplir nos obligations légales et réglementaires.
        </Typography>
        </article>

        {/* Cookies */}
        <article className="flex flex-col gap-4">
        <Typography as="h1" variant="h2" className="text-md">Cookies</Typography>
        <Typography as="p" variant="base" className="leading-relaxed">
            Le site web de Temple Team ne génère qu'un seul cookie qui a simplement pour but de retenir le thème d'affichage que l'utilisateur a sélectionné en dernier. Ces cookies ne sont pas implantés pour collecter des informations sur vous à d'autres fins, comme le marketing ou les analyses. Toutefois, la page de contact utilise des cookies tiers de Google pour faire fonctionner la carte interactive. Ces cookies tiers sont utilisés pour stocker des informations sur l'emplacement géographique de l'utilisateur, afin de pouvoir afficher la carte interactive correctement. Temple Team ne collecte ni ne transfère à aucun destinataire les données personnelles collectées par ces cookies tiers. Si vous avez des questions sur les cookies utilisés sur le site web de Temple Team, veuillez envoyer un e-mail à contact@templeteam.fr avec en début d'en-tête "[Confidentialité]".
        </Typography>
        </article>

        {/* Sécurité des données */}
        <article className="flex flex-col gap-4">
        <Typography as="h1" variant="h2" className="text-md">Sécurité des données</Typography>
        <Typography as="p" variant="base" className="leading-relaxed">
            Nous avons mis en place des mesures de sécurité techniques et organisationnelles appropriées pour protéger les données personnelles que nous collectons contre toute perte, destruction, altération, accès non autorisé ou divulgation. Nous ne conservons les données personnelles que pendant une durée nécessaire aux finalités pour lesquelles elles ont été collectées.
        </Typography>
        </article>

        {/* Vos droits */}
        <article className="flex flex-col gap-4">
        <Typography as="h1" variant="h2" className="text-md">Vos droits</Typography>
        <Typography as="p" variant="base" className="leading-relaxed">
        Vous disposez d'un droit d'accès, de rectification, de suppression, de limitation et d'opposition au traitement de vos données personnelles. Pour exercer ces droits ou pour toute question relative à la protection des données personnelles, vous pouvez nous contacter à l'adresse e-mail suivante : <a href="mailto:Temple%20Team?contact@templeteam.fr?subject=[Confidentialité]%20">contact@templeteam.fr en indiquant</a> <strong>"[Confidentialité] Votre objet"</strong> dans l'objet de votre message.
        </Typography>
        </article>

        {/* Modification de la politique de confidentialité */}
        <article className="flex flex-col gap-4">
            <Typography as="h1" variant="h2" className="text-md">Modification de la politique de confidentialité</Typography>
            <Typography as="p" variant="base" className="leading-relaxed">
                Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment, conformément aux lois en vigueur en matière de protection des données personnelles. Nous vous encourageons à consulter régulièrement cette page pour prendre connaissance des éventuelles modifications.
            </Typography>
        </article>

        {/* Lois applicables */}
        <article className="flex flex-col gap-4">
            <Typography as="h1" variant="h2" className="text-md">Lois applicables</Typography>
            <Typography as="p" variant="base" className="leading-relaxed">
                Le site web de l'association Temple Team est soumis aux lois en vigueur en France. Tout litige relatif à l'utilisation du site web sera soumis à la compétence des tribunaux français.
            </Typography>
        </article>
      </LayoutSection>
    </Layout>
    );
}