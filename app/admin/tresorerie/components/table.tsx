"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useSeasons } from "@/providers/SeasonProvider";
import { trpc } from "@/trpc/TrpcProvider";
import { Pencil, Search } from "lucide-react";
import { useState } from "react";

export function SubscriptionsList() {
  const { currentSeason } = useSeasons();
  const data = trpc.association.treasurer.getSubscriptionsForSeason.useQuery({ season: currentSeason ?? undefined });

  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);

  const filteredSubscription = subscription.filter((member) => {
    const searchLower = searchQuery.toLowerCase();
    return member.name.toLowerCase().includes(searchLower);
  });

  const savePaiement = (id: string) => {
    setDialogOpen(null);
  };

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
            <div className="text-2xl font-bold">{totalCotisations} €</div>
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
              {totalPaye} €
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
              {totalImpaye} €
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
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Cours</TableHead>
                <TableHead>État Cotisation</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead className="text-right">Montant Payé</TableHead>
                <TableHead>Moyen</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscription.map((adherent) => (
                <TableRow key={adherent.id}>
                  <TableCell className="font-medium">{adherent.nom}</TableCell>
                  <TableCell>{adherent.prenom}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {adherent.cours.map((cours) => (
                        <Badge
                          key={cours}
                          variant="secondary"
                          className={getCoursBadgeColor(cours)}
                        >
                          {cours}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getEtatBadgeVariant(adherent.etatCotisation)}
                    >
                      {adherent.etatCotisation}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {adherent.montantCotisation} €
                  </TableCell>
                  <TableCell className="text-right">
                    {adherent.montantPaye !== undefined ? (
                      <span className="font-medium">
                        {adherent.montantPaye} €
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {adherent.moyenPaiement ? (
                      <Badge variant="outline">{adherent.moyenPaiement}</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog
                      open={dialogOpen === adherent.id}
                      onOpenChange={(open) => !open && setDialogOpen(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDialog(adherent)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Modifier
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>
                            Modifier le paiement - {adherent.prenom}{" "}
                            {adherent.nom}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="etat">État de la cotisation</Label>
                            <Select
                              value={formData.etatCotisation}
                              onValueChange={(value) =>
                                setFormData({
                                  ...formData,
                                  etatCotisation: value as EtatCotisation,
                                })
                              }
                            >
                              <SelectTrigger id="etat">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ETATS_COTISATION.map((etat) => (
                                  <SelectItem key={etat} value={etat}>
                                    {etat}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="montant">Montant payé (€)</Label>
                            <Input
                              id="montant"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={formData.montantPaye}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  montantPaye: e.target.value,
                                })
                              }
                            />
                            <p className="text-sm text-muted-foreground">
                              Montant de base : {adherent.montantCotisation} €
                            </p>
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="moyen">Moyen de paiement</Label>
                            <Select
                              value={formData.moyenPaiement}
                              onValueChange={(value) =>
                                setFormData({
                                  ...formData,
                                  moyenPaiement: value as MoyenPaiement,
                                })
                              }
                            >
                              <SelectTrigger id="moyen">
                                <SelectValue placeholder="Sélectionner un moyen" />
                              </SelectTrigger>
                              <SelectContent>
                                {MOYENS_PAIEMENT.map((moyen) => (
                                  <SelectItem key={moyen} value={moyen}>
                                    {moyen}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="commentaire">Commentaire</Label>
                            <Textarea
                              id="commentaire"
                              placeholder="Ajouter un commentaire sur le paiement..."
                              value={formData.commentairePaiement}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  commentairePaiement: e.target.value,
                                })
                              }
                              rows={3}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setDialogOpen(null)}
                          >
                            Annuler
                          </Button>
                          <Button onClick={() => savePaiement(adherent.id)}>
                            Enregistrer
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
