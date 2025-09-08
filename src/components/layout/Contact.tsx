import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { LayoutSection } from "./layout";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const linkClass = cva(
  "group flex border rounded-full p-2.5 border-invert hover:border-background duration-200 focus:outline-none",
);

const iconClass = cva(
  "h-10 w-10 md:h-11 md:w-11 lg:h-12 lg:w-12 duration-200 group-hover:scale-105 drop-shadow-none group-hover:drop-shadow-[0.25rem_4px_2px_rgba(19,19,19,0.5)] transition-[color,_background-color,_border-color,_text-decoration-color,_fill,_stroke,_transform] focus:outline-none",
);

export const ContactBar= () => (
  <LayoutSection className="flex flex-col items-center gap-8">
    <div className="flex w-full flex-wrap items-center justify-around gap-5">
      <Typography variant="h1" className="text-4xl tracking-wide md:text-7xl">
        CONTACT
      </Typography>
      <div className="flex flex-col gap-1">
        <Typography variant="h3" className="text-md font-light tracking-normal">
          UNE DEMANDE D&apos;INFOS,
        </Typography>
        <Typography variant="h3" className="text-md font-light tracking-normal">
          DES RENSEIGNEMENTS ?
        </Typography>
      </div>
    </div>
    <div className="flex w-full justify-around">
      <Link
        href="/Contact"
        className={cn(linkClass())}
        aria-label="Contactez-nous"
        legacyBehavior>
        <Phone strokeWidth={1.1} className={cn(iconClass())} />
      </Link>
      <Link
        href="/Contact"
        className={cn(linkClass())}
        aria-label="Contactez-nous"
        legacyBehavior>
        <Mail strokeWidth={1.1} className={cn(iconClass())} />
      </Link>
      <Link
        href="/Contact"
        className={cn(linkClass())}
        aria-label="Contactez-nous"
        legacyBehavior>
        <MapPin strokeWidth={1.1} className={cn(iconClass())} />
      </Link>
    </div>
  </LayoutSection>
);
