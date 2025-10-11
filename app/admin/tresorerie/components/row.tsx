"use client";

import { getDetailedPaymentBadge } from "#app/admin/members/components/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
import { TableCell } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { type RouterOutputs } from "@/server/api/root";
import { trpc } from "@/trpc/TrpcProvider";
import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { Pencil } from "lucide-react";
import { memo, useState } from "react";

const MemberRowItem = ({
  file,
}: {
  file: RouterOutputs["association"]["treasurer"]["getSubscriptionsForSeason"]["files"][number];
}) => {
  const utils = trpc.useUtils();

  // Copie locale pour les modifications (optimistic UI possible)
  const [localFile, setLocalFile] = useState(file);

  const [hasChanges, setHasChanges] = useState(false);

  const updateMutation =
    trpc.association.treasurer.updatePaymentForMember.useMutation({
      onSuccess: (updated) => {
        // Met à jour la version locale avec la réponse du serveur
        setLocalFile(updated);
        setHasChanges(false);
        // Met à jour le cache global sans refetch complet
        utils.association.treasurer.getSubscriptionsForSeason.setData(
          { season: undefined },
          (old) =>
            old
              ? {
                  ...old,
                  files: old.files.map((f) =>
                    f.id === updated.id ? updated : f,
                  ),
                }
              : old,
        );
      },
    });

  // --- handlers locaux ---
  const handleChange = (
    changes: Partial<
      RouterOutputs["association"]["treasurer"]["getSubscriptionsForSeason"]["files"][number]
    >,
  ) => {
    setLocalFile((prev) => ({ ...prev, ...changes }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateMutation.mutate({
      fileId: file.id,
      changes: {
        paymentAmount: localFile.paymentAmount ?? undefined,
        paymentStatus: localFile.paymentStatus,
        paymentMethod: localFile.paymentMethod ?? undefined,
        paymentDetails: localFile.paymentDetails ?? undefined,
      },
    });
  };

  return (
    <>
      <TableCell className="font-medium">{localFile.name}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {localFile.courses.map((cours) => (
            <Badge key={cours} variant="secondary">
              {cours}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell>{getDetailedPaymentBadge(localFile.paymentStatus)}</TableCell>
      <TableCell className="text-right font-medium">
        {localFile.subscriptionPrice} €
      </TableCell>
      <TableCell className="text-right">
        {localFile.paymentAmount !== undefined ? (
          <span className="font-medium">{localFile.paymentAmount} €</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell>
        {localFile.paymentMethod ? (
          <Badge variant="outline">{localFile.paymentMethod}</Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              // onClick={() => openDialog(localMember)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Modifier le paiement - {localFile.name}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="etat">État de la cotisation</Label>
                <Select
                  value={localFile.paymentStatus}
                  onValueChange={(value) =>
                    handleChange({ paymentStatus: value as PaymentStatus })
                  }
                >
                  <SelectTrigger id="etat">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PaymentStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
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
                  placeholder="0.00"
                  value={Number(localFile.paymentAmount ?? "0")}
                  onChange={(e) =>
                    handleChange({ paymentAmount: Number(e.target.value) })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Montant de base : {localFile.subscriptionPrice} €
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="moyen">Moyen de paiement</Label>
                <Select
                  value={localFile.paymentMethod ?? ""}
                  onValueChange={(value) =>
                    handleChange({ paymentMethod: value as PaymentMethod })
                  }
                >
                  <SelectTrigger id="moyen">
                    <SelectValue placeholder="Sélectionner un moyen" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PaymentMethod).map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
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
                  value={localFile.paymentDetails ?? ""}
                  onChange={(e) =>
                    handleChange({ paymentDetails: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button
                disabled={!hasChanges || updateMutation.isPending}
                onClick={handleSave}
              >
                Enregistrer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </TableCell>
    </>
  );
};

export const MemberRow = memo(MemberRowItem);
