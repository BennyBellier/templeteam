import {
  Layout,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
  LayoutDescription,
} from "@/components/layout/layout";
import { Content } from "./content";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription | Temple Team",
  description: "Compléter votre dossier pour valider votre inscription.",
  authors: {
    name: "BELLIER Benjamin",
    url: "https://github.com/BennyBellier",
  },
  category: "sports",
};

export default async function FinaliserAdhesion() {

  return (
    <Layout noReferences>
      <LayoutHeader>
        <LayoutTitle>Inscription</LayoutTitle>
        <LayoutDescription>
          Compléter votre dossier pour valider votre inscription.
        </LayoutDescription>
      </LayoutHeader>
      <LayoutSection className="gap-6 md:flex-row">
          <Content />
      </LayoutSection>
    </Layout>
  );
}
