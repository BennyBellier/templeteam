import Image from "next/image";
import Link from "next/link";
import { api } from "~/utils/api";
import Layout from "~/components/layout";
import { HiOutlineChevronLeft } from "react-icons/hi2";

export default function Portfolio() {
  const videosQuery = api.content.videos.useQuery();
  return (
    <>
      <Layout
        title="Vidéos"
        subtitle="Envie de voir nos vidéos ? C'est par ici !"
        display={{ ref: true, contact: true }}
      >
        <section className="flex flex-wrap justify-center gap-5 px-5 1050:px-1050">
          {videosQuery.data?.map((video) => (
            <a
              href={video.link}
              key={video.link}
              target="_blank"
              className="grid h-44 w-80 grid-cols-1 grid-rows-1 self-center justify-self-center object-cover overflow-hidden rounded-lg aspect-video"
            >
              <Image
                src={"/img/portfolio/thumbnails/" + video.thumbnail}
                alt={video.title}
                width={video.width ? video.width : 1920}
                height={video.height ? video.height : 1080}
                className="col-end-2 row-end-2 rounded-lg self-center justify-self-center"
              />
              <div className="col-end-2 row-end-2 flex flex-col items-center justify-center rounded-lg bg-black/25 text-white">
                <h1 className="text-2xl drop-shadow-lg font-black italic uppercase">{video.title}</h1>
                <h2 className="text-md uppercase">{video.type}</h2>
              </div>
            </a>
          ))}
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
