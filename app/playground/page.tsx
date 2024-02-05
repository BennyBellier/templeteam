
import { VideoWithOverlay } from "@/components/features/videoWithOverlay/VideoWithOverlay";
import { prisma } from "@/lib/server";

export default async function Home() {
  return (
      <div className="h-full flex flex-col gap-16 items-center justify-center">
        <VideoWithOverlay className="w-60" ratio={1/1} videoSrc={["/video/team/Benny.mov", "/video/team/Benny.webm"]} imageSrc="/img/team/Benjamin.jpg" imageAlt="Benny">
          </VideoWithOverlay>
        <VideoWithOverlay className="w-60" ratio={1/1} videoSrc={["/video/team/Benny.mov", "/video/team/Benny.webm"]} imageSrc="/img/team/Romain.jpg" imageAlt="Benny">
          </VideoWithOverlay>
        <VideoWithOverlay className="w-60" ratio={1/1} videoSrc={["/video/team/Benny.mov", "/video/team/Benny.webm"]} imageSrc="/img/team/Hugo.jpg" imageAlt="Benny">
          </VideoWithOverlay>
        <VideoWithOverlay className="w-60" ratio={1/1} videoSrc={["/video/team/Benny.mov", "/video/team/Benny.webm"]} imageSrc="/img/team/Julien.jpg" imageAlt="Benny">
          </VideoWithOverlay>
        <VideoWithOverlay className="w-60" ratio={1/1} videoSrc={["/video/team/Benny.mov", "/video/team/Benny.webm"]} imageSrc="/img/team/Louis.jpg" imageAlt="Benny">
          </VideoWithOverlay>
      </div>
  );
}
