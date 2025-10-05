import { prisma } from "@/trpc/server";
import type { Metadata } from "next";
import LogsTable from "./log-table";
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

export default async function AdminMembersList() {
  const logs = await prisma.administration.logs.getAllLogs();

  return (
    <>
      <AdminPageTitle title="Application Logs" subtitle="Monitor and analyze your application logs in real-time" />
      <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-5 lg:py-6">
        <LogsTable sampleLogs={logs} />
      </div>
    </>
  );
}
