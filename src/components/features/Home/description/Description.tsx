import TeamPicture from "@/../public/img/team/Team.jpg";
import { LayoutSection } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import Image from "next/image";

export const Description = () => {
  return (
    <LayoutSection className="relative grid gap-5 bg-secondary lg:grid-cols-[50%_50%]">
      <Typography
        variant="h1"
        className="row-span-1 w-full text-center tracking-widest"
      >
        TEMPLE TEAM
      </Typography>
      <Typography className="col-span-1 text-justify leading-7 tracking-wider">
        La Temple Team est un collectif de 7 athlètes provenant de mondes aussi
        différents que liés. Venant du parkour, du freerunning, de la
        gymnastique et même du tricking, chacun a sa spécialité (parfois bonne,
        parfois mauvaise), mais toutes font le charme de l'équipe !
        <br />
        Alors que l'équipe perfectionne ses compétences en parkour et en images
        depuis plusieurs années, elle vous propose également d'animer vos
        événements. C'est une combinaison puissante, d'autant que l'équipe veut
        promouvoir son sport et vous émerveiller, vous et vos enfants.
      </Typography>
      <div className="w-fit">
        <Typography as={Button} className="py-3">
          Plus d'infos
        </Typography>
      </div>
      <Image
        src={TeamPicture}
        alt="Photo des membres de la Temple Team"
        title="Photo des membres de la Temple Team"
        placeholder="blur"
        className="object-contain lg:col-start-2 lg:row-span-3 lg:row-start-1"
      />
    </LayoutSection>
  );
};
