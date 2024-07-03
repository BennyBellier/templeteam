import { ImageOff } from "lucide-react";
import { Typography } from "./typography";
import { cn } from "@/lib/utils";

export const ImageNotFound = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute flex h-full w-full flex-col items-center justify-center gap-2 text-foreground/50", className)}>
      <ImageOff strokeWidth={0.5} className="h-1/2 w-1/2" />
      <Typography as="p" variant="muted" className="text-[80%] font-medium">
        Image indisponible
      </Typography>
    </div>
  );
};
