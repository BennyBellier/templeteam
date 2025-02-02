import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import type {
  CollapsibleContentProps,
  CollapsibleProps,
  CollapsibleTriggerProps,
} from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import { AccessibleIcon } from "./accessible-icon";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

const TableRowExpandable = ({ children, ...props }: CollapsibleProps) => {
  return (
    <Collapsible asChild {...props}>
      <>{children}</>
    </Collapsible>
  );
};

const TableRowExpandableTrigger = ({
  children,
  className,
  ...props
}: CollapsibleTriggerProps) => {
  return (
    <CollapsibleTrigger
      asChild
      className="group/trigger hover:cursor-pointer"
      {...props}
    >
      <TableRow className={className}>{children}</TableRow>
    </CollapsibleTrigger>
  );
};

const TableRowExpandableIndicator = ({
  className,
  ...props
}: {
  className?: string | undefined;
}) => (
  <TableCell>
    <AccessibleIcon label="table row expand indicator">
    <ChevronDown
      {...props}
      className={cn(
        "transition-transform duration-300 group-data-open/trigger:rotate-180",
        className,
      )}
    />
    </AccessibleIcon>
  </TableCell>
);

export interface TableRowExpandableContent extends CollapsibleContentProps {
  colSpan: number
}

const TableRowExpandableContent = ({
  children,
  className,
  colSpan,
  ...props
}: TableRowExpandableContent) => {
  return (
    <CollapsibleContent
      asChild
      className="border-b outline-none transition-all group-data-open/collapse:animate-collapsible-down group-data-closed/collapse:animate-collapsible-up"
      {...props}
    >
      <TableRow className={className}>
        <TableCell colSpan={colSpan}>{children}</TableCell>
      </TableRow>
    </CollapsibleContent>
  );
};

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableRowExpandable,
  TableRowExpandableTrigger,
  TableRowExpandableIndicator,
  TableRowExpandableContent,
};
