import { prisma } from "@/trpc/server";
import type { Metadata } from "next";

import { Typography } from "@/components/ui/typography";
import { MembersTable } from "./components/members-tables";


export const metadata: Metadata = {
  title: "Administration | Temple Team",
  description: "Gestion de l'association.",
  authors: {
    name: "BELLIER Benjamin",
    url: "https://github.com/BennyBellier",
  },
  category: "sports",
};

export default async function AdminMembersList() {
  const season = await prisma.association.getCurrentSeason();

  return (
    <>
      <Typography variant="h2">Adhérents</Typography>
      <Typography variant="lead">Saison {season}</Typography>
      <MembersTable />
    </>
  );
}
