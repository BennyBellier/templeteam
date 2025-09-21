import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/trpc/server";
import type { Metadata } from "next";
import { columns } from "./components/columns";
import { SeasonMemberCounter, SeasonMemberPerCoursesCounter } from "./components/Dashboard";
import { DataTable } from "./components/data-table";
import { Typography } from "@/components/ui/typography";
import { MemberChartPie } from "./components/chart-pie";

export const metadata: Metadata = {
  title: "Administration | Temple Team",
  description: "Gestion de l'association.",
  authors: {
    name: "BELLIER Benjamin",
    url: "https://github.com/BennyBellier",
  },
  category: "sports",
};

export default async function AdminDashboard() {
  const season = await prisma.association.getCurrentSeason();

  return (
    <>
      <Typography variant="h2">Tableau de bord</Typography>
      <Typography variant="lead">Saison {season}</Typography>
      <MemberChartPie />

      {/* <Card className="h-full">
        <CardContent className="flex h-full flex-col justify-between px-0 pb-0 pt-6">
          <DataTable columns={columns} data={members} />
        </CardContent>
      </Card> */}
    </>
  );
}
