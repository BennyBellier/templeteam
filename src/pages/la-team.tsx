import Head from "next/head";
import Image from "next/image";
import Navigation from "~/components/navigation";
import ContactBar from "~/components/contact_bar";
import References from "~/components/references";
import Footer from "~/components/footer";
import { useWindowSize } from "~/components/elements";
import type { ReferenceProps } from "./api/references";

export async function getServerSideProps() {
  const res = await fetch("http://localhost:3000/api/references");
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const references: ReferenceProps[] = await res.json();
  return {
    props: {
      references,
    },
  };
}

export default function LaTeam({ references }: { references: ReferenceProps[] }) {
  const width = useWindowSize().width;

  return (
    <>
      <Head>
        <title></title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <Navigation />
      <main className="relative top-[60px] flex min-h-screen w-full flex-col items-stretch justify-center text-neutral-950 dark:bg-neutral-850 dark:text-neutral-50 md:top-[70px] 1050:top-[80px]">
        <ContactBar />
        <References references={references} />
      </main>
      <Footer />
    </>
  )
}