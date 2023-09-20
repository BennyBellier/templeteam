import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import Layout from "~/components/layout";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiXMark,
} from "react-icons/hi2";
import { AnimatePresence, motion } from "framer-motion";
import { useWindowSize } from "~/components/elements";

export default function Portfolio() {
  const [isZoomed, setIsZoomed] = useState(false);
  const photosQuery = api.content.photos.useQuery();
  const [zoomedPhoto, setZoomedPhoto] = useState(0);
  const width = useWindowSize().width;

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
            ? (photosQuery.data?.length ?? 0) - 1
            : -1
          : 1)) %
        (photosQuery.data?.length ?? 0)
    );
  };

  return (
    <>
      <Head>
        <title>Photos | Temple Team</title>
      </Head>
      <Layout
        title="Photos"
        subtitle="Envie de voir nos photos ? C'est par ici !"
        display={{ ref: true, contact: true }}
      >
        <section className="flex flex-wrap justify-center gap-5 px-5 1050:justify-start 1050:px-1050">
          {photosQuery.data?.map((photo, index) => (
            <figure
              key={photo.img}
              className="group grid aspect-auto h-fit w-fit cursor-pointer grid-cols-1 grid-rows-1 self-center justify-self-center overflow-hidden rounded-lg object-cover"
              onClick={() => {
                handlerZoom(index);
              }}
            >
              <Image
                src={"/img/portfolio/photos/" + photo.img}
                alt={photo.title}
                width={photo.width}
                height={photo.height}
                className="col-end-2 row-end-2 aspect-auto w-full grow rounded-lg object-center transition-transform duration-500 group-hover:scale-105 group-hover:brightness-75 md:h-80 1050:h-80"
              />
              <div className="col-end-2 row-end-2 flex items-center justify-center rounded-lg">
                <HiOutlineArrowsExpand className="transition-trasnform text-4xl text-white opacity-0 drop-shadow-lg duration-300 group-hover:scale-125 group-hover:opacity-100" />
              </div>
            </figure>
          ))}
        </section>

        {/* Section for displaying fullscreen pictures */}
        <section
          className={`fixed top-0 z-50 flex h-full w-screen items-center justify-center bg-neutral-50/20 backdrop-blur transition-opacity duration-300 dark:bg-neutral-900/30 ${
            isZoomed ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <AnimatePresence>
            {photosQuery.data?.map((photo, index) =>
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
                    src={"/img/portfolio/photos/" + photo.img}
                    alt={photo.title ?? "sans titre"}
                    width={photo.width}
                    height={photo.height}
                    className="aspect-auto h-full w-full rounded-lg object-scale-down drop-shadow-md select-none"
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
      </Layout>
    </>
  );
}
