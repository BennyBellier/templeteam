import Image from "next/image";
import Link from "next/link";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";

const references = [
  {
    name: "Pays Voironnais Basket Club",
    href: "https://www.pvbc.fr/",
    logo: "/img/references/pvbc.png",
    alt: "pvbc",
  },
  {
    name: "Ville de Voiron",
    href: "https://www.voiron.fr/",
    logo: "/img/references/ville-de-voiron-social-logo.png",
    alt: "voiron",
  },
];

export default function References() {
  return (
    <section id="references-slider" className="flex flex-col gap-8 py-16">
      <h1 className="text-center text-4xl md:text-5xl 1050:text-6xl">
        ILS NOUS FONT CONFIANCE !
      </h1>
      <div id="slider" className="flex justify-center items-center">
        <div className="absolute flex w-full justify-between 1050:w-[1050px]">
          <button className="hover:scale-110 ease duration-200">
            <HiOutlineChevronLeft className="1050:h-12 1050:w-12" />
          </button>
          <button className="hover:scale-110 ease duration-200">
            <HiOutlineChevronRight className="1050:h-12 1050:w-12" />
          </button>
        </div>
        <div
          id="slider_frame"
          className="flex h-[150px] w-[900px] items-center self-center overflow-hidden px-2.5 py-4 justify-center"
        >
          <ul id="slider_track" className="relative flex gap-5">
            {references.map((reference) => (
              <li key={reference.name}>
                <Link
                  href={reference.href}
                  className="group/item ease flex h-[100px] w-[280px] cursor-pointer gap-5 rounded-2xl px-4 py-2 shadow-lg duration-300 hover:scale-90 dark:shadow-none"
                >
                  <Image
                    src={reference.logo}
                    alt={reference.alt}
                    width={100}
                    height={50}
                    className="h-14 w-14 self-center object-contain"
                  />
                  <span className="text-md ease self-center font-semibold duration-300 group-hover/item:text-red-550">
                    {reference.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}