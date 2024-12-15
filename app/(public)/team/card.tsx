"use client";

import { VideoWithOverlay } from "@/components/features/videoWithOverlay/VideoWithOverlay";
import { Progress } from "@/components/ui/progress";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

type CardProps = {
  videos: string[];
  skills: {
    id: string;
    label: string;
    percent: number;
    teamMembersId: string | null;
  }[];
  id: string;
  name: string;
  nickname: string | null;
  imagePath: string | null;
  imageAlt: string | null;
};

function AnimatePercent({
  active,
  value,
  delay,
}: {
  active: boolean;
  value: number;
  delay: number;
}) {
  const ref = useRef(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    if (active) {
      void animate(count, value, {
        duration: 1,
        delay: delay / 1000,
      });
    }
  }, [active, count, delay, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

function Skill({
  label,
  percent,
  delay,
}: {
  label: string;
  percent: number;
  delay: number;
}) {
  const isDesktop = useMediaQuery("(min-width: 1050px)");
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: isDesktop ? 0.8 : 0.5,
  });
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    if (isInView) setTimeout(() => setProgressValue(percent), delay);
  }, [isInView, percent, delay]);

  return (
    <li ref={ref}>
      <Typography as="h3" className="font-thin tracking-wide">
        {label ? label : "?"}
      </Typography>
      <div className="flex flex-row items-center">
        <Progress
          className="w-11/12 bg-background duration-1000 ease-out"
          value={progressValue}
          duration={800}
        />
        <Typography
          as="span"
          className="flex w-2/12 flex-row justify-end font-thin tracking-wider"
        >
          <AnimatePercent active={isInView} value={percent} delay={delay} />%
        </Typography>
      </div>
    </li>
  );
}

export default function Card({ member }: { member: CardProps }) {
  const isDesktop = useMediaQuery("min-width: 1050px");
  return (
    <motion.div
      className={cn(
        "flex h-[700px] w-[350px] flex-col overflow-hidden rounded-xl shadow-lg dark:shadow-none lg:h-[400px] lg:w-[800px] lg:flex-row",
      )}
      initial={{ opacity: 0, y: 150 }}
      transition={{ duration: 1.5 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: isDesktop ? 0.8 : 0.5 }}
    >
      <VideoWithOverlay
        className="h-1/2 lg:h-full lg:w-1/2 lg:rounded-l-lg"
        ratio={1}
        videoSrc={member.videos}
        image={{
          src: member.imagePath!,
          alt: member.imageAlt!,
          fill: true,
          sizes: "(min-width: 1050px) 400px, 100vw",
        }}
      />
      <aside className="grid h-full grid-rows-[auto_auto_1fr] gap-2 bg-card p-2 lg:w-1/2">
        <Typography
          as="h1"
          variant="title"
          className="h-fit text-center font-black capitalize tracking-normal md:text-4xl lg:text-4xl"
        >
          {member.name}
        </Typography>
        {member.nickname && (
          <Typography
            as="h2"
            variant="large"
            className="h-fit flex-1 self-start text-center text-2xl font-light"
          >
            aka {member.nickname}
          </Typography>
        )}

        <ul className="row-start-3 flex grow flex-col justify-end gap-2 self-end">
          {member.skills
            ? member.skills.map((skill, index) => (
                <Skill
                  key={skill.id}
                  label={skill.label}
                  percent={skill.percent}
                  delay={index * 300}
                />
              ))
            : null}
        </ul>
      </aside>
    </motion.div>
  );
}
