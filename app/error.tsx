"use client";

import type { FallbackProps } from 'react-error-boundary';
import React from 'react';

import {
  Layout,
  LayoutDescription,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
} from "@/components/layout/layout";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

const FallbackError: React.FC<FallbackProps> = ({ resetErrorBoundary }) => {

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Oups</LayoutTitle>
        <LayoutDescription>
          Il semblerait qu&apos;une erreur se soit produite !
        </LayoutDescription>
      </LayoutHeader>
      <LayoutSection>
        <Typography>Une accrobatie de trop sûrement !</Typography>
        <Button onClick={() => resetErrorBoundary()}>Réessayer !</Button>
      </LayoutSection>
    </Layout>
  );
}

export default FallbackError;

