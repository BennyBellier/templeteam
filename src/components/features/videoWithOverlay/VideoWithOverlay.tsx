"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";
import { Suspense, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

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
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1050px)");

  const regexMov = new RegExp("\\.mov$", "gim");
  const regexMp4 = new RegExp("\\.mp4$", "gim");
  const regexWebm = new RegExp("\\webm$", "gim");

  const startVideo = () => {
    if (videoReady) {
      videoRef.current?.play();
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
        ratio={props.ratio}
        onMouseEnter={() => (isDesktop ? startVideo() : null)}
        onMouseLeave={() => (isDesktop ? stopVideo() : null)}
      >
        <video
          ref={videoRef}
          className={cn(
            "ease absolute left-0 top-0 h-full w-full object-cover opacity-0 duration-300",
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
        <Suspense fallback={<Skeleton />}>
          <Image
            src={props.imageSrc}
            alt={props.imageAlt}
            width={300}
            height={300}
            className={cn(
              "bg-background/50 object-cover",
              imgLoaded ? "" : "animate-pulse",
            )}
            onLoad={() => setImgLoaded(true)}
          />
          <span
            className={cn(
              "absolute right-3 top-3 flex h-5 w-5 transition-opacity duration-700",
              !videoReady && !videoError ? "opacity-100" : "opacity-0",
            )}
          >
            <svg
              className="relative z-10 h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
          {/* Ping to indicate video is ready */}
          <span
            className={`absolute right-3 top-3 flex h-3 w-3 transition-opacity duration-700 ${
              videoReady && !videoStarted
                ? "opacity-100 delay-500"
                : "opacity-0 delay-0"
            }`}
          >
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-50"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
          </span>
        </Suspense>
      </AspectRatio>
    </div>
  );
};
