import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/trpc/server";
import type { Metadata } from "next";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

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
  const members = await prisma.association.getMembersList();

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col justify-between px-0 py-6">
        <DataTable columns={columns} data={members} />
      </CardContent>
    </Card>
  );
}
