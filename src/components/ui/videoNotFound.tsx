import { VideoOff } from "lucide-react";
import { Typography } from "./typography";
import { cn } from "@/lib/utils";

export const VideoNotFound = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute flex h-full w-full flex-col items-center justify-center gap-2 text-foreground/50", className)}>
      <VideoOff strokeWidth={0.5} className="h-1/3 w-1/3" />
      <Typography as="p" variant="muted" className="text-lg font-medium">
        Vidéo indisponible
      </Typography>
    </div>
  );
};
