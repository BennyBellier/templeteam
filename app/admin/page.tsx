"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Typography } from "@/components/ui/typography";
import { useIsMobile } from "@/hooks/use-mobile";
import { trpc } from "@/trpc/TrpcProvider";
import type {
  EmergencyContact,
  MemberEmergencyContact,
  MemberMembership,
} from "@prisma/client";
import {
  ChevronDown,
  Phone,
  Stethoscope,
  TicketCheck,
  TicketSlash,
  TicketX,
} from "lucide-react";
import Image from "next/image";
import type { ReactElement } from "react";
import { useMediaQuery } from "usehooks-ts";

function StatusCellItem({
  picture,
  medicalCertificate,
  payment,
}: {
  picture: string;
  medicalCertificate: number;
  payment: boolean;
}) {
  const isMobile = useMediaQuery("(min-width: 768px)");
  let icon: ReactElement;
  let content: ReactElement;

  if (!payment && !picture && medicalCertificate === 0) {
    icon = <TicketX className="h-5 w-5 stroke-red-500" />;
    content = (
      <>
        <Typography as="span">
          Paiement en attente !
          <br />
          Pas de certificat médicale, ni de photo.
        </Typography>
      </>
    );
  } else if (!picture && medicalCertificate === 0) {
    icon = <TicketSlash className="h-5 w-5 stroke-orange-500" />;
    content = (
      <Typography as="span">
        Pas de certificat médicale, ni de photo.
      </Typography>
    );
  } else if (!payment) {
    icon = <TicketSlash className="h-5 w-5 stroke-orange-500" />;
    content = <Typography as="span">Paiement en attente.</Typography>;
  } else {
    icon = <TicketCheck className="h-5 w-5 stroke-green-500" />;
    content = <Typography as="span">Dossier complet !</Typography>;
  }

  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger>{icon}</PopoverTrigger>
        <PopoverContent className="w-fit">{content}</PopoverContent>
      </Popover>
    );
  }

  return (
    <HoverCard openDelay={50} closeDelay={100}>
      <HoverCardTrigger asChild>{icon}</HoverCardTrigger>
      <HoverCardContent className="w-fit">{content}</HoverCardContent>
    </HoverCard>
  );
}

function StatusCollapsibleContent({
  picture,
  medicalCertificate,
  payment,
}: {
  picture: string;
  medicalCertificate: number;
  payment: boolean;
}) {
  let icon: ReactElement;
  let content: ReactElement;
  let border = "";

  if (!payment && !picture && medicalCertificate === 0) {
    border = "border-red-500";
    icon = <TicketX className="stroke-red-500 h-5 w-5" />;
    content = (
      <>
        <Typography as="span">Paiement en attente</Typography>
        <Typography as="span">
          Pas de certificat médicale, ni de photo
        </Typography>
      </>
    );
  } else if (!picture && medicalCertificate === 0) {
    border = "border-orange-500";
    icon = <TicketSlash className="h-5 w-5 stroke-orange-500" />;
    content = (
      <Typography as="span">Pas de certificat médicale, ni de photo</Typography>
    );
  } else if (!payment) {
    border = "border-orange-500";
    icon = <TicketSlash className="h-5 w-5 stroke-orange-500" />;
    content = <Typography as="span">Paiement en attente</Typography>;
  } else {
    border = "border-green-500";
    icon = <TicketCheck className="h-5 w-5 stroke-green-500" />;
    content = <Typography as="span">Dossier complet</Typography>;
  }

  return (
    <div className="flex items-center gap-2 p-2 border shadow-md rounded-md">
      {icon}
      <div className="flex flex-col gap-2">{content}</div>
    </div>
  );
}

function MembershipsList({ memberships }: { memberships: MemberMembership[] }) {
  return memberships.map((membership) => (
    <Badge variant="secondary" key={`${membership.memberId}-${membership.id}`}>
      {membership.membership}
    </Badge>
  ));
}

