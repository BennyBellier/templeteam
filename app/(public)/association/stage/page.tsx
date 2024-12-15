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
        <Layout>
      <LayoutHeader>
        <LayoutTitle>Stages</LayoutTitle>
        <LayoutDescription>
        Envie d&apos;essayer, inscrivez-vous pour le prochain stage !
        </LayoutDescription>
      </LayoutHeader>
      <LayoutSection className="gap-6 justify-start">
        <Typography as="p" variant="base">
        La <strong>Temple Team</strong> propose des stages d&apos;apprentissage de parkour en extérieur (si la météo est clémente). Nous vous apprendrons les bases en toute sécurité, voire plus si vous vous débrouillez bien.
        </Typography>
        <Typography as="p" variant="base">
        <strong>En participant au stage découverte de parkour, vous reconnaissez avoir pris connaissance des conditions de pratique suivantes :</strong> le parkour est un sport mêlant course, saut, franchissement, escalade et conditionnement physique. Il se pratique principalement en extérieur sur du mobilier urbain, des murets et des murs pouvant atteindre 3 mètres de hauteur. Il peut être pratiqué par tous sans distinction d&apos;âge ni de sexe. Toutefois, le parkour est une discipline sportive et sa pratique est déconseillée aux personnes souffrant d&apos;une contre-indication à la pratique du sport. Les échauffements sont obligatoires, surtout après un arrêt prolongé.
        </Typography>
        <Typography as="p" variant="base">
        <strong>Les sauts de hauteur importante et les mouvements acrobatiques sont réservés aux pratiquants expérimentés.</strong> Ils supposent de maîtriser les mouvements de base et de bien connaître ses propres limites. Le pratiquant doit s&apos;assurer de la solidité de l&apos;obstacle sur lequel il s&apos;exerce. Les autres usagers du lieu d&apos;entraînement (piétons, vélos, etc.) ont la priorité. Il est interdit de pratiquer sur ou dans des lieux privés sans autorisation. Il est conseillé de porter des vêtements confortables (type jogging), des chaussures de sport (type basket) et de retirer les bijoux (bracelet, bague, collier), surtout s&apos;ils sont précieux. Lors de la pratique, il est possible que les vêtements soient mouillés, salis ou griffés. Le partage d&apos;expérience, l&apos;entraide, le respect pour soi-même et pour les autres pratiquants, ainsi que la cohabitation harmonieuse avec les autres usagers de l&apos;espace public, sont une composante essentielle de la discipline.
        </Typography>
        <Typography as="p" variant="base">
        L&apos;association Temple Team se réserve le droit de refuser l&apos;accès aux stages et/ou entraînements à toutes personnes dont le comportement constituerait une mise en danger de soi-même, des autres pratiquants ou spectateurs ou qui perturberait le bon déroulement de la session.
        </Typography>
        <Typography as="p" variant="base" className="self-start">
        Vous devez posséder une assurance responsabilité civile pour participer à la session.
        </Typography>
        <Typography as="p" variant="base" className="font-medium">
        Afin de permettre le bon déroulement de la session, les parents et accompagnants seront priés de ne rester que spectateurs lors de la session et ne devront en aucun cas perturber la session en cours.
        </Typography>
        <Typography as="h3" variant="h3" className="self-start">
        ANNULATION DE LA SESSION
        </Typography>
        <Typography as="p" variant="base">
        La session est susceptible d&apos;être annulée ou reportée en cas de restrictions sanitaires ou en cas de météo défavorable. Si tel est le cas, les participants seront prévenus au plus tard 1h avant le début de la session par SMS.
        </Typography>
      </LayoutSection>
    </Layout>
    );
}