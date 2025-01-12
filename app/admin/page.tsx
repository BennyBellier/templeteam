"use client";

import { Badge } from "@/components/ui/badge";

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

import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/TrpcProvider";
import type { Course, LegalGuardian, Member } from "@prisma/client";
import { Stethoscope, TicketCheck, TicketSlash, TicketX } from "lucide-react";
import Image from "next/image";
import { useState, type ReactElement } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getTeamMembers } from "@/server/get-team";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

function StatusCellItem({
  picture,
  medicalCertificate,
  payment,
}: {
  picture: string;
  medicalCertificate: number;
  payment: boolean;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
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
    icon = <TicketX className="h-5 w-5 stroke-red-500" />;
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
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border border-solid p-2 shadow-md",
        border,
      )}
    >
      {icon}
      <div className="flex flex-col gap-2">{content}</div>
    </div>
  );
}

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

// {/* <Table>
//   <TableCaption>Liste des adhérents</TableCaption>
//   <TableHeader>
//     <TableRow>
//       <TableHead className="w-16 lg:w-24">Photo</TableHead>
//       <TableHead className="w-fit">Nom</TableHead>
//       <TableHead>Prénom</TableHead>
//       <TableHead className="hidden md:table-cell">Cours</TableHead>
//       <TableHead className="hidden sm:table-cell">Statut</TableHead>
//       <TableHead className="w-4 pl-0" />
//     </TableRow>
//   </TableHeader>
//   <TableBody>
//     {members.map((member) => (
//       <TableRowExpandable key={member.id} className="group/collapse w-full">
//         <TableRowExpandableTrigger className="*:bg-background data-open:border-0">
//           <TableCell>
//           </TableCell>
//           <TableCell>{member.lastname}</TableCell>
//           <TableCell>{member.firstname}</TableCell>
//           <TableCell className="hidden md:table-cell">
//             {/* <MembershipsList memberships={member.memberships} /> */}
//           </TableCell>
//           <TableCell className="hidden sm:table-cell">
//             {/* <StatusCellItem
//                       picture={member.photo}
//                       medicalCertificate={member.medicalCertificate.length}
//                       payment={false}
//                     /> */}
//           </TableCell>
//           <TableRowExpandableIndicator className="h-4 w-4 " />
//         </TableRowExpandableTrigger>
//         <TableRowExpandableContent
//           colSpan={6}
//           className="*:bg-background data-open:border-0"
//         >
//           <div className="grid auto-rows-auto items-center justify-center gap-4 pl-4 sm:grid-cols-2 lg:grid-cols-3">
//             {/* <MemberEmergencyContactAlert
//                       emergencyContacts={member.}
//                     /> */}
//             {member.medicalComment && (
//               <Alert className="h-fit w-fit self-center justify-self-center">
//                 <Stethoscope className="h-4 w-4" />
//                 <AlertTitle>Contact d&apos;urgence</AlertTitle>
//                 <AlertDescription className="flex flex-col gap-1">
//                   {member.medicalComment}
//                 </AlertDescription>
//               </Alert>
//             )}
//             <div className="flex gap-2 justify-self-center sm:flex-col md:hidden">
//               {/* <{}MembershipsList memberships={member.memberships} /> */}
//             </div>
//             <div className="sm:hidden">
//               {/* <StatusCollapsibleContent
//                         picture={member.picture}
//                         medicalCertificate={member.medicalCertificate.length}
//                         payment={false}
//                       /> */}
//             </div>
//           </div>
//         </TableRowExpandableContent>
//       </TableRowExpandable>
//     ))}
//   </TableBody>
// </Table>; */}