function MemberEmergencyContactAlert({
  emergencyContacts,
}: {
  emergencyContacts: ({ contact: EmergencyContact } & MemberEmergencyContact)[];
}) {
  if (emergencyContacts.length > 0 && emergencyContacts[0]) {
    return (
      <Alert className="h-fit w-fit">
        <Phone className="h-4 w-4" />
        <AlertTitle>Contact d&apos;urgence</AlertTitle>
        <AlertDescription className="flex flex-col gap-1">
          <div
            key={emergencyContacts[0].id}
            className="flex justify-between gap-2 whitespace-nowrap"
          >
            <span>{emergencyContacts[0].contact.name}</span>
            <a
              href={`tel:${emergencyContacts[0].contact.phone}`}
              className="underline"
            >
              0{emergencyContacts[0].contact.phone.substring(3)}
            </a>
          </div>
          {emergencyContacts.length > 1 && emergencyContacts[1] && (
            <>
              <Separator />
              <div
                key={emergencyContacts[1].id}
                className="flex justify-between gap-2"
              >
                <span>{emergencyContacts[1].contact.name}</span>
                <a
                  href={`tel:${emergencyContacts[1].contact.phone}`}
                  className="underline"
                >
                  0{emergencyContacts[1].contact.phone.substring(3)}
                </a>
              </div>
            </>
          )}
        </AlertDescription>
      </Alert>
    );
  }
  return null;
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
          <TableHead className="w-16 lg:w-24">Photo</TableHead>
          <TableHead className="w-fit">Nom</TableHead>
          <TableHead>Prénom</TableHead>
          <TableHead className="hidden md:table-cell">Cours</TableHead>
          <TableHead className="hidden sm:table-cell">Statut</TableHead>
          <TableHead className="w-4 pl-0" />
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
                <TableRow className="*:bg-background data-open:border-0">
                  <TableCell>
                    <Avatar>
                      <Dialog>
                        <DialogTrigger asChild>
                          <AvatarImage
                            src={`/static/association/members/photo/${member.picture}.jpg`}
                            alt={`${member.lastname} ${member.firstname}`}
                          />
                        </DialogTrigger>
                        <DialogContent className="aspect-square h-1/3 w-fit overflow-hidden">
                          <DialogHeader className="sr-only">
                            <DialogTitle>
                              {`${member.lastname} ${member.firstname}`}
                            </DialogTitle>
                          </DialogHeader>
                          <Image
                            src={`/static/association/members/photo/${member.picture}.jpg`}
                            alt={`${member.lastname} ${member.firstname}`}
                            className="aspect-auto h-full w-full object-contain"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </DialogContent>
                      </Dialog>
                      <AvatarFallback className="capitalize">{`${member.lastname.charAt(0)}${member.firstname.charAt(0)}`}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{member.lastname}</TableCell>
                  <TableCell>{member.firstname}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <MembershipsList memberships={member.memberships} />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell ">
                    <StatusCellItem
                      picture={member.picture}
                      medicalCertificate={member.medicalCertificate.length}
                      payment={false}
                    />
                  </TableCell>
                  <TableCell>
                    <ChevronDown className="h-4 w-4 transition-transform duration-300 group-data-open/trigger:rotate-180" />
                  </TableCell>
                </TableRow>
              </CollapsibleTrigger>
              <CollapsibleContent
                asChild
                className="data-closed:animate-collapsible-up data-open:animate-collapsible-down border-b outline-none transition-all"
              >
                <TableRow>
                  <TableCell colSpan={6} className="pl-4">
                    <div className="grid auto-rows-auto items-center justify-center gap-4 pl-4 sm:grid-cols-2 lg:grid-cols-3">
                      <MemberEmergencyContactAlert
                        emergencyContacts={member.MemberEmergencyContact}
                      />
                      {member.medicalComment && (
                        <Alert className="h-fit w-fit self-center justify-self-center">
                          <Stethoscope className="h-4 w-4" />
                          <AlertTitle>Contact d&apos;urgence</AlertTitle>
                          <AlertDescription className="flex flex-col gap-1">
                            {member.medicalComment}
                          </AlertDescription>
                        </Alert>
                      )}
                      <div className="flex gap-2 sm:flex-col md:hidden">
                        <MembershipsList memberships={member.memberships} />
                      </div>
                      {
                        <StatusCollapsibleContent
                          picture={member.picture}
                          medicalCertificate={member.medicalCertificate.length}
                          payment={false}
                        />
                      }
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
