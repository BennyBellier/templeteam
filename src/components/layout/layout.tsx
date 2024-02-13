import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "../../lib/utils";
import { References } from "../references/References";
import { Typography } from "../ui/typography";
import { ContactBar } from "./Contact";

export const Layout = ({
  children,
  noContact,
  noReferences,
  props,
}: {
  children?: ReactNode;
  noContact?: boolean;
  noReferences?: boolean;
  props?: ComponentPropsWithoutRef<"div">;
}) => {
  return (
    <>
      {children}
      {!noContact ? <ContactBar /> : null}
      {!noReferences ? <References /> : null }
    </>
  );
};

export const LayoutSection = (props: ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      {...props}
      className={cn(
        "relative flex h-fit flex-col items-center px-5 py-6 lg:px-1050",
        props.className,
      )}
    />
  );
};

export const LayoutHeader = (props: ComponentPropsWithoutRef<"div">) => {
  return (
    <header
      {...props}
      className={cn(
        "flex w-full flex-col items-center gap-10 md:flex-1 border-b border-border px-1050 pb-16",
        props.className,
      )}
    />
  );
};

export const LayoutTitle = (props: ComponentPropsWithoutRef<"h1">) => {
  return <Typography {...props} variant="title" className={cn(props.className, "")} />;
};

export const LayoutDescription = (props: ComponentPropsWithoutRef<"p">) => {
  return <Typography {...props} variant="description" className={cn(props.className, "w-3/4")} />;
};
