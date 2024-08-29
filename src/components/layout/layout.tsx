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
  _props?: ComponentPropsWithoutRef<"article">;
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
        "flex w-full flex-col items-center gap-10 border-b border-border px-1050 pb-16 md:flex-1",
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
      className={cn(props.className, "text-center")}
    />
  );
};

export const LayoutDescription = (props: ComponentPropsWithoutRef<"h2">) => {
  return (
    <Typography
      {...props}
      variant="description"
      className={cn(props.className, "w-3/4")}
    />
  );
};

export const LayoutSection = (props: ComponentPropsWithoutRef<"section">) => {
  return (
    <section
      {...props}
      className={cn(
        "relative flex h-fit flex-col items-center px-5 py-6 lg:px-1050",
        props.className,
      )}
    />
  );
};
