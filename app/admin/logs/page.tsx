import { prisma } from "@/trpc/server";
import type { Metadata } from "next";
import LogsTable from "./log-table";



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

  return <LogsTable sampleLogs={logs} />;
}
