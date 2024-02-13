import { VideoWithOverlay } from "@/components/features/videoWithOverlay/VideoWithOverlay";
import { ImageWithLoader } from "@/components/features/withLoader/ImageWithLoader";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Suspense } from "react";

export default async function Playground() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-16">
      <ImageWithLoader
        src="/img/team/Benjami.jpg"
        alt=""
        width={300}
        height={300}
      />

      <VideoWithOverlay
        className="w-[300px]"
        ratio={1}
        videoSrc={["/video/team/Benny.mov", "/video/team/Benny.webm"]}
        imageSrc="/img/team/Benjamin.jpg"
        imageAlt="Benny"
      ></VideoWithOverlay>
      {/* <VideoWithOverlay className="w-60" ratio={1/1} videoSrc={["/video/team/Benny.mov", "/video/team/Benny.webm"]} imageSrc="/img/team/Romain.jpg" imageAlt="Benny">
          </VideoWithOverlay>
        <VideoWithOverlay className="w-60" ratio={1/1} videoSrc={["/video/team/Benny.mov", "/video/team/Benny.webm"]} imageSrc="/img/team/Hugo.jpg" imageAlt="Benny">
          </VideoWithOverlay>
        <VideoWithOverlay className="w-60" ratio={1/1} videoSrc={["/video/team/Benny.mov", "/video/team/Benny.webm"]} imageSrc="/img/team/Julien.jpg" imageAlt="Benny">
          </VideoWithOverlay>
        <VideoWithOverlay className="w-60" ratio={1/1} videoSrc={["/video/team/Benny.mov", "/video/team/Benny.webm"]} imageSrc="/img/team/Louis.jpg" imageAlt="Benny">
          </VideoWithOverlay> */}
    </div>
  );
}
