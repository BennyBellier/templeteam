"use client";

import type { Member } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

import { MoreHorizontal, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/ui/data-table";

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "photo",
    header: "Photo",
    cell: ({ row }) => {
      const lastname: string = row.getValue("lastname");
      const firstname: string = row.getValue("firstname");
      const photo: string = row.getValue("photo");

      return (
        <Avatar>
          <Dialog>
            <DialogTrigger asChild>
              <AvatarImage
                src={`/static/association/members/photo/${photo}.jpg`}
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
    accessorKey: "birthdate",
    header: "Date de naissance",
    cell: ({ row }) => {
      const member = row.original;

      return <>{member.birthdate.toLocaleDateString("fr-FR")}</>;
    },
  },
  {
    accessorKey: "gender",
    header: "Genre",
    id: "actions",
    /* cell: ({ row }) => {
      const member = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(member.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }, */
  },
  {
    accessorKey: "mail",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return <a href={`mailto:${row.original.mail}`}>{row.original.mail}</a>;
    },
  },
  {
    accessorKey: "phone",
    header: "Téléphone",
    cell: ({ row }) => {
      return (
        <a href={`tel:${row.original.phone}`} className="text-nowrap">
          {row.original.phone?.substring(3).padStart(1,"0").match(/.{1,2}/g)?.join(" ")}
        </a>
      );
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
    accessorKey: "medicalComment",
    header: () => (
      <div className="w-60">Information médicale</div>
    ),
    cell: ({ row }) => {
      return <div className="w-60 overflow-hidden h-4">{row.original.medicalComment}</div>;
    },
  },
  {
    accessorKey: "legalGuardians",
    header: "Résponsable légaux",
  },
  {
    accessorKey: "expander",
    cell: ({ row }) => {
      row.getCanExpand() ? (
        <button
          {...{
            onClick: row.getToggleExpandedHandler(),
            style: { cursor: 'pointer' },
          }}
        >
          {row.getIsExpanded() ? '👇' : '👉'}
        </button>
      ) : (
        '🔵'
      )
    }
  }
];
