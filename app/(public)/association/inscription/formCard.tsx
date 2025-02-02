import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { PropsWithChildren, ReactNode } from "react";

export type classNamesProps = {
  Card?: string;
  CardHeader?: string;
  CardTitle?: string;
  CardContent?: string;
  CardDescription?: string;
  CardFooter?: string;
};

export type stepCardProps = PropsWithChildren & {
  classNames?: classNamesProps;
  title: string;
  description?: string;
  button?: ReactNode;
};

const FormCard = ({
  title,
  description,
  children,
  button,
  classNames,
}: stepCardProps) => (
  <Card
    className={cn(
      "ease flex h-full max-w-[750px] flex-col overflow-hidden transition-transform duration-500",
      classNames?.Card,
    )}
  >
    <CardHeader className={cn("flex-none pb-2 pt-4", classNames?.CardHeader)}>
      <Typography
        as={CardTitle}
        variant="h1"
        className={cn("lg:text-4xl", classNames?.CardTitle)}
      >
        {title}
      </Typography>
      {description && (
        <Typography
          as={CardDescription}
          variant="lead"
          className={cn(classNames?.CardDescription)}
        >
          {description}
        </Typography>
      )}
    </CardHeader>
    <CardContent className={cn("grid h-full gap-6", classNames?.CardContent)}>
      {children}
    </CardContent>
    {button && (
      <CardFooter
        className={cn("h-12 w-full rounded-none p-0", classNames?.CardFooter)}
      >
        {button}
      </CardFooter>
    )}
  </Card>
);

FormCard.displayName = "FormCard";

export { FormCard };