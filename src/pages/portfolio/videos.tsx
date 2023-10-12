import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Layout from "~/components/layout";
import { HiOutlineChevronLeft } from "react-icons/hi2";
import { motion } from "framer-motion";
import {
  type VideoProps,
} from "../../utils/types";
import { api } from "~/utils/api";
import DotsLoader from "~/components/DotsLoader";
import { getSortedYoutubeVideos } from "~/lib/videos";

export async function getStaticProps() {
  const repo = await getSortedYoutubeVideos();
  return {
    props: {
      repo,
    },
      revalidate: 86400, // revalidate every 24 hours
  };
}

function VideoItem({ video }: { video: VideoProps }) {
  const [imgLoading, setImgLoading] = useState(true);
  const [pulsing, setPulsing] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    if (video.title && video.thumbnail && video.category) {
      setDataFetched(true);
    }
  }, [video]);

  const imageLoaded = () => {
    setImgLoading(false);
    setTimeout(() => setPulsing(false), 400);
  };

  return (
    <motion.a
      href={
        dataFetched ? `https://www.youtube.com/watch?v=${video.id}` : undefined
      }
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
  );
}


export default function VideosPage({
  repo,
}: {
  repo: VideoProps[];
}) {
  const [videos, setVideos] = useState<VideoProps[]>(repo);
  const videosQuery = api.example.fetchVideosList.useMutation();

  const VideosList = () => {
    if (videosQuery.isLoading)
      return <DotsLoader />;

    if (videosQuery.isError)
      return (
        <p className="text-center text-2xl font-bold">{`Une erreur s'est produite ! Veuillez réessayer`}</p>
      );



    if (!videos || videos.length === 0)
      return (
        <p className="text-center text-2xl font-bold">{`Aucune vidéo n'est disponible pour le moment !`}</p>
      );

    return (
      <>
        {videos.map((video, index) => {
          return <VideoItem key={index} video={video} />;
        })}
      </>
    );
  };

  const handleMoreVideos = () => {
    videosQuery.mutate({
      totalResults: videosQuery.data?.nextTotalResults ?? repo.length,
    });

    if (videosQuery.isSuccess) {
      setVideos([...videos, ...videosQuery.data?.videos]);
    }
  }

  const moreVideoDisable = () => {
    return false;
    return videosQuery.isLoading || videosQuery.isError || videos.length === 0 || videos.length === videosQuery.data?.nextTotalResults;
  }

  return (
    <>
      <Layout
        title="Vidéos"
        subtitle="Envie de voir nos vidéos ? C'est par ici !"
        display={{ ref: true, contact: true }}
      >
        <section className="flex flex-wrap justify-center gap-5 px-5 1050:px-1050">
          <VideosList />
        </section>

        <button onClick={handleMoreVideos} disabled={moreVideoDisable()} className={`w-fit px-3 py-2 border border-neutral-900 rounded-lg self-center duration-200 disabled:opacity-0 hover:border-transparent hover:scale-95 hover:drop-shadow-lg`}>Afficher plus</button>

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