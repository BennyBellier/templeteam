import Link from "next/link";
import Image from "next/image";
import Layout from "~/components/layout";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useWindowSize } from "~/components/elements";

export default function Portfolio() {
  const LinkImage = ({
    href,
    img,
    text,
  }: {
    href: string;
    img: string;
    text: string;
  }) => {
    const ref = useRef(null);
    const [imgLoading, setImgLoading] = useState(true);
    const [pulsing, setPulsing] = useState(true);
    const isInView = useInView(ref, { margin: "-45% 10% -45%" });
    const width = useWindowSize().width;

    const imageLoaded = () => {
      setImgLoading(false);
      setTimeout(() => setPulsing(false), 400);
    };

    return (
      <motion.div
        className={`flex h-fit w-fit items-center justify-center self-center justify-self-center rounded-lg bg-neutral-200 ${
          pulsing ? "animate-pulse" : ""
        }`}
      >
        <Link
          ref={ref}
          href={href}
          className="group flex h-fit w-fit items-center justify-center self-center justify-self-center"
        >
          <Image
            src={img}
            alt={img}
            fill
            sizes="(min-width: 424px) 384px, 95vw"
            onLoad={imageLoaded}
            className={`relative aspect-[3_/_2] w-screen md:w-[45vw] flex-grow overflow-hidden rounded-lg object-cover transition-all duration-500 group-hover:brightness-75 1050:h-80 1050:w-auto ${
              imgLoading ? "opacity-0 delay-500" : "opacity-100"
            } ${width < 1050 && isInView ? "brightness-[.7]" : ""}`}
          />
          <div
            className={`absolute flex scale-100 items-center justify-center rounded-lg opacity-0 duration-500 group-hover:opacity-100 ${
              width < 1050 && isInView ? "opacity-100" : ""
            }`}
          >
            <h1 className="text-4xl text-white drop-shadow-lg">{text}</h1>
          </div>
        </Link>
      </motion.div>
    );
  };

  return (
    <>
      <Layout
        title="Portfolio"
        subtitle="Fière de nos années d'expérience. Nous mettons nos compétences à profits pour créer des images sensationnelles et inoubliables."
        display={{ ref: true, contact: true }}
      >
        <section className="flex flex-wrap justify-center gap-8 px-5 1050:gap-16 1050:px-1050">
          <LinkImage
            href="/portfolio/photos"
            img="/img/team/Team.jpg"
            text="Photos"
          />
          <LinkImage
            href="/portfolio/videos"
            img="/img/references/outsider.jpg"
            text="Vidéos"
          />
        </section>
      </Layout>
    </>
  );
}
