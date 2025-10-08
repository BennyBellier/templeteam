import {
  Layout,
  LayoutDescription,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
} from "@/components/layout/layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/trpc/server";
import type { Metadata } from "next";
import { MedicForm } from "./form";

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

  const isMemberHaveMedicFile =
    await prisma.association.registration.isMemberHaveMedicalFileForSeason({
      memberId: uuid,
    });

  return (
    <Layout noReferences>
      <LayoutHeader>
        <LayoutTitle>Certificat médical</LayoutTitle>
        <LayoutDescription>
          Merci d&apos;envoyer votre certificat médical pour compléter votre
          inscription.
        </LayoutDescription>
      </LayoutHeader>
      <LayoutSection>
        {isMemberExist ? (
          <Card className="w-full max-w-full md:max-w-2xl">
            <CardHeader>
              <CardTitle>Envoyer votre certificat médical</CardTitle>
              <CardDescription>
                Glissez-déposez ou cliquez pour sélectionner un fichier PDF, JPG
                ou PNG
              </CardDescription>
            </CardHeader>
            <MedicForm memberId={uuid} medicExist={isMemberHaveMedicFile} />
          </Card>
        ) : (
          <Alert variant="destructive" className="w-full max-w-lg">
            <AlertTriangle className="h-7 w-7" />
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
