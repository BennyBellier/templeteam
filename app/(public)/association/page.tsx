import {
  Layout,
  LayoutDescription,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
} from "@/components/layout/layout";
import { Typography } from "@/components/ui/typography";
import Position from "./Position"

const data = [
  {
    status: "President",
    firstName: "Hugo",
    lastName: "Rival",
    picture: "Hugo.jpg"
  },
  {
    status: "Vice President",
    firstName: "Hugo",
    lastName: "Rival",
    picture: "Hugo.jpg"
  },
  {
    status: "Secretary",
    firstName: "Allan",
    lastName: "Escolano",
    picture: ""
  },
  {
    status: "Vice Secretary",
    firstName: "Romain",
    lastName: "Castillo",
    picture: "Romain.jpg"
  },
  {
    status: "Treasure",
    firstName: "Benjamin",
    lastName: "Bellier",
    picture: "Benjamin.jpg"
  },
];

export default function Association() {
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Association</LayoutTitle>
        <LayoutDescription>
        La Temple Team a créé sa propre association pour vous !
        </LayoutDescription>
      </LayoutHeader>
      <LayoutSection>
        <Typography as="article" variant="base" className="text-center lg:w-4/6 ">
            La <strong>Temple Team</strong> est une nouvelle association dans le bassin isérois.
Nous pratiquons l&apos;Acrobatie Urbaine.
Cet art du déplacement est une discipline sportive acrobatique consistant à se déplacer esthétiquement et efficacement d&apos;un point A à un point B en effectuant des mouvements rapides et agiles avec le corps.
Elle se pratique aussi bien en environnement urbain que dans la nature.
L&apos;essence de notre art, c&apos;est l&apos;adaptation.
Nous proposons différents cours accessibles à tous les âges.</Typography>
      </LayoutSection>
      <LayoutSection className="flex flex-col bg-accent gap-12">
        <Typography as="h1" variant="h1" className="uppercase tracking-wide">Bureau</Typography>
        <div className="flex flex-col gap-6 w-3/5">
          {data.map((position, idx) => (
            <Position key={position.status + idx} id={idx} index={idx} position={position}/>
          ))}
        </div>
      </LayoutSection>
    </Layout>
  );
}
