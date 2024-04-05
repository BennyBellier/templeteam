import { VideoWithOverlay } from "@/components/features/videoWithOverlay/VideoWithOverlay";
import { ImageWithLoader } from "@/components/features/withLoader/ImageWithLoader";

export default async function Playground() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-16">
      <ImageWithLoader
        src="/img/team/Benjamin.jpg"
        alt="Benny"
        className="h-[400px] w-[400px]"
        fill
        sizes="(min-width: 1050px) 400px, 100vw"
      />

      <VideoWithOverlay
        className="w-48"
        ratio={1}
        videoSrc={["/video/team/Benny.mov", "/video/team/Benny.webm"]}
        image={{
          src: "/img/team/Benjamin.jpg",
          alt: "Benny",
          fill: true,
          sizes: "(min-width: 1050px) 400px, 100vw",
        }}
      />
    </div>
  );
}
