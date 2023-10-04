import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Layout from "~/components/layout";
import { getVideosList } from "~/lib/videos";
import { HiOutlineChevronLeft } from "react-icons/hi2";
import type { VideoProps } from "~/utils/types";
import { motion } from "framer-motion";

export async function getStaticProps() {
  const videos = await getVideosList();
  return {
    props: {
      videos,
    },
  };
}

export default function VideosPage({ videos }: { videos: VideoProps[] }) {
  const [imgLoading, setImgLoading] = useState(true);
  const [pulsing, setPulsing] = useState(true);

  const imageLoaded = () => {
    setImgLoading(false);
    setTimeout(() => setPulsing(false), 400);
  };

  const VideosMap = videos?.map((video) => (
    <motion.a
      href={`https://www.youtube.com/watch?v=${video.id}`}
      key={video.id}
      target="_blank"
      className={`flex aspect-video h-44 w-80 grid-cols-1 grid-rows-1 self-center justify-self-center overflow-hidden rounded-lg bg-neutral-200 object-cover ${
        pulsing ? "animate-pulse" : ""
      }`}
    >
      <Image
        src={video.thumbnail}
        alt={video.title}
        width={480}
        height={360}
        onLoad={imageLoaded}
        className={`relative self-center justify-self-center rounded-lg brightness-75 ${
          imgLoading ? "opacity-0" : "opacity-100"
        }`}
      />
      <div
        className={`absolute flex h-44 w-80 flex-col items-center justify-center gap-3 rounded-lg text-white ${
          imgLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <h1 className="text-center text-2xl font-black uppercase italic drop-shadow-lg">
          {video.title}
        </h1>
        <h2 className="text-md uppercase">{video.category}</h2>
      </div>
    </motion.a>
  ));

  const Video = () => {
    if (videos === undefined)
      return (
        <p className="text-center text-2xl font-bold">
          {`Une erreur s'est produite ! Veuillez réessayer plus tard.`}
        </p>
      );
    else if (videos.length === 0)
      return (
        <p className="text-center text-2xl font-bold">
          {`Aucune vidéo n'est disponible pour le moment !`}
        </p>
      );
    else return VideosMap;
  };

  return (
    <>
      <Layout
        title="Vidéos"
        subtitle="Envie de voir nos vidéos ? C'est par ici !"
        display={{ ref: true, contact: true }}
      >
        <section className="flex flex-wrap justify-center gap-5 px-5 1050:px-1050">
          <Video />
        </section>

        <Link
          href={"/portfolio/photos"}
          className="flex flex-row items-center gap-5 px-5 text-3xl font-black uppercase 1050:px-1050"
        >
          <HiOutlineChevronLeft className="text-4xl" />
          Photos
        </Link>
      </Layout>
    </>
  );
}
