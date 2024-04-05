import { cn } from "@/lib/utils";
import { useEffect, type RefObject } from "react";

type VideoPlayerProps = {
  videoRef: RefObject<HTMLVideoElement>;
  videoSrc: string[];
  _isDesktop: boolean;
  videoReady: boolean;
  isVideoActive: boolean;
}

const VideoPlayer = ({
  videoRef,
  videoSrc,
  _isDesktop,
  videoReady,
  isVideoActive,
}: VideoPlayerProps) => {
  const startVideo = () => {
    if (videoReady) {
      setTimeout(() => void videoRef.current?.play(), 200);
    }
  };

  const stopVideo = () => {
    videoRef.current?.pause();
  };

  useEffect(() => {
    if (videoRef.current?.readyState! > 3) {
      startVideo();
    }
  }, [videoRef.current?.readyState]);

  return (
    <video
      ref={videoRef}
      className={cn(
        "ease absolute left-0 top-0 z-10 h-full w-full object-cover opacity-0 duration-300",
        videoReady ? "lg:group-hover:opacity-100" : "",
        videoReady && isVideoActive ? "opacity-100 delay-200" : "",
      )}
      onCanPlay={() => startVideo()}
      onError={() => {}}
      loop
      muted
    >
      {videoSrc.map((video) => {
        let type = "video/";

        if (video.endsWith(".mov")) type += "mov";
        if (video.endsWith(".mp4")) type += "mp4";
        if (video.endsWith(".webm")) type += "webm";

        return <source key={video} src={video} type={type} />;
      })}
      Votre navigateur ne supporte pas les vidéos.
    </video>
  );
};
