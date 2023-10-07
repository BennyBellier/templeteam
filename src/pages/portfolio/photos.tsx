import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Layout from "~/components/layout";
import { HiOutlineChevronRight } from "react-icons/hi2";
import { getSortedAlbumData } from "~/lib/photos";
import { type AlbumsData } from "~/utils/types";
import { useInView } from "framer-motion";
import { useWindowSize } from "~/components/elements";
import { motion } from "framer-motion";
import { api } from "~/utils/api";

// eslint-disable-next-line @typescript-eslint/require-await
export async function getStaticProps() {
  const allAlbumsData = getSortedAlbumData();
  return {
    props: {
      allAlbumsData,
    },
  };
}

const AlbumLink = ({ albumName, link, date, thumbnail }: AlbumsData) => {
  const ref = useRef(null);
  const width = useWindowSize().width;
  const isInView = useInView(ref, { margin: "-45% 10% -45%" });
  const [imgLoading, setImgLoading] = useState(true);
  const [pulsing, setPulsing] = useState(true);

  const imageLoaded = () => {
    setImgLoading(false);
    setTimeout(() => setPulsing(false), 400);
  };

  return (
    <motion.div
      className={`flex aspect-video items-center justify-center self-center justify-self-center overflow-hidden rounded-lg bg-neutral-200 ${
        pulsing ? "animate-pulse " : "group"
      } ${width > 409 ? "h-52" : ""}`}
    >
      <Link
        ref={ref}
        href={`/portfolio/photos/${link}`}
        key={albumName}
        className="flex items-center justify-center overflow-hidden rounded-lg"
      >
        <Image
          src={thumbnail.file}
          alt={`${albumName} couverture`}
          fill
          sizes="(min-width: 409px) 370px, 95vw"
          onLoad={imageLoaded}
          className={`relative aspect-video w-full grow rounded-lg object-cover object-center transition-transform duration-700 group-hover:scale-110 group-hover:brightness-75 ${
            width < 1050 && isInView ? "scale-110 brightness-75" : ""
          } ${imgLoading ? "opacity-0" : "opacity-100"}`}
        />
        <div
          className={`absolute flex w-96 flex-col items-center justify-center rounded-lg text-white opacity-0 delay-200 duration-500 group-hover:opacity-100 ${
            width < 1050 && isInView ? "opacity-100" : ""
          }`}
        >
          <h1 className="text-center text-2xl font-black uppercase italic drop-shadow-lg">
            {albumName}
          </h1>
          <h2 className="text-md z-0 uppercase">{date}</h2>
        </div>
      </Link>
    </motion.div>
  );
};

export default function Photos({
  allAlbumsData,
}: {
  allAlbumsData: AlbumsData[];
}) {
  const PhotosMap = allAlbumsData?.map(
    ({ albumName, link, date, thumbnail }) => (
      <AlbumLink
        key={albumName}
        albumName={albumName}
        link={link}
        date={date}
        thumbnail={thumbnail}
      />
    )
  );

  const Albums = () => {
    if (allAlbumsData === undefined)
      return (
        <p className="text-center text-2xl font-bold">
          {`Une erreur s'est produite ! Veuillez réessayer plus tard.`}
        </p>
      );
    else if (allAlbumsData.length === 0)
      return (
        <p className="text-center text-2xl font-bold">
          {`Aucun album n'est disponible pour le moment !`}
        </p>
      );
    else return PhotosMap;
  };

  return (
    <>
      <Layout
        title="Photos"
        subtitle="Envie de voir nos photos ? C'est par ici !"
        display={{ ref: true, contact: true }}
      >
        <section className="flex flex-wrap justify-center gap-5 px-5 1050:px-1050">
          <Albums />
        </section>

        <Link
          href={"/portfolio/videos"}
          className="flex flex-row items-center justify-end gap-5 px-5 text-3xl font-black uppercase 1050:px-1050"
        >
          Vidéos
          <HiOutlineChevronRight className="text-4xl" />
        </Link>
      </Layout>
    </>
  );
}
