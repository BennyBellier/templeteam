"use client"

import { Prisma } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, Mail } from "lucide-react";
import Image from "next/image";
import { Typography } from "@/components/ui/typography";
import { getPhoneData } from "@/components/ui/phone-input";

const memberWithLegalGuardians = Prisma.validator<Prisma.MemberDefaultArgs>()({
  include: { legalGuardians: true },
});

export type MemberWithLegalGuardians = Prisma.MemberGetPayload<
  typeof memberWithLegalGuardians
>;

export const columns: ColumnDef<MemberWithLegalGuardians>[] = [
  {
    accessorKey: "photo",
    header: "Photo",
    cell: ({ row }) => {
      const lastname: string = row.getValue("lastname");
      const firstname: string = row.getValue("firstname");
      const photo: string = row.getValue("photo");
      const memberId = row.original.id;

      return (
        <Avatar>
          {photo && (
            <Dialog>
              <DialogTrigger asChild>
                <AvatarImage
                  src={`/static/association/members/${memberId}/photos/${photo}`}
                  alt={`${lastname} ${firstname}`}
                />
              </DialogTrigger>
              <DialogContent className="aspect-square h-1/3 w-fit overflow-hidden">
                <DialogHeader className="sr-only">
                  <DialogTitle>{`${lastname} ${firstname}`}</DialogTitle>
                </DialogHeader>
                <Image
                  src={`/static/association/members/photo/${photo}.jpg`}
                  alt={`${lastname} ${firstname}`}
                  className="aspect-auto h-full w-full object-contain"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </DialogContent>
            </Dialog>
          )}
          <AvatarFallback className="capitalize">{`${lastname.charAt(0)}${firstname.charAt(0)}`}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "lastname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
  },
  {
    accessorKey: "firstname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prénom" />
    ),
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
    cell: ({ row }) => {
      if (!row.original.phone) {
        return <Typography>Non renseigné</Typography>;
      }

      const phoneData = getPhoneData(row.original.phone);

      return (
        <a href={`tel:${row.original.phone}`} className="text-nowrap">
          {`0${phoneData.nationalNumber}`}
        </a>
      );
    },
  },
  {
    accessorKey: "mail",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return (
        <a href={`mailto:${row.original.mail}`}>
          <Mail className="h-4 w-4" />
        </a>
      );
    },
  },
  {
    accessorKey: "birthdate",
    header: "Date de naissance",
    cell: ({ row }) => {
      const member = row.original;

      return <>{member.birthdate.toLocaleDateString("fr-FR")}</>;
    },
  },
  {
    accessorKey: "address",
    header: "Adresse",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span>{row.original.address}</span>
        <span>
          {row.original.postalCode}, {row.original.city}
        </span>
      </div>
    ),
  },
  {
    id: "select",
    cell: ({ row }) => (
      <ChevronDown
        className={cn(
          "h-4 w-4 transition-transform",
          row.getIsExpanded() && "rotate-180",
        )}
      />
    ),
  },
];
