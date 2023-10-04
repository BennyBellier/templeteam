import Head from "next/head";
import Layout from "~/components/layout";
import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useWindowSize } from "~/components/elements";

interface skill {
  name: string;
  level: number;
}

const AthleteCard = ({
  name,
  nickname,
  file,
  skills,
}: {
  name: string;
  nickname?: string;
  file: string;
  skills: [skill, skill, skill];
}) => {
  const Video = () => {
    const [imgLoading, setImgLoading] = useState(true);
    const [videoLoading, setVideoLoading] = useState(true);
    const [pulsing, setPulsing] = useState(true);
    const videoRef = useRef(null);
    const isInView = useInView(videoRef, { margin: "-45% 10% -45%" });
    const width = useWindowSize().width;

    const imageLoaded = () => {
      setImgLoading(false);
      setTimeout(() => setPulsing(false), 400);
    };

    const playVideo = () => {
      if (videoRef.current && !videoLoading && !imgLoading)
        void (videoRef.current as HTMLVideoElement).play();
    };

    const pauseVideo = () => {
      if (videoRef.current && !videoLoading && !imgLoading)
        void (videoRef.current as HTMLVideoElement).pause();
    };

    const resetVideo = () => {
      if (videoRef.current && !videoLoading && !imgLoading) {
        void (videoRef.current as HTMLVideoElement).fastSeek(0);
      }
    };

    return (
      <motion.div
        className={`group relative flex h-[350px] w-[350px] items-center justify-center overflow-hidden rounded-t-2xl bg-neutral-200 md:h-[375px] md:w-[375px] 1050:h-[400px] 1050:w-[400px] 1050:rounded-l-2xl 1050:rounded-br-none 1050:rounded-tr-none ${
          pulsing ? "animate-pulse" : ""
        }`}
        onMouseOver={playVideo}
        onMouseOut={pauseVideo}
      >
        <Image
          src={"/img/team/" + file + ".jpg"}
          alt={name}
          {...(width >= 1050
            ? { width: 400, height: 400 }
            : width >= 768
            ? { width: 375, height: 375 }
            : { width: 350, height: 350 })}
          onLoad={imageLoaded}
          className={`absolute h-[350px] w-[350px] rounded-t-2xl duration-500 md:h-[375px] md:w-[375px] 1050:h-[400px] 1050:w-[400px] 1050:rounded-l-2xl 1050:rounded-br-none 1050:rounded-tr-none ${
            imgLoading ? "opacity-0" : "opacity-100"
          }`}
        />
        <video
          className={`h-[350px] w-[350px] rounded-t-2xl brightness-150 duration-500 md:h-[375px] md:w-[375px] 1050:h-[400px] 1050:w-[400px] 1050:rounded-l-2xl 1050:rounded-tr-none opacity-0 ${ imgLoading || videoLoading ? "" : "group-hover:opacity-100"}`}
          preload="none"
          onLoadStart={() => {console.log("start loading video")}}
          onLoadedData={() => setVideoLoading(false)}
          onEnded={resetVideo}
          ref={videoRef}
        >
          {/* <source src={"/video/team/" + file + ".webm"} type="video/webm" />
          <source src={"/video/team/" + file + ".mp4"} type="video/mp4" />
          <source src={"/video/team/" + file + ".mov"} type="video/mov" /> */}
          <source src="/video/team/Export_v2.3.mp4" type="video/mp4" />
        </video>

        <span
          className={`absolute right-2 top-2 flex h-3 w-3 ${
            videoLoading ? "opacity-0" : "opacity-100"
          }`}
        >
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
        </span>
      </motion.div>
    );
  };

  const Skills = () => {
    return (
      <div className="mt-5 flex h-fit flex-col gap-2 1050:mt-0">
        {skills.map((skill, index) => {
          return (
            <div key={index}>
              <span>{skill.name}</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-full rounded-full bg-white dark:bg-neutral-850">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-550 to-red-300"
                    style={{ width: skill.level + "%" }}
                  ></div>
                </div>
                <span className="whitespace-nowrap text-xs font-extralight">
                  {skill.level} %
                </span>
              </div>
            </div>
          );
        }, [])}
      </div>
    );
  };

  return (
    <div className="grid h-fit w-fit grid-cols-1 grid-rows-2 self-center justify-self-center rounded-b-2xl shadow-xl dark:shadow-none 1050:grid-cols-2 1050:grid-rows-1 1050:rounded-r-2xl">
      <Video />
      <div className="auto-row-min grid w-[350px] gap-3 rounded-b-2xl bg-neutral-50 p-3 dark:bg-neutral-800 md:w-[375px] 1050:h-[400px] 1050:w-[400px] 1050:grid-rows-[36px_1fr_136px] 1050:rounded-r-2xl 1050:rounded-bl-none 1050:pb-4 1050:pt-5">
        <h1 className="h-fit text-center text-3xl capitalize">{name}</h1>
        {nickname ? (
          <h2 className="h-fit text-center text-xl">{nickname}</h2>
        ) : null}
        <Skills />
      </div>
    </div>
  );
};

export default function LaTeam() {
  return (
    <>
      <Layout
        title="La team"
        subtitle="Un groupe d'amis, une équipe, des années d'entrainements ! Il est maintenant l'heure de vous les présenter."
        display={{ ref: true, contact: true }}
      >
        <section
          id="athlete-cards"
          className="grid grid-cols-[repeat(auto-fill,_minmax(380px,_1fr))] gap-5 px-5 1050:grid-cols-1 1050:gap-10 1050:px-1050"
        >
          <AthleteCard
            name="julien daubord"
            nickname="aka Coach"
            file="Julien"
            skills={[
              { name: "État", level: 40 },
              { name: "Acrobaties", level: 75 },
              { name: "Ponctualité", level: 5 },
            ]}
          />
          <AthleteCard
            name="romain castillo"
            nickname="aka Mowgli"
            file="Romain"
            skills={[
              { name: "Acrobaties", level: 90 },
              { name: "QI", level: 30 },
              { name: "Muscles", level: 99 },
            ]}
          />
          <AthleteCard
            name="hugo rival"
            nickname="aka Bboyrival"
            file="Hugo"
            skills={[
              { name: "Breakdance", level: 65 },
              { name: "Parkour", level: 77 },
              { name: "Calvitie", level: 12 },
            ]}
          />
          <AthleteCard
            name="benjamin bellier"
            nickname="aka Benny"
            file="Benjamin"
            skills={[
              { name: "Cheville", level: 30 },
              { name: "Vidéaste", level: 75 },
              { name: "Acrobaties", level: 50 },
            ]}
          />
        </section>
      </Layout>
    </>
  );
}
