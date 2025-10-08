/* import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/trpc/server";
import type { Metadata } from "next";
import { getServerAuthSession } from "@/server/auth";
import { Role } from "@prisma/client";
import { Typography } from "@/components/ui/typography";
import RestrictedAccess from "../components/restricted";

export const metadata: Metadata = {
  title: "Trésorerie",
  description: "Gestion de l'association.",
  authors: {
    name: "BELLIER Benjamin",
    url: "https://github.com/BennyBellier",
  },
  category: "sports",
};

export default async function TreasurerDashboard() {
  const session = await getServerAuthSession();

  if (!(session?.user.role === Role.President || session?.user.role === Role.Treasurer)) {
    return <RestrictedAccess />;
  }

  const fileWithNoPayment = await prisma.association.treasurer.getFilesWithNoPayment();

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col justify-between px-0 pb-0 pt-6">
      </CardContent>
    </Card>
  );
}
 */