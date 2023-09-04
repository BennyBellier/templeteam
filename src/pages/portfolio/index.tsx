import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useWindowSize } from "~/components/elements";
import Layout from "~/components/layout";

export default function Portfolio() {
  const { width } = useWindowSize();
  return (
    <>
      <Head>
        <title>Portfolio | Temple Team</title>
      </Head>
      <Layout
        title="Portfolio"
        subtitle="Fière de nos années d'expérience. Nous mettons nos compétences à profits pour créer des images sensationnelles et inoubliables."
        display={{ ref: true, contact: true }}
      >
        <section className="flex gap-8 flex-wrap justify-center 1050:gap-16 1050:px-1050">
          <Link
            href="/portfolio/photos"
            className="group grid h-fit w-fit grid-cols-1 grid-rows-1 self-center justify-self-center"
          >
            <Image
              src="/img/references/outsider.jpg"
              alt="img"
              {...(width < 1050
                ? { width: 250, height: 150 }
                : { width: 400, height: 200 })}
              className="col-end-2 row-end-2 rounded-lg h-56 w-96 object-cover"
            />
            <div className="col-end-2 row-end-2 flex items-center justify-center rounded-lg opacity-100 transition-opacity duration-500 group-hover:opacity-100 1050:bg-black/25 1050:opacity-0">
              <h1 className="text-4xl text-white drop-shadow-lg">Photos</h1>
            </div>
          </Link>
          <Link
            href="/portfolio/videos"
            className="group grid h-fit w-fit grid-cols-1 grid-rows-1 self-center justify-self-center"
          >
            <Image
              src="/img/references/outsider.jpg"
              alt="img"
              {...(width < 1050
                ? { width: 250, height: 150 }
                : { width: 400, height: 200 })}
              className="col-end-2 row-end-2 rounded-lg h-56 w-96 object-cover"
            />
            <div className="col-end-2 row-end-2 flex items-center justify-center rounded-lg opacity-100 transition-opacity duration-500 group-hover:opacity-100 1050:bg-black/25 1050:opacity-0">
              <h1 className="text-4xl text-white drop-shadow-lg">Vidéos</h1>
            </div>
          </Link>
        </section>
      </Layout>
    </>
  );
}
