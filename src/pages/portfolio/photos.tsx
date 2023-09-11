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
import { useSpring, animated } from "@react-spring/web";

export default function Portfolio() {
  const photosQuery = api.content.photos.useQuery();
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

  const [spring, sapi] = useSpring(
    () => ({
      config: { duration: 100 },
    }),
    []
  );

  const loadImage = () => {
    sapi.start({
      from: { opacity: 0 },
      to: { opacity: 1 },
    });
  };

  const unloadImage = () => {
    sapi.start({
      from: { opacity: 1 },
      to: { opacity: 0 },
    });
  };

  const handleArrow = (direction: "left" | "right") => {
    unloadImage();
    // wait for the animation to end
    setTimeout(() => {
      setZoomedPhoto(
        (zoomedPhoto + (direction === "left" ? -1 : 1)) %
          (photosQuery.data?.length ?? 0)
      );
    }, 100);
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
                loadImage();
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

        <section
          className={`fixed top-0 z-50 flex h-screen w-screen items-center justify-center bg-neutral-50/20 backdrop-blur duration-300 dark:bg-neutral-900/30 transition-opacity ${
            isZoomed ? "opacity-100" : "pointer-events-none opacity-0"
          } `}
        >
          <figure className="flex h-5/6 1050:w-3/5 items-center justify-center px-5">
            {photosQuery.data?.[zoomedPhoto] ? (
              <animated.div style={spring} className="h-full w-full">
                <Image
                  src={
                    "/img/portfolio/photos/" +
                    photosQuery.data?.[zoomedPhoto]?.img
                  }
                  alt={photosQuery.data?.[zoomedPhoto]?.title ?? "sans titre"}
                  width={photosQuery.data?.[zoomedPhoto]?.width}
                  height={photosQuery.data?.[zoomedPhoto]?.height}
                  className="aspect-auto h-full w-full rounded-lg object-scale-down"
                  onLoadingComplete={loadImage}
                  onChange={unloadImage}
                />
              </animated.div>
            ) : null}
          </figure>
          <button
            className="absolute right-0 top-0 m-5 text-4xl dark:text-neutral-50"
            onClick={() => setIsZoomed(false)}
          >
            <HiXMark />
          </button>
          <div className="absolute 1050:flex w-screen justify-between px-5 text-4xl hidden">
            <button
              onClick={handleArrow.bind(null, "left")}
            >
              <HiOutlineChevronLeft />
            </button>
            <button
              onClick={handleArrow.bind(null, "right")}
            >
              <HiOutlineChevronRight />
            </button>
          </div>
        </section>
      </Layout>
    </>
  );
}
