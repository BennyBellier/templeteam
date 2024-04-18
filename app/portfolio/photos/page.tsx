import {
  Layout,
  LayoutDescription,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
} from "@/components/layout/layout";
import { getPhotos } from "@/server/get-photos";
import { Photos } from "./photos";
import { PhotosCarousel } from "./photosCarousel";

export default async function Albums() {
  const photos = await getPhotos();

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
            <Photos photos={photos} />
          </ul>
        </LayoutSection>
      </Layout>
      <PhotosCarousel content={photos} />
    </>
  );
}
