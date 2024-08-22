"use client";

import { useReferencesStore } from "@/stores/referencesStore";
import { trpc } from "@/trpc/TrpcProvider";
import React from "react";
import { useShallow } from "zustand/react/shallow";

export const ReferencesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { setReferences } = useReferencesStore();

  const isInitialized = useReferencesStore(
    useShallow((state) => state.isInitialized),
  );

  const { data, error } = trpc.references.getAll.useQuery(undefined, {
    enabled: !isInitialized,
  });

  if (error) {
    console.error("Failed to fetch references", error);
  } else if (data && !isInitialized) {
    setReferences(data);
  }

  return <>{children}</>;
};
