import Image from "next/image";
import { Typography } from "@/components/ui/typography";
import Link from "next/link";
import { Youtube, Instagram, Facebook, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const socialLinksClass = cn(
  "group flex h-10 w-10 items-center justify-center rounded-full border border-footer-foreground transition-colors duration-200 hover:bg-footer-foreground",
);

const socialLinksIconClass = cn(
  "h-6 w-6 text-footer-foreground transition-colors duration-200 group-hover:text-footer",
);

export function Footer() {
  return (
    <footer className="grid auto-rows-auto bg-footer text-footer-foreground justify-center px-2 pb-4 pt-8 lg:grid-cols-3 lg:grid-rows-1 lg:p-1050 lg:pb-2 lg:pt-6">
      <div className="flex w-full flex-col gap-2">
        <Image
          src="/img/footer.png"
          width={651}
          height={271}
          alt="Logo de la Temple Team"
          className="w-[300px]"
        />
        <Typography variant="h3" className="text-center font-normal">
          {" "}
          La Temple Team s'occupe de tout !
        </Typography>
      </div>
      <div className="flex justify-between">
        <a
          href="https://www.youtube.com/@TempleTeam"
          className={socialLinksClass}
          aria-label="Youtube"
        >
          <Youtube strokeWidth={1} className={socialLinksIconClass} />
        </a>
        <a
          href="https://www.instagram.com/templeteam.off"
          className={socialLinksClass}
          aria-label="Instagram"
        >
          <Instagram strokeWidth={1} className={socialLinksIconClass} />
        </a>
        <a
          href="https://www.facebook.com/templeteam.off"
          className={socialLinksClass}
          aria-label="Facebook"
        >
          <Facebook strokeWidth={1} className={socialLinksIconClass} />
        </a>
        <Link
          href="/contact"
          className={socialLinksClass}
          aria-label="Contact"
        >
          <Mail strokeWidth={1} className={socialLinksIconClass} />
        </Link>
      </div>
    </footer>
  );
}
