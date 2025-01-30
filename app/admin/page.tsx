"use client";

import { trpc } from "@/trpc/TrpcProvider";
import { Card, CardContent } from "@/components/ui/card";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administration | Temple Team",
  description: "Gestion de l'association.",
  authors: {
    name: "BELLIER Benjamin",
    url: "https://github.com/BennyBellier",
  },
  category: "sports",
};

export default function AdminDashboard() {
  const [members] = trpc.association.getMembersList.useSuspenseQuery();

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col justify-between px-0 py-6">
        <DataTable columns={columns} data={members} />
      </CardContent>
    </Card>
  );
}
