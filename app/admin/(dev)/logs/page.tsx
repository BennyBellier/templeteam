import { auth } from "@/server/auth";
import { prisma } from "@/trpc/server";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminPageTitle } from "../components/page-title";
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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "Developer") {
    redirect("/admin/dashboard");
  }

  return (
    <>
      <AdminPageTitle
        title="Application Logs"
        subtitle="Monitor and analyze your application logs in real-time"
      />
      <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-5 lg:py-6">
        <LogsTable sampleLogs={logs} />
      </div>
    </>
  );
}
