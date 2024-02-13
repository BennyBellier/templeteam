import {
  Layout,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/components/layout/layout";

export default function Team() {
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>La Team</LayoutTitle>
        <LayoutDescription>
          7 athlètes, une seule équipe, des années d'entraînement, il est
          maintenant l'heure de vous les présenter.
        </LayoutDescription>
      </LayoutHeader>
    </Layout>
  );
}
