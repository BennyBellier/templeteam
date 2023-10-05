import Link from "next/link";
import Image from "next/image";
import Layout from "~/components/layout";
import { useState } from "react";
import { motion } from "framer-motion";

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
    const [imgLoading, setImgLoading] = useState(true);
    const [pulsing, setPulsing] = useState(true);

    const imageLoaded = () => {
      setImgLoading(false);
      setTimeout(() => setPulsing(false), 400);
    };

    return (
      <motion.div
        className={`flex h-fit w-fit items-center justify-center self-center justify-self-center rounded-lg bg-neutral-200 ${
          pulsing ? "pulse" : ""
        } loadable`}
      >
        <Link
          href={href}
          className="group flex h-fit w-fit items-center justify-center self-center justify-self-center"
        >
          <Image
            src={img}
            alt={img}
            fill={true}
            onLoad={imageLoaded}
            className={`relative h-56 w-96 rounded-lg object-cover transition-all duration-500 group-hover:brightness-75 overflow-hidden ${
              imgLoading ? "opacity-0 delay-500" : "opacity-100"
            }`}
          />
          <div className="absolute flex scale-100 items-center justify-center rounded-lg opacity-0 duration-500 group-hover:opacity-100">
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
            href="/portfolio/photos"
            img="/img/references/outsider.jpg"
            text="Vidéos"
          />
        </section>
      </Layout>
    </>
  );
}
