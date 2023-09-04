import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { api } from "~/utils/api";
import Layout from "~/components/layout";
import { HiOutlineArrowsExpand } from "react-icons/hi";

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
        <section className="flex flex-wrap justify-center gap-5 px-5 1050:justify-start 1050:px-1050">
          {photosQuery.data?.map((photo, index) => (
            <figure
              key={photo.img}
              className="group grid aspect-auto h-fit w-fit cursor-pointer grid-cols-1 grid-rows-1 self-center justify-self-center overflow-hidden rounded-lg object-cover"
              onClick={() => handlerZoom(index)}
            >
              <Image
                src={"/img/portfolio/photos/" + photo.img}
                alt={photo.title}
                width={photo.width}
                height={photo.height}
                className="col-end-2 row-end-2 aspect-auto h-56 w-full grow rounded-lg object-center transition-transform duration-500 group-hover:scale-105 md:h-80 1050:h-80 group-hover:brightness-75"
              />
              <div className="col-end-2 row-end-2 flex items-center justify-center rounded-lg">
                <HiOutlineArrowsExpand className="text-4xl text-white drop-shadow-lg opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-trasnform duration-300" />
              </div>
            </figure>
          ))}
        </section>
      </Layout>
    </>
  );
}
