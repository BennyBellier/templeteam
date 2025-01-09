"use client";
import {
  DataTablePagination,
  DataTableViewOptions,
} from "@/components/ui/data-table";
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
import { Button } from "@/components/ui/button";
import { MemberWithLegalGuardians } from "./columns";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<
  MemberWithLegalGuardians
  >[];
  data: TData[];
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
    getPaginationRowModel: getPaginationRowModel(),
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
          className="max-w-sm ml-4"
        />
        </div>
        <ScrollArea className="flex-1 max-h-full">
          <Table className="w-full border-b max-h-full">
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
                          <div className="grid px-10">
                            <h2 className=" font-bold">More Details</h2>
                            <p>
                              Information médicale:{" "}
                              <span className=" text-slate-500">
                                {row.original.medicalComment}
                              </span>
                            </p>
                            <p>
                              Responsable légaux:{" "}
                              <span className=" capitalize text-slate-500">
                                {row.original.legalGuardians[0].lastname}
                              </span>
                            </p>
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
      <DataTablePagination table={table} />
    </>
  );
}
