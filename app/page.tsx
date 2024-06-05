/* eslint-disable react/no-unescaped-entities */
import TeamPicture from "@/../public/img/team/Team.jpg";
import { ButtonWithArrow } from "@/components/features/animated/ButtonWithArrow";
import { VideoWithLoader } from "@/components/features/withLoader/VideoWithLoader";
import { ContactBar as Contact } from "@/components/layout/Contact";
import { LayoutSection } from "@/components/layout/layout";
import { References } from "@/components/references/References";
import { Typography } from "@/components/ui/typography";
import { env } from "@/env.mjs";
// import { prisma } from "@/server/";
import { cn } from "@/lib/utils";
import { getServerAuthSession } from "@/server/auth";
import { AlertTriangle } from "lucide-react";
import Image from "next/image";

export const revalidate = env.REVALIDATE_TIME ?? 3600;

export default async function Home() {
  // const hello = await prisma.post.hello.query({ text: "Worldy !" });
  const session = await getServerAuthSession();

  return (
    <>
      {/* Hero Banner */}
      <LayoutSection>
        <Typography
          variant="h1"
          className="xs:text-xl bg-aside-heroBanner text-const-white w-full pb-2 pt-1 text-center tracking-widest lg:hidden"
        >
          Temple Team
        </Typography>
        <aside className="text-const-white before:from-aside-heroBanner before:to-aside-heroBanner/0 absolute z-10 hidden w-fit -translate-x-64 translate-y-10 items-end self-start before:h-[182px] before:w-64 before:-translate-y-[1px] before:translate-x-[2px] before:bg-gradient-to-l before:content-[''] lg:flex">
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
          <h2 className="font-display absolute -translate-y-28 translate-x-64 pl-1 text-5xl font-bold">
            TEMPLE TEAM
          </h2>
          <em className="font-display absolute w-64 -translate-y-5 translate-x-64 pl-1 text-xl/10 font-semibold not-italic tracking-[.25rem]">
            {"La Temple Team s'occupe de tout"}
          </em>
        </aside>
        <div className="relative h-fit w-full">
          <Typography
            variant="h2"
            className={cn(
              "xs:text-lg text-const-white absolute z-10 w-full bg-gradient-to-b from-neutral-900/40 to-transparent pb-2 pt-1 text-center lg:hidden",
            )}
          >
            La Temple Team s'occupe de tout
          </Typography>
          <VideoWithLoader
            preload="metadata"
            loop
            autoPlay
            muted
            className="h-fit w-full"
          >
            <source src="/video/hero-banner.mp4" type="video/mp4" />
            <source src="/video/hero-banner.mov" type="video/mov" />
            <source src="/video/hero-banner.webm" type="video/webm" />
            <Typography variant="alert" className="flex flex-row gap-2">
              <AlertTriangle /> Votre navigateur ne supporte pas la lecture de
              vidéos !
            </Typography>
          </VideoWithLoader>
        </div>
      </LayoutSection>
      <Contact />
      {/* Description */}
      <LayoutSection className="relative grid gap-5 bg-secondary lg:grid-cols-[50%_50%]">
        <Typography
          variant="h1"
          className="row-span-1 w-full text-center tracking-widest"
        >
          TEMPLE TEAM
        </Typography>
        <Typography className="col-span-1 text-justify leading-7 tracking-wider">
          La Temple Team est un collectif de 7 athlètes provenant de mondes
          aussi différents que liés. Venant du parkour, du freerunning, de la
          gymnastique et même du tricking, chacun a sa spécialité (parfois
          bonne, parfois mauvaise), mais toutes font le charme de l'équipe !
          <br />
          Alors que l'équipe perfectionne ses compétences en parkour et en
          images depuis plusieurs années, elle vous propose également d'animer
          vos événements. C'est une combinaison puissante, d'autant que l'équipe
          veut promouvoir son sport et vous émerveiller, vous et vos enfants.
        </Typography>
        <ButtonWithArrow className="py-5 text-lg font-bold" arrowSize={28}>
          Plus d'infos
        </ButtonWithArrow>
        <Image
          src={TeamPicture}
          alt="Photo des membres de la Temple Team"
          title="Photo des membres de la Temple Team"
          placeholder="blur"
          className="object-contain lg:col-start-2 lg:row-span-3 lg:row-start-1"
        />
      </LayoutSection>
      <References />
    </>
  );
}
