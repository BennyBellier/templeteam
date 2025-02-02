"use client";

import { createContext, useContext, useState } from "react";

export const CarouselPhotosContext = createContext({
  carouselIdx: null as number | null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  setCarouselIdx: (idx: number | null) => {},
});

export function useCarouselPhotosIdx() {
  return useContext(CarouselPhotosContext);
}

export function CarouselPhotosProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [carouselIdx, setCarouselIdx] = useState<number | null>(null);

  return (
    <CarouselPhotosContext.Provider value={{ carouselIdx, setCarouselIdx }}>
      {children}
    </CarouselPhotosContext.Provider>
  );
}
