import { prisma } from "@/trpc/server";
import type { Metadata } from "next";

import { Typography } from "@/components/ui/typography";
import { MemberChartPie } from "./components/chart-pie";
import { OverallContributionChartJauge } from "./components/due-paid";

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
      <div className="flex flex-wrap gap-4 justify-around">
        <MemberChartPie season={season} />
        <OverallContributionChartJauge season={season} />
      </div>
    </>
  );
}
