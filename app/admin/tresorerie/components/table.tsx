"use client";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSeasons } from "@/providers/SeasonProvider";
import { trpc } from "@/trpc/TrpcProvider";
import { Search } from "lucide-react";
import { useState } from "react";
import { MemberRow } from "./row";

export function SubscriptionsList() {
  const { currentSeason } = useSeasons();
  const { data } =
    trpc.association.treasurer.getSubscriptionsForSeason.useQuery({
      season: currentSeason ?? undefined,
    });

  const [searchQuery, setSearchQuery] = useState("");

  const filteredSubscription = data?.files.filter((member) => {
    const searchLower = searchQuery.toLowerCase();
    return member.name.toLowerCase().includes(searchLower);
  });

  return (
    <>
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Cotisations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalSubscription} €</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Montant Payé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {data?.totalPaid} €
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Montant Impayé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {data?.totalOverdue} €
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom ou prénom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Cours</TableHead>
                <TableHead>État Cotisation</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead className="text-right">Montant Payé</TableHead>
                <TableHead>Moyen</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscription?.map((file) => (
                <TableRow key={file.id}>
                  <MemberRow file={file} />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
