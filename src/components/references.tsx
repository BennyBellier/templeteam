import type { EmblaOptionsType } from "embla-carousel-react";
import type { ReferenceProps } from "../pages/api/references";
import EmblaCarousel from "./EmblaCarousel";

const OPTIONS: EmblaOptionsType = {
  loop: true,
  align: "center",
  active: true,
  breakpoints: {
    "(min-width: 768px) and (max-width: 1049px)": { align: "start" },
  },
};

export default function References({
  references,
}: {
  references: ReferenceProps[];
}) {
  if (references.length === 0) {
    return (
      <section
        id="references-slider"
        className="flex flex-col gap-8 px-6 py-16 dark:bg-neutral-850 dark:text-neutral-50"
      >
        <h1 className="text-center text-4xl md:text-5xl 1050:text-6xl">
          ILS NOUS FONT CONFIANCE !
        </h1>
        <div id="slider" className="flex w-full items-center justify-center">
          <div
            id="slider_frame"
            className="flex h-[150px] w-[300px] items-center self-center overflow-hidden py-4 md:w-[605px] 1050:w-[900px] 1050:justify-center"
          >
            <h2 className="m-[auto] w-3/4 justify-self-stretch text-center text-xl font-medium">
              {"Quelque chose n'a pas fonctionné !"}
            </h2>
          </div>
        </div>
      </section>
    );
  }

  // infinite slider
  return (
    <section
      id="references-slider"
      className="flex flex-col gap-8 px-6 py-16 dark:bg-neutral-850 dark:text-neutral-50"
    >
      <h1 className="text-center text-4xl md:text-5xl 1050:text-6xl">
        ILS NOUS FONT CONFIANCE !
      </h1>
      <EmblaCarousel slides={references} options={OPTIONS} />
    </section>
  );
}
