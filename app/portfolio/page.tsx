import Outsider from "@/../public/img/references/outsider.jpg";
import Team from "@/../public/img/team/Team.jpg";
import {
  Layout,
  LayoutDescription,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
} from "@/components/layout/layout";
import { ImageLink } from "./link";
import { env } from "@/env.mjs";

export const revalidate = env.REVALIDATE_TIME ?? 3600;

const Portfolio = () => {
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Portfolio</LayoutTitle>
        <LayoutDescription>
          Fière de nos années d&apos;expérience. Nous mettons nos compétences à
          profits pour créer des images sensationnelles et inoubliables.
        </LayoutDescription>
      </LayoutHeader>
      <LayoutSection className="flex lg:flex-row flex-col justify-around gap-8 lg:gap-16">
        <ImageLink
          src={Team}
          label="Photos"
          alt={"Photos link picture"}
          href="/portfolio/photos"
        />
        <ImageLink
          src={Outsider}
          label="Videos"
          alt={"Videos link picture"}
          href="/portfolio/videos"
        />
      </LayoutSection>
    </Layout>
  );
};

export default Portfolio;
