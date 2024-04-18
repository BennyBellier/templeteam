import { Button } from "./button";
import { useSidebarState } from "../sidebar/SidebarProvider";
import { cn } from "@/lib/utils";

export function Hamburger({ className, ..._props }: { className?: string }) {
  const { sidebarOpen, handleSiberbarChange } = useSidebarState();
  return (
    <Button
      variant="invisible"
      size="icon"
      onClick={() => handleSiberbarChange()}
      className={cn(
        "hamburger hamburger--spin inline-block h-12",
        sidebarOpen ? "is-active" : "",
        className,
      )}
    >
      <span className="hamburger-box">
        <span className="hamburger-inner bg-neutral-800 before:bg-neutral-800 after:bg-neutral-800 dark:bg-neutral-50 dark:before:bg-neutral-50 dark:after:bg-neutral-50"></span>
      </span>
      <span className="sr-only">Toggle Menu</span>
    </Button>
  );
}
