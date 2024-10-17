import {
    Layout,
    LayoutDescription,
    LayoutHeader,
    LayoutSection,
    LayoutTitle,
  } from "@/components/layout/layout";
import { Typography } from "@/components/ui/typography";
import Link from "next/link";
import Image from "next/image";

export default function Stage() {
    return(
        <Layout noContact noReferences>
      <LayoutHeader>
        <LayoutTitle>Mentions légales</LayoutTitle>
        <LayoutDescription>
        Consultez les mentions légales du site de l'association Temple Team pour en savoir plus sur nos conditions d'utilisation et les obligations légales à respecter.
        </LayoutDescription>
      </LayoutHeader>
      <LayoutSection className="gap-6 justify-start items-start">
        <Typography as="p" variant="base" className="text-center">
        Le présent site web, accessible à l'adresse <Link href="/">https://www.templeteam.fr</Link>, est édité par l'association Temple Team (loi 1901), domiciliée à 28 Rue de Criel 38500 Voiron.
        </Typography>
        <Typography as="p" variant="base">
        Directeur de la publication : Mr. Benjamin BELLIER
        </Typography>

        {/* Conception et hébergement */}
        <article className="flex flex-col gap-4">
        <Typography as="h1" variant="h2" className="text-md">Conception et hébergement</Typography>
        <Typography as="p" variant="base" className="leading-relaxed">
        Le site web de l'association Temple Team a été conçu par Benjamin Bellier.
        <br/>
        Github : <a href="https://www.github.com/BennyBellier">www.github.com/BenyBellier</a>
        <br/>
        Contact : <a href="mailto:Benjamin%20Bellier?benny.bellier@gmail.com">benny.bellier@gmail.com</a>
        </Typography>
        <Typography as="p" variant="base" className="leading-relaxed flex gap-2" >
        L'hébergement du site web est assuré par :
        <a href="https://www.o2switch.fr" className="-translate-y-3">
            <Image src="/img/host_logo.svg"
                alt="Logo de l'hébergeur"
                width={240}
                height={54}
                className="w-36 object-contain"/>
            </a>
        </Typography>
        </article>

        {/* Images */}
        <article className="flex flex-col gap-4">
        <Typography as="h1" variant="h2" className="text-md">Images</Typography>
        <Typography as="p" variant="base" className="leading-relaxed">
        Les images utilisées sur le site web de l'association Temple Team sont soit la propriété de l'association Temple Team, soit utilisées avec l'accord de leurs propriétaires. Toute utilisation non autorisée des images est interdite et peut entraîner des poursuites.
        </Typography>
        </article>

        {/* Condition d'utilisation */}
        <article className="flex flex-col gap-4">
        <Typography as="h1" variant="h2" className="text-md">Conditions d'utilisation</Typography>
        <Typography as="p" variant="base" className="leading-relaxed">
            En utilisant ce site, le visiteur reconnaît avoir eu la possibilité de prendre connaissance des conditions d&apos;utilisation.
            <br/>
            La Temple Team s&apos;efforce d&apos;assurer au mieux de ses possibilités, l&apos;exactitude et la mise à jour des informations diffusées sur ce site, dont elle se réserve le droit de corriger, à tout moment et sans préavis, le contenu. Toutefois, nous ne pouvons garantir l&apos;exactitude, la précision ou l&apos;exhaustivité des informations mises à la disposition sur ce site. En conséquence, Temple Team décline toute responsabilité :
            <ul className="list-disc translate-x-4">
                <li>pour toute interruption du site ;</li>
                <li>survenance de bogues ;</li>
                <li>pour toute inexactitude ou omission portant sur des informations disponibles sur le site ;</li>
                <li>pour tous dommages résultant d&apos;une intrusion frauduleuse d&apos;un tiers ayant entraîné une modification des informations mises à la disposition sur le site ;</li>
                <li>et plus généralement de tout dommage direct et indirect, quelles qu&apos;en soient les causes, origines, natures ou conséquences et ce y compris notamment les coûts pouvant survenir du fait de l&apos;acquisition de biens proposés sur le site, les pertes de profits, de clientèle, de données ou tout autre perte de biens incorporels pouvant survenir à raison de l&apos;accès de quiconque au site, de l&apos;impossibilité d&apos;y accéder ou du crédit accordé à une quelconque information provenant directement ou indirectement de ce dernier.</li>
            </ul>
        </Typography>
        </article>

        {/* Avis de non responsabilité */}
        <article className="flex flex-col gap-4">
        <Typography as="h1" variant="h2" className="text-md">Avis de non-responsabilité</Typography>
        <Typography as="p" variant="base" className="leading-relaxed">
            Le site web de l'association Temple Team contient des liens vers d'autres sites web. L'association n'est pas responsable du contenu de ces sites web et ne peut garantir l'exactitude ou la fiabilité des informations qui y figurent. L'utilisation de ces sites web se fait aux risques et périls de l'utilisateur.
        </Typography>
        </article>

        {/* Droit de propriété */}
        <article className="flex flex-col gap-4">
        <Typography as="h1" variant="h2" className="text-md">Droit de propriété</Typography>
        <Typography as="p" variant="base" className="leading-relaxed">
            Le site web de l'association Temple Team, ainsi que son contenu (textes, images, logos, etc.) sont la propriété exclusive de l'association ou de ses partenaires, et sont protégés par les lois en vigueur relatives à la propriété intellectuelle. Toute reproduction, représentation, modification, publication ou adaptation, partielle ou intégrale, du site web ou de son contenu, sans l'autorisation préalable et écrite de l'association ou de ses partenaires, est strictement interdite et peut entraîner des poursuites.
        </Typography>
        </article>

        {/* Crédits photos et sources */}
        <article className="flex flex-col gap-4">
            <Typography as="h1" variant="h2" className="text-md">Crédits photos et sources</Typography>
            <Typography as="p" variant="base" className="leading-relaxed">
                Les photos utilisées sur le site web de l'association Temple Team sont créditées lorsque cela est possible. Si vous constatez une erreur ou une omission dans la mention des crédits photos ou des sources, n'hésitez pas à nous contacter à l'adresse <a href="mailto:Temple%20Team?contact@templeteam.fr?subject=[Crédits%20photos%20et%20sources]%20">contact@templeteam.fr</a>.
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