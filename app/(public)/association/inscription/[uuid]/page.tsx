import {
  Layout,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
  LayoutDescription,
} from "@/components/layout/layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Content } from "./content";

import type { Metadata } from "next";
import { prisma } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Inscription | Temple Team",
  description: "Compléter votre dossier pour valider votre inscription.",
  authors: {
    name: "BELLIER Benjamin",
    url: "https://github.com/BennyBellier",
  },
  category: "sports",
};

export default async function Documents({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  const isMemberExist = await prisma.association.member.isMemberExist({
    memberId: uuid,
  });
  const isMemberHaveMedicFile = await prisma.association.registration.isMemberHaveMedicalFileForSeason({
    memberId: uuid,
  });

  return (
    <Layout noReferences>
      <LayoutHeader>
        <LayoutTitle>Certificat médical</LayoutTitle>
        <LayoutDescription>
          Compléter votre dossier pour valider votre inscription.
        </LayoutDescription>
      </LayoutHeader>
      <LayoutSection className="gap-6 md:flex-row">
        {isMemberExist ? (
          <Content />
        ) : (
          <Alert variant="destructive" className="mx-auto max-w-lg">
            <AlertTriangle className="h-6 w-6" />
            <AlertTitle>L&apos;adhérent n&apos;existe pas !</AlertTitle>
            <AlertDescription>
              Veuillez réessayer ou contactez un administrateur.
            </AlertDescription>
          </Alert>
        )}
      </LayoutSection>
    </Layout>
  );
}
