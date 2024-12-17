"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { trpc } from "@/trpc/TrpcProvider";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronDown, Phone, Stethoscope } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EmergencyContact, MemberEmergencyContact } from "@prisma/client";

function Status({
  picture,
  medicalCertificate,
  payment,
}: {
  picture: string;
  medicalCertificate: number;
  payment: boolean;
}) {
  if (!payment && !picture && medicalCertificate === 0) {
    return "Simple pré-inscription.";
  } else if (!picture || medicalCertificate === 0) {
    return "Certificat et photo manquante.";
  } else if (!payment) {
    return "Paiement en attente !";
  } else {
    return "Complet";
  }
}

function MemberEmergencyContactAlert({
  emergencyContacts,
}: {
  emergencyContacts: ({ contact: EmergencyContact } & MemberEmergencyContact)[];
}) {
  return (
    <Alert className="h-fit w-fit">
      <Phone className="h-4 w-4" />
      <AlertTitle>Contact d&apos;urgence</AlertTitle>
      <AlertDescription className="flex flex-col gap-1">
        {emergencyContacts.map((emergencyContact) => (
          <div key={emergencyContact.id} className="flex justify-between gap-2">
            <span>{emergencyContact.contact.name}</span>
            <a
              href={`tel:${emergencyContact.contact.phone}`}
              className="underline"
            >
              {emergencyContact.contact.phone}
            </a>
          </div>
        ))}
      </AlertDescription>
    </Alert>
  );
}

export default function AdminDashboard() {
  const [members, membersQuery] =
    trpc.association.getMembersList.useSuspenseQuery();

  const { isLoading, error } = membersQuery;

  return (
    <Table>
      <TableCaption>Liste des adhérents</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16" />
          <TableHead className="w-fit">Nom</TableHead>
          <TableHead>Prénom</TableHead>
          <TableHead>Cours</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Sexe</TableHead>
          <TableHead className="w-16" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <Collapsible asChild key={member.id} className="w-full">
            <>
              <CollapsibleTrigger
                asChild
                className="group/trigger hover:cursor-pointer"
              >
                <TableRow className="data-open:border-0">
                  <TableCell>
                    <Avatar>
                      <AvatarImage
                        src={`/static/association/members/photo/${member.picture}`}
                        alt={`${member.lastname} ${member.firstname}`}
                      />
                      <AvatarFallback className="capitalize">{`${member.lastname.charAt(0)}${member.firstname.charAt(0)}`}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{member.lastname}</TableCell>
                  <TableCell>{member.firstname}</TableCell>
                  <TableCell>
                    {member.memberships.map((membership) => (
                      <Badge
                        variant="secondary"
                        key={`${member.id}-${membership.id}`}
                      >
                        {membership.membership}
                      </Badge>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Status
                      picture={member.picture}
                      medicalCertificate={member.medicalCertificate.length}
                      payment={false}
                    />
                  </TableCell>
                  <TableCell>{member.gender}</TableCell>
                  <TableCell>
                    <ChevronDown className="group-data-open/trigger:rotate-180 h-5 w-5 transition-transform duration-300" />
                  </TableCell>
                </TableRow>
              </CollapsibleTrigger>
              <CollapsibleContent asChild>
                <TableRow>
                  <TableCell colSpan={7} className="pl-4">
                    <div className="grid auto-rows-auto gap-4 pl-4 md:grid-cols-3 items-center">
                      <div className="text-sm text-gray-600">
                        <p>
                          Informations supplémentaires pour{" "}
                          <strong>
                            {member.firstname} {member.lastname}
                          </strong>
                        </p>
                        <p>
                          Contact d&apos;urgence :{" "}
                          {member.MemberEmergencyContact[0]?.contact.name ??
                            "N/A"}
                        </p>
                      </div>
                      {member.MemberEmergencyContact.length > 0 && (
                        <MemberEmergencyContactAlert
                          emergencyContacts={member.MemberEmergencyContact}
                        />
                      )}
                      {member.medicalComment && (
                        <Alert className="h-fit w-fit">
                          <Stethoscope className="h-4 w-4" />
                          <AlertTitle>Contact d&apos;urgence</AlertTitle>
                          <AlertDescription className="flex flex-col gap-1">
                            {member.medicalComment}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              </CollapsibleContent>
            </>
          </Collapsible>
        ))}
      </TableBody>
    </Table>
  );
}
