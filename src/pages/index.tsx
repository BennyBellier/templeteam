import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { api } from "~/utils/api";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import ContactBar from "../components/contact_bar";
import References from "../components/references";
import { useWindowSize } from "~/components/elements"
import { useSpring, animated } from "@react-spring/web";
import { HiOutlineArrowLeft } from "react-icons/hi2";


export default function Home() {
  const width = useWindowSize().width;

  const HeroBanner = () => {
    return (
      <section id="hero-banner" className="justify-center px-5 pb-16 pt-2 1050:px-1050">
        {width < 1050 ? (
          <>
            <h1 className="bg-red-550 text-center text-3xl font-bold text-neutral-50 md:text-5xl 1050:text-6xl">
              TEMPLE TEAM
            </h1>
            <h2
              id="hero-banner--subtitle"
              className="text-md text-medium absolute h-12 bg-gradient-to-b from-neutral-900/40 to-transparent text-center text-neutral-50 md:text-2xl"
            >
              {"La Temple Team s'occupe de tout"}
            </h2>
          </>
        ) : (
          <aside className="absolute flex w-fit -translate-x-[255px] translate-y-10 items-end text-neutral-50 before:h-[182px] before:w-64 before:-translate-y-[1px] before:translate-x-[2px] before:bg-gradient-to-l before:from-red-550 before:to-red-550/0 before:content-['']">
            <svg
              viewBox="0 0 409 191"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-[200px]"
            >
              <path
                d="M232.169 191L0.7812 190L1.21875 16C207.219 16 318.219 7 408.719 0L362.87 95.5L277.332 99L232.169 191Z"
                fill="#F24150"
              />
            </svg>
            <h2 className="absolute -translate-y-28 translate-x-64 pl-1 font-display text-5xl font-bold">
              TEMPLE TEAM
            </h2>
            <em className="absolute w-64 -translate-y-5 translate-x-64 pl-1 font-display text-xl/10 font-semibold not-italic tracking-[.25rem]">
              {"La Temple Team s'occupe de tout"}
            </em>
          </aside>
        )}
        <video autoPlay loop muted preload="none" className="1050:h-[591px]">
          <source
            src="https://templeteam.fr/static/video/hero-banner.webm"
            type="video/webm"
          />
          <source
            src="https://templeteam.fr/static/video/hero-banner.mp4"
            type="video/mp4"
          />
          <source
            src="https://templeteam.fr/static/video/hero-banner.mov"
            type="video/mov"
          />
          <p>
            Votre navigateur ne supporte pas les lecteurs vidéos. Veuillez
            mettre à jour votre navigateur.
          </p>
        </video>
      </section>
    );
  };

  const About = () => {
    const [springs, api] = useSpring(() => ({
      x: 0,
      config: {
        mass: 2,
        tension: 200,
        friction: 13,
        precision: 0.001,
        velocity: 0.01,
      }
    }), []);

    const handleHoverIn = () => {
      api.start({ x: -15 });
    };

    const handleHoverOut = () => {
      api.start({ x: 0 });
    };

    return (
      <section
        id="about"
        className="grid auto-rows-auto grid-cols-1 bg-neutral-50 dark:bg-neutral-800 gap-5 py-16 px-5 1050:grid-cols-2 1050:px-1050"
      >
        <h1 className="text-center text-4xl 1050:row-end-1 1050:col-end-2 1050:text-6xl">TEMPLE TEAM</h1>
        <p className="1050:col-end-2 1050:row-start-1 1050:row-end-2 leading-6 1050:leading-8 tracking-wider">
          {`La Temple Team c'est avant tout un groupe de potes ! Provenant de mondes
          aussi différents que liés. Venant du parkour, du freerunning, de la
          gymnastique, du tricking et même du breakdance, chacun a sa spécialité (parfois
          bonne, parfois mauvaise), mais toutes font le charme de l'équipe !
          Alors que l'équipe perfectionne ses compétences en parkour et en
          images depuis plusieurs années, elle vous propose également d'animer
          vos événements. C'est une combinaison puissante, d'autant que l'équipe
          veut promouvoir son sport et vous émerveiller, vous et vos enfants.`}
        </p>
        <div onMouseEnter={handleHoverIn} onMouseLeave={handleHoverOut} className="group flex items-center gap-5 1050:col-end-2 1050:row-end-3 w-fit">
          <Link
            href="/la-team"
            className="w-fit rounded-md bg-red-550 px-3 py-2 text-neutral-50 font-semibold text-lg group-hover:bg-[#f45] group-hover:scale-95 ease duration-300 1050:col-end-2 1050:row-start-2 1050:row-end-3"
          >
            {`Plus d'infos`}
          </Link>
          <animated.div style={springs}>
            <HiOutlineArrowLeft className="inline-block text-3xl" />
          </animated.div>
        </div>
        <Image
          src="/img/team/Team.jpg"
          alt="Photo des membres de la Temple Team"
          title="Photo des membres de la Temple Team"
          width={500}
          height={500}
          className="1050:col-start-2 1050:row-start-1 1050:row-end-2 slef-center justify-self-center h-full object-contain"
        />
      </section>
    );
  }

  return (
    <>
      <Head>
        <title>Temple Team | Parkour Freerun Gymnastique</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />
      <main className="relative top-[60px] flex min-h-screen w-full flex-col items-stretch justify-center text-neutral-950 dark:bg-neutral-850 dark:text-neutral-50 md:top-[70px] 1050:top-[80px]">
        <HeroBanner />
        <ContactBar />
        <About />
        <References />
      </main>
      <Footer />
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-black">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
