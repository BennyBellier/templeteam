"use client";

import type { FallbackProps } from 'react-error-boundary';
import React from 'react';

import { Typography } from "@/components/ui/typography";

const FallbackError: React.FC<FallbackProps> = () => {

  return (
    <div className="flex flex-col justify-between flex-1 h-full">
        <Typography>Oups</Typography>
        <Typography>Il semblerait qu&apos;une erreur se soit produite !</Typography>
        <Typography>Une accrobatie de trop sûrement !</Typography>
    </div>
  );
}

export default FallbackError;