"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSeasons } from "@/providers/SeasonProvider";
import { type RouterOutputs } from "@/server/api/root";
import { trpc } from "@/trpc/TrpcProvider";
import type { LegalGuardian } from "@prisma/client";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Phone } from "lucide-react";
import { useState } from "react";
import { columns } from "./columns";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<
    RouterOutputs["association"]["dashboard"]["getSeasonMemberList"][number]
  >[];
  data: RouterOutputs["association"]["dashboard"]["getSeasonMemberList"];
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
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="ml-4 max-w-sm"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Liste des adhérents</CardTitle>
          <Badge variant="secondary">{data.length} membres</Badge>
        </CardHeader>
        <CardContent>
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
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
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
        </CardContent>
      </Card>
      {/* <DataTablePagination table={table} /> */}
    </>
  );
}

export function MembersTable() {
  const { currentSeason } = useSeasons();
  const fetch = trpc.association.dashboard.getSeasonMemberList.useQuery({
    season: currentSeason ?? undefined,
  });

  if (fetch.isLoading || !fetch.data) {
    return <div className="h-16 animate-pulse" />;
  }

  return <DataTable columns={columns} data={fetch.data} />;
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
