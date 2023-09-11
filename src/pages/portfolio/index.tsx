import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useWindowSize } from "~/components/elements";
import Layout from "~/components/layout";

export default function Portfolio() {
  const { width } = useWindowSize();

  const LinkImage = ({ href, img, text }: { href: string; img: string, text: string }) => {
    return (
      <Link
        href={href}
        className="group grid h-fit w-fit grid-cols-1 grid-rows-1 self-center justify-self-center"
      >
        <Image
          src={img}
          alt="img"
          {...(width < 1050
            ? { width: 250, height: 150 }
            : { width: 400, height: 200 })}
          className="col-end-2 row-end-2 h-56 w-96 rounded-lg object-cover"
          loading="eager"
        />
        <div className="col-end-2 row-end-2 flex items-center justify-center rounded-lg opacity-100 transition-opacity duration-200 group-hover:opacity-100 1050:bg-black/25 1050:opacity-0">
          <h1 className="text-4xl text-white drop-shadow-lg">{text}</h1>
        </div>
      </Link>
    );
  };

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
        <section className="flex flex-wrap justify-center gap-8 1050:gap-16 px-5 1050:px-1050">
          <LinkImage
            href="/portfolio/photos"
            img="/img/portfolio/photos/2022_17_26-06-23.jpg"
            text="Photos"
          />
          <LinkImage
            href="/portfolio/photos"
            img="/img/references/outsider.jpg"
            text="Vidéos"
          />
        </section>
      </Layout>
    </>
  );
}
