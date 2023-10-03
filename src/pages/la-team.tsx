import Head from "next/head";
import Layout from "~/components/layout";

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
    return (
      <video
        className="rounded-t-2xl 1050:rounded-l-2xl 1050:rounded-tr-none h-[350px] w-[350px] md:h-[375px] md:w-[375px] 1050:h-[400px] 1050:w-[400px] brightness-150"
        poster={"/img/team/" + file + ".jpg"}
      >
        <source src={"/video/team/" + file + ".webm"} type="video/webm" />
        <source src={"/video/team/" + file + ".mp4"} type="video/mp4" />
        <source src={"/video/team/" + file + ".mov"} type="video/mov" />
      </video>
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
    <div className="grid grid-cols-1 grid-rows-2 1050:grid-cols-2 1050:grid-rows-1 h-fit w-fit justify-self-center self-center shadow-xl dark:shadow-none rounded-b-2xl 1050:rounded-r-2xl">
      <Video />
      <div className="grid auto-row-min 1050:grid-rows-[36px_1fr_136px] gap-3 w-[350px] bg-neutral-50 p-3 dark:bg-neutral-800 md:w-[375px] 1050:h-[400px] 1050:w-[400px] rounded-b-2xl 1050:rounded-bl-none 1050:rounded-r-2xl 1050:pb-4 1050:pt-5">
        <h1 className="capitalize text-center text-3xl h-fit">{name}</h1>
        {nickname ? <h2 className="text-center text-xl h-fit">{nickname}</h2> : null}
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
          className="grid grid-cols-[repeat(auto-fill,_minmax(380px,_1fr))] 1050:grid-cols-1 gap-5 1050:px-1050 1050:gap-10 px-5"
        >
          <AthleteCard name="julien daubord" nickname="aka Coach" file="Julien" skills={[{ name: "État", level: 40 }, { name: "Acrobaties", level: 75 }, { name: "Ponctualité", level: 5 }]} />
          <AthleteCard name="romain castillo" nickname="aka Mowgli" file="Romain" skills={[{ name: "Acrobaties", level: 90}, {name: "QI", level: 30}, {name: "Muscles", level: 99}]} />
          <AthleteCard name="hugo rival" nickname="aka Bboyrival"  file="Hugo" skills={[{ name: "Breakdance", level: 65}, {name: "Parkour", level: 77}, {name: "Calvitie", level: 12}]} />
          <AthleteCard name="benjamin bellier" nickname="aka Benny" file="Benjamin" skills={[{ name: "Cheville", level: 30}, {name: "Vidéaste", level: 75}, {name: "Acrobaties", level: 50}]} />
        </section>
      </Layout>
    </>
  );
}
