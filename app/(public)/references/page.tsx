import {
  Layout,
  LayoutDescription,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
} from "@/components/layout/layout";
import ReferencesWithSelectors from "./ReferencesWithSelectors";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Références | Temple Team",
  description: "Ils nous font confiance. Ils nous soutiennent.",
  authors: {
    name: "BELLIER Benjamin",
    url: "https://github.com/BennyBellier",
  },
  category: "sports"
};

export default function References() {
  return (
    <Layout noReferences>
      <LayoutHeader>
        <LayoutTitle>Références</LayoutTitle>
        <LayoutDescription>
          Ils nous font confiance. Ils nous soutiennent
        </LayoutDescription>
      </LayoutHeader>
      <LayoutSection className="grid grid-cols-1 justify-between gap-6 md:items-start lg:flex lg:auto-cols-min lg:flex-row">
        <ReferencesWithSelectors />
      </LayoutSection>
    </Layout>
  );
}
