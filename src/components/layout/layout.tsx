import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "../../lib/utils";
import { References } from "../references/References";
import { Typography } from "../ui/typography";
import { ContactBar } from "./Contact";

export const Layout = ({
  children,
  noContact,
  noReferences,
  _props,
}: {
  children?: ReactNode;
  noContact?: boolean;
  noReferences?: boolean;
  _props?: ComponentPropsWithoutRef<"div">;
}) => {
  return (
    <>
      {children}
      {!noContact ? <ContactBar /> : null}
      {!noReferences ? <References /> : null}
    </>
  );
};

export const LayoutHeader = (props: ComponentPropsWithoutRef<"header">) => {
  return (
    <header
      {...props}
      className={cn(
        "flex w-full max-w-full flex-col items-center gap-6 border-b border-border px-4 pb-12 md:gap-10 md:pb-16 lg:px-1050",
        props.className,
      )}
    />
  );
};

export const LayoutTitle = (props: ComponentPropsWithoutRef<"h1">) => {
  return (
    <Typography
      {...props}
      variant="title"
      className={cn("text-center", props.className)}
    />
  );
};

export const LayoutDescription = (props: ComponentPropsWithoutRef<"h2">) => {
  return (
    <Typography
      {...props}
      variant="description"
      className={cn("w-full text-center md:w-3/4", props.className)}
    />
  );
};

export const LayoutSection = (props: ComponentPropsWithoutRef<"section">) => {
  return (
    <section
      {...props}
      className={cn(
        "relative flex h-fit w-full max-w-full flex-col items-center overflow-hidden px-4 py-6 md:px-6 lg:px-1050",
        props.className,
      )}
    />
  );
};
