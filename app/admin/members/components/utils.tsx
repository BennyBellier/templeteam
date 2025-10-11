import { Badge } from "@/components/ui/badge";
import { Gender, PaymentStatus } from "@prisma/client";
import { AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";

export function getGenderLabel(gender: Gender) {
  switch (gender) {
    case Gender.Male:
      return "Homme";
    case Gender.Female:
      return "Femme";
    case Gender.NotSpecified:
      return "Autre";
  }
}

export function getCertificatBadge(validity: boolean) {
  if (validity) {
    return (
      <Badge
        variant="default"
        className="border-green-500/20 bg-green-500/10 text-green-500"
      >
        <CheckCircle className="mr-1 h-3 w-3" />
        Certificat médical
      </Badge>
    );
  } else {
    return (
      <Badge variant="destructive">
        <XCircle className="mr-1 h-3 w-3" />
        Certificat médical
      </Badge>
    );
  }
}

export function getDetailedPaymentBadge(status: PaymentStatus) {
  switch (status) {
    case PaymentStatus.Paid:
      return (
        <Badge
          variant="default"
          className="border-green-500/20 bg-green-500/10 text-green-500"
        >
          <CheckCircle className="mr-1 h-3 w-3" />
          Payé
        </Badge>
      );
    case PaymentStatus.Overdue:
      return (
        <Badge variant="destructive">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Impayé
        </Badge>
      );
    case PaymentStatus.PendingCollection:
      return (
        <Badge
          variant="secondary"
          className="border-orange-500/20 bg-orange-500/10 text-orange-500"
        >
          <Clock className="mr-1 h-3 w-3" />
          Encaissement en cours
        </Badge>
      );
    case PaymentStatus.InPart33:
      return (
        <Badge
          variant="secondary"
          className="border-amber-500/20 bg-amber-500/10 text-amber-500"
        >
          <Clock className="mr-1 h-3 w-3" />
          1/3 encaissé
        </Badge>
      );
    case PaymentStatus.InPart50:
      return (
        <Badge
          variant="secondary"
          className="border-yellow-500/20 bg-yellow-500/10 text-yellow-500"
        >
          <Clock className="mr-1 h-3 w-3" />
          1/2 encaissé
        </Badge>
      );
    case PaymentStatus.InPart66:
      return (
        <Badge
          variant="secondary"
          className="border-lime-500/20 bg-lime-500/10 text-lime-500"
        >
          <Clock className="mr-1 h-3 w-3" />
          2/3 encaissé
        </Badge>
      );
    case PaymentStatus.ToBeCashed:
      return <Badge variant="secondary">A encaisser</Badge>;
  }
}

export function getPaymentBadge(status: PaymentStatus) {
  switch (status) {
    case PaymentStatus.Overdue:
      return (
        <Badge variant="destructive">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Impayé
        </Badge>
      );
    case PaymentStatus.PendingCollection:
    case PaymentStatus.InPart33:
    case PaymentStatus.InPart50:
    case PaymentStatus.InPart66:
    case PaymentStatus.ToBeCashed:
    case PaymentStatus.Paid:
      return (
        <Badge
          variant="default"
          className="border-green-500/20 bg-green-500/10 text-green-500"
        >
          <CheckCircle className="mr-1 h-3 w-3" />
          Payé
        </Badge>
      );
  }
}

export function getInitials(str: string): string {
  return str
    .trim()
    .split(/\s+/) // découpe par espace(s)
    .slice(0, 2) // garde seulement les 2 premiers mots
    .map((word) => word[0]?.toUpperCase() ?? "") // prend la 1ère lettre
    .join("");
}
