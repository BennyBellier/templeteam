import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { api } from "~/utils/api";
import Layout from "~/components/layout";

export default function Portfolio() {
  const photosQuery = api.content.photos.useQuery();
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedPhoto, setZoomedPhoto] = useState(0);

  const handlerZoom = (index: number) => {
    setIsZoomed(true);
    setZoomedPhoto(index);
  };

  return (
    <>
      <Head>
        <title>Photos | Temple Team</title>
      </Head>
      <Layout
        title="Photos"
        subtitle="Envie de voir nos photos ? C'est par ici !"
        display={{ ref: true, contact: true }}
      >
        <section className="flex flex-wrap justify-center 1050:justify-start gap-5 px-5 1050:px-1050">
          {photosQuery.data?.map((photo) => (
            <figure
              key={photo.img}
              className="grid h-fit w-fit grid-cols-1 grid-rows-1 self-center justify-self-center overflow-hidden rounded-lg object-cover aspect-auto cursor-zoom-in"
            >
              <Image
                src={"/img/portfolio/photos/" + photo.img}
                alt={photo.title}
                width={photo.width}
                height={photo.height}
                className="col-end-2 row-end-2 rounded-lg object-center aspect-auto w-full h-56 md:h-80 1050:h-80 grow"
              />
            </figure>
          ))}
        </section>
      </Layout>
    </>
  );
}
