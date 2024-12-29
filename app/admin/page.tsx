"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  TableRowExpandableIndicator,
  TableRowExpandableTrigger,
  TableRowExpandable,
  TableRowExpandableContent,
} from "@/components/ui/table";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/TrpcProvider";
import type { Course, LegalGuardian, Member } from "@prisma/client";
import {
  Phone,
  Stethoscope,
  TicketCheck,
  TicketSlash,
  TicketX,
} from "lucide-react";
import Image from "next/image";
import { useState, type ReactElement } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getTeamMembers } from "@/server/get-team";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { ScrollArea } from "@/components/ui/scroll-area";

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

function MembershipsList({
  fileId,
  courses,
}: {
  fileId: string;
  courses: Course[];
}) {
  return courses.map((course) => (
    <Badge variant="secondary" key={`${fileId}-${course.id}`}>
      {course.name}
    </Badge>
  ));
}

function MemberEmergencyContactAlert({
  emergencyContacts,
}: {
  emergencyContacts: LegalGuardian[];
}) {
  if (emergencyContacts.length > 0 && emergencyContacts[0]) {
    return (
      <Alert className="h-fit w-fit shadow-md">
        <Phone className="h-4 w-4" />
        <AlertTitle>Contact d&apos;urgence</AlertTitle>
        {/* <AlertDescription className="flex flex-col gap-1">
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
        </AlertDescription> */}
      </Alert>
    );
  }
  return null;
}

export default function AdminDashboard() {
  const [members] = trpc.association.getMembersList.useSuspenseQuery();


  return (
    <Card>
      <CardContent className="px-0 py-6">
        <ScrollArea className="h-96">
        <DataTable
          columns={columns}
          data={members}
        />
        </ScrollArea>
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
//             <Avatar>
//               <Dialog>
//                 <DialogTrigger asChild>
//                   <AvatarImage
//                     src={`/static/association/members/photo/${member.photo}.jpg`}
//                     alt={`${member.lastname} ${member.firstname}`}
//                   />
//                 </DialogTrigger>
//                 <DialogContent className="aspect-square h-1/3 w-fit overflow-hidden">
//                   <DialogHeader className="sr-only">
//                     <DialogTitle>
//                       {`${member.lastname} ${member.firstname}`}
//                     </DialogTitle>
//                   </DialogHeader>
//                   <Image
//                     src={`/static/association/members/photo/${member.photo}.jpg`}
//                     alt={`${member.lastname} ${member.firstname}`}
//                     className="aspect-auto h-full w-full object-contain"
//                     fill
//                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                   />
//                 </DialogContent>
//               </Dialog>
//               <AvatarFallback className="capitalize">{`${member.lastname.charAt(0)}${member.firstname.charAt(0)}`}</AvatarFallback>
//             </Avatar>
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