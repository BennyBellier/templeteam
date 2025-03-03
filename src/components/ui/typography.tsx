import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  ElementType,
  PropsWithChildren,
} from "react";

interface PolymorphicAsProp<E extends ElementType> {
  as?:
    | E
    | React.ComponentType<Omit<ComponentPropsWithoutRef<E>, "as">>
    | React.FunctionComponent<Omit<ComponentPropsWithoutRef<E>, "as">>
    | React.ComponentType<Omit<ComponentPropsWithRef<E>, "as">>
    | React.FunctionComponent<Omit<ComponentPropsWithRef<E>, "as">>;
}

type PolymorphicProps<E extends ElementType> = PropsWithChildren<
  | (Omit<ComponentPropsWithoutRef<E>, "as"> & PolymorphicAsProp<E>)
  | (Omit<ComponentPropsWithRef<E>, "as"> & PolymorphicAsProp<E>)
>;

const typographyVariants = cva("", {
  variants: {
    variant: {
      title:
        "scroll-m-20 text-4xl md:text-5xl font-extrabold tracking-widest lg:text-6xl font-caption uppercase",
      description:
        "scroll-m-20 text-xl md:text-xl lg:text-xl font-light tracking-wide transition-colors text-center",
      h1: "scroll-m-20 text-3xl md:text-4xl font-extrabold tracking-tight lg:text-5xl font-caption",
      h2: "scroll-m-20 text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight transition-colors first:mt-0 font-caption",
      h3: "scroll-m-20 text-xl font-semibold tracking-tight font-caption",
      p: "leading-7 [&:not(:first-child)]:mt-6",
      base: "",
      quote: "mt-6 border-l-2 pl-6 italic",
      code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      alert: "text-destructive",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm leading-none",
      muted: "text-sm text-muted-foreground",
      link: "font-normal lg:font-light text-xl lg:text-lg",
      footerLink: "font-light lg:font-light text-xl lg:text-base",
      portfolio: "text-5xl text-white drop-shadow font-caption font-medium",
      postCardTitle:
        "scroll-m-20 text-lg md:text-2xl lg:text-3xl font-semibold tracking-tight transition-colors first:mt-0 font-caption",
      postCardContent: "",
      postCardReadTime: "self-end flex gap-1 text-base font-light leading-none items-center justify-center",
    },
  },
  defaultVariants: {
    variant: "base",
  },
});
type TypographyCvaProps = VariantProps<typeof typographyVariants>;

const defaultElement = "p";

const defaultElementMapping: Record<
  NonNullable<TypographyCvaProps["variant"]>,
  ElementType
> = {
  title: "h1",
  description: "h2",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  p: "p",
  quote: "blockquote" as "p",
  code: "code",
  alert: "p",
  lead: "p",
  large: "p",
  small: "p",
  muted: "p",
  link: "a",
  footerLink: "a",
  base: "p",
  portfolio: "h1",
  postCardTitle: "h1",
  postCardContent: "p",
  postCardReadTime: "span",
} as const;

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
const getDefaultElement = (variant: TypographyCvaProps["variant"]) => {};

export function Typography<E extends ElementType = typeof defaultElement>({
  as,
  children,
  className,
  variant,
  ...restProps
}: PolymorphicProps<E> & TypographyCvaProps) {
  const Component: ElementType =
    as ?? defaultElementMapping[variant ?? "base"] ?? defaultElement;

  return (
    <Component
      {...(restProps as ComponentPropsWithRef<E> | ComponentPropsWithoutRef<E>)}
      className={cn(typographyVariants({ variant }), className)}
    >
      {children}
    </Component>
  );
}
