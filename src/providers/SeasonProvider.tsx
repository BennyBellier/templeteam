"use client";

import { trpc } from "@/trpc/TrpcProvider";
import {
  createContext,
  useContext,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";

interface SeasonContextType {
  seasons: string[];
  currentSeason: string | null;
  setCurrentSeason: (season: string) => void;
}

const SeasonsContext = createContext<SeasonContextType | undefined>(undefined);

export function useSeasons() {
  const context = useContext(SeasonsContext);
  if (!context) {
    throw new Error("useSeasons must be used within a SeasonsProvider.");
  }
  return context;
}

export const SeasonsProvider: FC<
  PropsWithChildren & { initialSeasons: string[]; InitialCurrentSeason: string }
> = ({ children, initialSeasons, InitialCurrentSeason }) => {
  const [seasons] = useState<string[]>(initialSeasons);
  const [currentSeason, setCurrentSeason] = useState<string | null>(InitialCurrentSeason ?? null);

  return (
    <SeasonsContext.Provider
      value={{
        seasons,
        currentSeason,
        setCurrentSeason,
      }}
    >
      {children}
    </SeasonsContext.Provider>
  );
};
