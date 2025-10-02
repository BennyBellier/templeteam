"use client";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getPhoneData } from "@/components/ui/phone-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Typography } from "@/components/ui/typography";
import { type RouterOutputs } from "@/server/api/root";
import type { ColumnDef } from "@tanstack/react-table";
import { Mail, MoreHorizontal, Phone } from "lucide-react";
import { MemberCard } from "./member-card";
import { getCertificatBadge, getPaymentBadge } from "./utils";

export const columns: ColumnDef<
  RouterOutputs["association"]["dashboard"]["getSeasonMemberList"][number]
>[] = [
  {
    accessorKey: "name",
    header: "Adhérent",
    cell: ({ row }) => {
      const name: string = row.getValue("name");
      // const photo = row.original.photo;
      const age = row.original.age;

      return (
        <div className="flex items-center space-x-3">
          {/* <Avatar className="h-10 w-10">
            <AvatarImage
              src={photo}
              alt={`${name}`}
              className="aspect-auto object-cover"
            />
            <AvatarFallback className="capitalize">{`${getInitials(name)}`}</AvatarFallback>
          </Avatar> */}
          <div>
            <div className="font-medium text-foreground">{name}</div>
            <div className="text-xs text-muted-foreground">{age} ans</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Contact",
    cell: ({ row }) => {
      return (
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Mail className="mr-2 h-3 w-3 text-muted-foreground" />
            {row.original.mail ? (
              <a href={`mailto:${row.original.mail}`} className="text-nowrap">
                {row.original.mail}
              </a>
            ) : (
              <Typography>Non renseigné</Typography>
            )}
          </div>
          <div className="flex items-center text-sm">
            <Phone className="mr-2 h-3 w-3 text-muted-foreground" />
            {row.original.phone ? (
              <a href={`tel:${row.original.phone}`} className="text-nowrap">
                {`0${getPhoneData(row.original.phone).nationalNumber}`}
              </a>
            ) : (
              <Typography>Non renseigné</Typography>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "courses",
    header: "Cours",
    cell: ({ row }) => (
      <div className="flex max-w-36 flex-wrap gap-1">
        {row.original.courses.map((course, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {course}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "statut",
    header: "État",
    cell: ({ row }) => (
      <div className="flex max-w-36 flex-wrap justify-center gap-1">
        {getCertificatBadge(row.original.medicalCertificate)}
        {getPaymentBadge(row.original.payment)}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Dialog>
                <DialogTrigger className="rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-left">
                  Détails
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] max-w-2xl overflow-hidden">
                  <ScrollArea className="max-h-[90vh] max-w-2xl pb-6">
                  <DialogHeader className="sr-only">
                    <DialogTitle>Détails de l&apos;adhérent</DialogTitle>
                    <DialogDescription>
                      Informations complètes du membre
                    </DialogDescription>
                  </DialogHeader>
                    <MemberCard member={row.original} />
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem>Cotisation reçu</DropdownMenuItem> */}
            {/* <DropdownMenuItem>Changement de cours</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
