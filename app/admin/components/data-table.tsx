"use client";
import { DataTablePagination } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { v4 as uuid4 } from "uuid";
import { cn } from "@/lib/utils";
import type { MemberWithLegalGuardians } from "./columns";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Phone, Stethoscope } from "lucide-react";
import type { LegalGuardian } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<MemberWithLegalGuardians>[];
  data: MemberWithLegalGuardians[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <>
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Filtrer par nom/prénom..."
          value={
            (table.getColumn("firstname")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("firstname")?.setFilterValue(event.target.value)
          }
          className="ml-4 max-w-sm"
        />
      </div>
      <ScrollArea className="max-h-full flex-1">
        <Table className="max-h-full w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <>
                  <TableRow
                    onClick={() => row.toggleExpanded()}
                    key={uuid4()}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      row.getIsExpanded() && "border-none bg-muted/50",
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {/* this render the expanded row */}
                  {row.getIsExpanded() && (
                    <TableRow key={uuid4()} className="bg-muted/50">
                      <TableCell colSpan={columns.length} className="h-24">
                        {/* You can create a seperate component to display the expanded data */}
                        <div className="grid px-10 grid-cols-3 gap-4">
                          {row.original.medicalComment && (
                            <Alert className="h-fit w-fit self-center justify-self-center">
                              <Stethoscope className="h-4 w-4" />
                              <AlertTitle>Contact d&apos;urgence</AlertTitle>
                              <AlertDescription className="flex flex-col gap-1">
                                {row.original.medicalComment}
                              </AlertDescription>
                            </Alert>
                          )}
                          <LegalContactAlert
                            legualGuardians={row.original.legalGuardians}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
      {/* <DataTablePagination table={table} /> */}
    </>
  );
}

function LegalContactAlert({
  legualGuardians,
}: {
  legualGuardians: LegalGuardian[];
}) {
  if (legualGuardians.length > 0 && legualGuardians[0]) {
    return (
      <Alert className="h-fit w-fit shadow-md">
        <Phone className="h-4 w-4" />
        <AlertTitle>Contact d&apos;urgence</AlertTitle>
        <AlertDescription className="flex flex-col gap-1">
          <div
            key={legualGuardians[0].id}
            className="grid grid-cols-2 items-center justify-between gap-1 whitespace-nowrap"
          >
            <span className="row-span-2">
              {legualGuardians[0].firstname} {legualGuardians[0].lastname}
            </span>
            <a href={`tel:${legualGuardians[0].phone}`} className="underline">
              {"0"
                .concat(legualGuardians[0].phone.substring(3))
                .match(/.{1,2}/g)
                ?.join(" ")}
            </a>
            <a
              href={`mailto:${legualGuardians[0].mail}`}
              className="col-start-2 underline"
            >
              {legualGuardians[0].mail}
            </a>
          </div>
          {legualGuardians.length > 1 && legualGuardians[1] && (
            <>
              <Separator />
              <div
                key={legualGuardians[1].id}
                className="grid grid-cols-2 items-center justify-between gap-1 whitespace-nowrap"
              >
                <span className="row-span-2">
                  {legualGuardians[1].firstname} {legualGuardians[1].lastname}
                </span>
                <a
                  href={`tel:${legualGuardians[1].phone}`}
                  className="underline"
                >
                  {"0"
                    .concat(legualGuardians[1].phone.substring(3))
                    .match(/.{1,2}/g)
                    ?.join(" ")}
                </a>
                <a
                  href={`mailto:${legualGuardians[1].mail}`}
                  className="underline"
                >
                  {legualGuardians[1].mail}
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
