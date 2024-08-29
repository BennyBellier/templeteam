"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

const links = [
  {
    id: 1,
    name: "Main",
    viewCount: 500,
  },
  {
    id: 2,
    name: "Contact",
    viewCount: 50,
  },
  {
    id: 3,
    name: "Legals",
    viewCount: 13,
  },
  {
    id: 4,
    name: "Products",
    viewCount: 1235,
  },
];

export default function Playground() {
  return (
    <div className="w-full sm:p-4">
      <h2 className="p-4">All links</h2>
      <div className="rounded-md sm:border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Name</TableHead>
              <TableHead className="font-medium">Link</TableHead>
              <TableHead className="font-medium">Views</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links
              ? links.map((link) => (
                  <Collapsible key={link.id} asChild>
                    <>
                      <CollapsibleTrigger asChild>
                        <TableRow>
                          <TableCell>{link.name}</TableCell>
                          <TableCell>{link.id}</TableCell>
                          <TableCell>
                            {link.viewCount}

                            <div>{link.viewCount}</div>
                          </TableCell>
                        </TableRow>
                      </CollapsibleTrigger>
                      <CollapsibleContent asChild>
                        <TableRow key={link.id}>
                          <TableCell>{link.name}</TableCell>
                          <TableCell>empty</TableCell>
                          <TableCell>Gauge</TableCell>
                        </TableRow>
                      </CollapsibleContent>
                    </>
                  </Collapsible>
                ))
              : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
