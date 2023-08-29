import React, { useCallback, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType, EmblaCarouselType } from "embla-carousel-react";
import {
  PrevButton,
  NextButton,
} from "./EmblaCarouselArrowButtons";
import type { ReferenceProps } from "~/pages/api/references";
import References from "./references";

interface PropType {
  slides: ReferenceProps[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const slideSpacing = 4;

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );

  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="embla flex w-full items-center justify-center overflow-hidden">
      <div className="absolute z-0 flex w-[400px] items-center justify-between dark:text-neutral-50 md:w-[750px] md:px-1 1050:w-[1100px] 1050:px-5">
        <PrevButton onClick={scrollPrev} disabled={prevBtnDisabled} />
        <NextButton onClick={scrollNext} disabled={nextBtnDisabled} />
      </div>
      <div
        className="h-[150px] w-[312px] overflow-hidden md:w-[624px] 1050:w-[936px]"
        ref={emblaRef}
      >
        <div
          className={`flex touch-pan-y ${"ml-" + slideSpacing * -1} z-10 my-6 ${
            slides.length < 2 ? "justify-center" : ""
          } ${slides.length < 3 ? "1050:justify-center" : ""}`}
          style={{ backfaceVisibility: "hidden" }}
        >
          {slides.map((reference, idx) => (
            <div className="relative w-fit px-4" key={idx}>
              <Link
                href={reference.href}
                className="group/item ease ease flex h-[100px] w-[280px] cursor-pointer gap-5 rounded-2xl bg-neutral-50 px-4 py-2 shadow-lg transition-transform duration-300 hover:scale-90 dark:bg-neutral-800 dark:shadow-none"
              >
                <Image
                  src={"/img/references/" + reference.logo}
                  alt={reference.alt}
                  width={100}
                  height={50}
                  className="h-14 w-14 self-center object-contain"
                />
                <span className="text-md ease self-center font-semibold duration-300 group-hover/item:text-red-550">
                  {reference.name}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmblaCarousel;
