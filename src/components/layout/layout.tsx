import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/utils";
import { Typography } from "../ui/typography";

export const LayoutSection = (props: ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      {...props}
      className={cn(
        "relative flex h-fit flex-col items-center lg:px-1050",
        props.className,
      )}
    />
  );
};
