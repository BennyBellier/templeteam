import {
  Layout,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
  LayoutDescription,
} from "@/components/layout/layout";
import { Content, ErrorComponents } from "./content";
import { z } from "zod";
import type { Metadata } from "next";

const FormProps = z.string().uuid();

export const metadata: Metadata = {
  title: "Inscription | Temple Team",
  description: "Compléter votre dossier pour valider votre inscription.",
  authors: {
    name: "BELLIER Benjamin",
    url: "https://github.com/BennyBellier",
  },
  category: "sports",
};

export default async function FinaliserAdhesion({ params }: { params: Promise<{ slug: string }> }) {
  const id = (await params).slug;
  const result = FormProps.safeParse(id);

  return (
    <Layout noReferences>
      <LayoutHeader>
        <LayoutTitle>Inscription</LayoutTitle>
        <LayoutDescription>
          Compléter votre dossier pour valider votre inscription.
        </LayoutDescription>
      </LayoutHeader>
      <LayoutSection className="gap-6 md:flex-row">
        {!result.success ? (
          <>
            <span>page.tsx</span>
            <ErrorComponents />
          </>
        ) : (
          <Content memberId={result.data} />
        )}
      </LayoutSection>
    </Layout>
  );
}
