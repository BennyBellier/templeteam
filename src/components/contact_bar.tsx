import Link from "next/link";
import type { ReactNode } from "react";
import { HiOutlinePhone, HiOutlineAtSymbol } from "react-icons/hi2";

const ContactLink = ({ children }: { children: ReactNode }) => {
  return (
    <li>
      <Link
        href="/contact"
        className="ease flex rounded-full border border-neutral-800 fill-transparent p-2 text-3xl duration-200 hover:border-transparent hover:drop-shadow-contact md:p-3 md:text-4xl 1050:p-4 1050:text-5xl dark:border-neutral-50"
      >
        {children}
      </Link>
    </li>
  );
};

export default function ContactBar() {
  return (
    <section
      id="contact_bar"
      className="grid auto-cols-auto auto-rows-auto gap-2 px-5 md:gap-5 dark:text-neutral-50 py-16"
    >
      <h1 className="col-span-2 self-center text-center text-4xl md:text-5xl 1050:col-span-1 1050:text-6xl">
        CONTACT
      </h1>
      <span className="col-span-2 text-center md:text-lg 1050:col-span-1 1050:text-xl">
        {`UNE DEMANDE D'INFOS,`}
        <br />
        DES RENSEIGNEMENTS ?
      </span>
      <ul className="col-span-2 flex justify-around pt-8 md:pt-12 1050:pt-16">
        <ContactLink>
          <HiOutlinePhone />
        </ContactLink>
        <ContactLink>
          <HiOutlineAtSymbol />
        </ContactLink>
        <ContactLink>
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            ></path>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
        </ContactLink>
      </ul>
    </section>
  );
}
