"use client";

import { Loader } from "@/components/ui/loader";
import { Ping } from "@/components/ui/ping";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { ImageWithLoader } from "../withLoader/ImageWithLoader";

export type VideoWithOverlayProps = {
  videoSrc: string[];
  imageSrc: string;
  imageAlt: string;
  ratio: number;
  className: string;
};

export const VideoWithOverlay = (props: VideoWithOverlayProps) => {
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isImageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1050px)");

  const regexMov = new RegExp("\\.mov$", "gim");
  const regexMp4 = new RegExp("\\.mp4$", "gim");
  const regexWebm = new RegExp("\\webm$", "gim");

  const startVideo = () => {
    if (videoReady) {
      setTimeout(() => videoRef.current?.play(), 200);
      setVideoStarted(true);
    }
  };

  const stopVideo = () => {
    videoRef.current?.pause();
  };

  const handleClick = () => {
    if (!isDesktop) {
      setIsVideoActive(!isVideoActive);
      if (isVideoActive) {
        // if video running stop it
        stopVideo();
      } else {
        // else start it
        startVideo();
      }
    }
  };

  useEffect(() => {
    if (videoRef.current?.readyState! > 3) {
      setVideoReady(true);
    }
  }, [videoRef.current?.readyState!]);

  return (
    <div
      className={`group ${props.className}`}
      onClick={() => (!isDesktop ? handleClick() : null)}
    >
      <AspectRatio
        className="relative w-full"
        ratio={props.ratio ? props.ratio : 16 / 9}
        onMouseEnter={() => (isDesktop ? startVideo() : null)}
        onMouseLeave={() => (isDesktop ? stopVideo() : null)}
      >
        <video
          ref={videoRef}
          className={cn(
            "ease absolute left-0 top-0 z-10 h-full w-full object-cover opacity-0 duration-300",
            // in case of desktop
            videoReady ? "lg:group-hover:opacity-100" : "",
            // in case of smartphone or tablet
            videoReady && isVideoActive ? "opacity-100 delay-200" : "",
          )}
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoError(true)}
          loop
          muted
        >
          {props.videoSrc.map((video) => {
            let type = "video/";

            if (regexMov.exec(video) !== null) type += "mov";
            if (regexMp4.exec(video) !== null) type += "mp4";
            if (regexWebm.exec(video) !== null) type += "webm";

            return <source key={video} src={video} type={type} />;
          })}
          Votre navigateur ne supporte pas les vidéos.
        </video>
        <ImageWithLoader
          src={props.imageSrc}
          alt={props.imageAlt}
          width={300}
          height={300}
          onLoaded={() => setIsImageLoading(false)}
          onError={() => setImageError(true)}
          className={cn("object-cover", isImageError ? "opacity-0" : "")}
        />
        <>
          <Loader
            className={cn(
              "absolute right-3 top-3 flex h-5 w-5 transition-opacity duration-700",
              !isImageLoading && !videoReady && !videoError
                ? "opacity-100"
                : "opacity-0",
            )}
          />
          <Ping
            className={cn(
              "absolute right-3 top-3 flex h-3 w-3 transition-opacity duration-700",
              videoReady && !videoStarted
                ? "opacity-100 delay-500"
                : "opacity-0 delay-0",
            )}
          />
        </>
      </AspectRatio>
    </div>
  );
};
