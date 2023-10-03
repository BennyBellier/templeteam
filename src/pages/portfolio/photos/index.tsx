import Image from "next/image";
import Link from "next/link";
import Layout from "~/components/layout";
import { HiOutlineChevronRight } from "react-icons/hi2";
import { getSortedAlbumData } from "~/lib/photos";
import { type AlbumsData } from "~/utils/types";

//
// eslint-disable-next-line @typescript-eslint/require-await
export async function getStaticProps() {
  const allAlbumsData = getSortedAlbumData();
  return {
    props: {
      allAlbumsData,
    },
  };
}

export default function Portfolio({
  allAlbumsData,
}: {
  allAlbumsData: AlbumsData[];
}) {
  return (
    <>
      <Layout
        title="Photos"
        subtitle="Envie de voir nos photos ? C'est par ici !"
        display={{ ref: true, contact: true }}
      >
        <section className="flex flex-wrap justify-center gap-5 px-5 1050:px-1050">
          {allAlbumsData === undefined || allAlbumsData.length === 0 ? (
            <p className="text-center text-2xl font-bold">
              Aucun album disponible pour le moment !
            </p>
          ) : (
            allAlbumsData?.map(({ albumName, link, date, thumbnail }) => (
              <Link
                href={`/portfolio/photos/${link}`}
                key={albumName}
                className="group flex aspect-video h-52 items-center justify-center self-center justify-self-center overflow-hidden rounded-lg"
              >
                <Image
                  src={thumbnail.file}
                  alt={`${albumName} couverture`}
                  width={thumbnail.width}
                  height={thumbnail.height}
                  className="aspect-video w-full grow rounded-lg object-cover object-center transition-transform duration-500 group-hover:scale-110 group-hover:brightness-75"
                />
                <div className="absolute flex w-96 flex-col items-center justify-center rounded-lg text-white opacity-0 duration-500 group-hover:opacity-100">
                  <h1 className="text-center text-2xl font-black uppercase italic drop-shadow-lg">
                    {albumName}
                  </h1>
                  <h2 className="text-md z-0 uppercase">{date}</h2>
                </div>
              </Link>
            ))
          )}
        </section>

        <Link
          href={"/portfolio/videos"}
          className="flex flex-row justify-end items-center gap-5 px-5 text-3xl font-black uppercase 1050:px-1050"
        >
          Vidéos
          <HiOutlineChevronRight className="text-4xl" />
        </Link>
      </Layout>
    </>
  );
}
