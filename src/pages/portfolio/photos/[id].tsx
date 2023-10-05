import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Layout from "~/components/layout";
import {
  HiXMark,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import { getAlbumData, getAllAlbumNames } from "~/lib/photos";
import { type AlbumProps } from "~/utils/types";

export function getStaticPaths() {
  const paths = getAllAlbumNames();
  return {
    paths,
    fallback: false,
  };
}

export function getStaticProps({ params }: { params: { id: string } }) {
  const albumData = getAlbumData(params.id);
  return {
    props: {
      albumData,
    },
  };
}

const ImageWithLoading = ({
  id,
  src,
  width,
  height,
  index,
  handlerZoom,
}: {
  id: string;
  src: string;
  index: number;
  width: number;
  height: number;
  handlerZoom: (value: number) => void;
}) => {
  const [imgLoading, setImgLoading] = useState(true);
  const [pulsing, setPulsing] = useState(true);

  const imageLoaded = () => {
    setImgLoading(false);
    setTimeout(() => setPulsing(false), 400);
  };

  return (
    <motion.div
      className={`group flex aspect-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-neutral-200 ${
        pulsing ? "animate-pulse" : ""
      }`}
      initial={{ height: height / 140 + "rem", width: width / 140 + "rem" }}
      animate={{
        width: imgLoading ? width / 140 + "rem" : "auto",
        height: imgLoading ? height / 140 + "rem" : "auto",
      }}
      transition={{
        height: { delay: 0, duration: 0.4 },
        width: { delay: 0, duration: 0.4 },
      }}
      onClick={() => {
        if (imgLoading) return;
        handlerZoom(index);
      }}
    >
      <Image
        src={src}
        alt={id}
        layout="fill"
        onLoad={imageLoaded}
        className={`relative aspect-auto w-full grow items-center rounded-lg object-left-top duration-500 md:h-80 1050:h-80 ${
          imgLoading
            ? "opacity-0 delay-500"
            : "opacity-100 group-hover:scale-105 group-hover:brightness-75"
        }`}
      />
      <div className={`absolute flex items-center justify-center rounded-lg`}>
        <HiOutlineArrowsExpand
          className={`text-4xl text-white opacity-0 drop-shadow-lg transition-transform duration-300  ${
            imgLoading ? "" : "group-hover:scale-125 group-hover:opacity-100"
          }`}
        />
      </div>
    </motion.div>
  );
};

export default function Portfolio({ albumData }: { albumData: AlbumProps }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedPhoto, setZoomedPhoto] = useState(0);

  const handlerZoom = (index: number) => {
    setIsZoomed(true);
    setZoomedPhoto(index);
  };

  // Deactivate scroll when zoomed
  useEffect(() => {
    function handleScroll(e: WheelEvent | TouchEvent) {
      if (isZoomed) {
        e.preventDefault();
      }
    }

    window.addEventListener("wheel", handleScroll, { passive: false });
    window.addEventListener("touchmove", handleScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
    };
  }, [isZoomed]);

  const handleArrow = (direction: "left" | "right") => {
    setZoomedPhoto(
      (zoomedPhoto +
        (direction === "left"
          ? zoomedPhoto == 0
            ? (albumData.data.length ?? 0) - 1
            : -1
          : 1)) %
        (albumData.data.length ?? 0)
    );
  };

  return (
    <>
      <Layout
        title={albumData?.albumName}
        subtitle={albumData?.description}
        display={{ ref: true, contact: true }}
      >
        <section className="flex flex-wrap justify-center gap-5 px-5 1050:px-1050">
          {albumData?.data.map(({ id, src, width, height }, index) => (
            <ImageWithLoading
              key={id}
              id={id}
              src={src}
              width={width}
              height={height}
              index={index}
              handlerZoom={handlerZoom}
            />
          ))}
        </section>

        {/* Section for displaying fullscreen pictures */}
        <section
          className={`fixed top-0 z-50 flex h-full w-screen items-center justify-center bg-neutral-50/20 backdrop-blur transition-opacity duration-300 dark:bg-neutral-900/30 ${
            isZoomed ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <AnimatePresence>
            {albumData?.data.map(({ id, src, width, height }, index) =>
              index === zoomedPhoto ? (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute flex h-5/6 items-center justify-center px-5 transition-opacity 1050:w-3/5"
                  drag={width < 1050 ? "x" : false}
                  dragMomentum={true}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.1}
                  dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
                  onDragEnd={(e, info) => {
                    if (info.offset.x > 100) {
                      handleArrow("left");
                    } else if (info.offset.x < -100) {
                      handleArrow("right");
                    }
                  }}
                >
                  <Image
                    src={src}
                    alt={id}
                    width={width}
                    height={height}
                    className="aspect-auto h-full w-full select-none rounded-lg object-scale-down drop-shadow-md"
                  />
                </motion.div>
              ) : null
            )}
          </AnimatePresence>
          <button
            className="absolute right-0 top-0 m-5 text-4xl dark:text-neutral-50"
            onClick={() => setIsZoomed(false)}
          >
            <HiXMark />
          </button>
          <div className="absolute hidden w-screen justify-between px-5 text-4xl 1050:flex">
            <button onClick={handleArrow.bind(null, "left")}>
              <HiOutlineChevronLeft />
            </button>
            <button onClick={handleArrow.bind(null, "right")}>
              <HiOutlineChevronRight />
            </button>
          </div>
        </section>

        {/* Back to Albums list */}

        <Link
          href={"/portfolio/photos"}
          className="flex flex-row items-center gap-5 px-5 text-3xl font-black uppercase 1050:px-1050"
        >
          <HiOutlineChevronLeft className="text-4xl" />
          Albums
        </Link>
      </Layout>
    </>
  );
}
