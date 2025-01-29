"use client";

import {
  Layout,
  LayoutDescription,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
} from "@/components/layout/layout";
import { trpc } from "@/trpc/TrpcProvider";
import { Photos } from "./photos";
import { PhotosCarousel } from "./photosCarousel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photos | Temple Team",
  description: "Toutes nos photos !",
  authors: {
    name: "BELLIER Benjamin",
    url: "https://github.com/BennyBellier",
  },
  category: "sports"
};

export default function Albums() {
  const { data, error } = trpc.photos.get.useQuery();

  if (error) {
    console.error(error);
  }

  return (
    <>
      <Layout>
        <LayoutHeader>
          <LayoutTitle>Photos</LayoutTitle>
          <LayoutDescription>
            Envie de voir nos photos ? C&apos;est par ici !
          </LayoutDescription>
        </LayoutHeader>
        <LayoutSection>
          <ul className="flex h-full w-full flex-wrap justify-center gap-3">
            <Photos photos={error ? data! : []} />
          </ul>
        </LayoutSection>
      </Layout>
      <PhotosCarousel content={data ?? []} />
    </>
  );
}
