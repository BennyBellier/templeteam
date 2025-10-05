"use client";

import React from "react";
import type { FallbackProps } from "react-error-boundary";

import { Typography } from "@/components/ui/typography";

const FallbackError: React.FC<FallbackProps> = () => {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-2">
      <Typography>Oups</Typography>
      <Typography>
        Il semblerait qu&apos;une erreur se soit produite !
      </Typography>
      <Typography>Une accrobatie de trop sûrement !</Typography>
    </div>
  );
};

export default FallbackError;
