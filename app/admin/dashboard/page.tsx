import type { Metadata } from "next";

import { MemberChartPie } from "../components/chart-pie";
import { OverallContributionChartJauge } from "../components/due-paid";
import { AdminPageTitle } from "../components/page-title";

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
  return (
    <>
      <AdminPageTitle title="Tableau de bord" />
      <div className="container flex flex-1 flex-col gap-4 px-4 py-4 sm:px-6 sm:py-5 lg:py-6">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <MemberChartPie />
          <OverallContributionChartJauge />
        </div>
      </div>
    </>
  );
}
