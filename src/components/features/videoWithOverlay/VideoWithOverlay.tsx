"use client";

import { Loader } from "@/components/ui/loader";
import { Ping } from "@/components/ui/ping";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import {
  ImageWithLoader,
  type ImageWithLoaderProps,
} from "../withLoader/ImageWithLoader";
import { ImageNotFound } from "@/components/ui/imageNotFound";

export type VideoWithOverlayProps = {
  videoSrc: string[];
  image: ImageWithLoaderProps;
  ratio: number;
  className?: string;
};

export const VideoWithOverlay = (props: VideoWithOverlayProps) => {
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1050px)");

  const regexMov = new RegExp("\\.mov$", "gim");
  const regexMp4 = new RegExp("\\.mp4$", "gim");
  const regexWebm = new RegExp("\\webm$", "gim");

  const startVideo = () => {
    if (videoReady) {
      setTimeout(() => void videoRef.current?.play(), 200);
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
    const video = videoRef.current;
    if (video) {
        const handleReadyStateChange = () => {
            if (video.readyState > 3) {
                setVideoReady(true);
            }
        };
        video.addEventListener('readystatechange', handleReadyStateChange);
        return () => {
            video.removeEventListener('readystatechange', handleReadyStateChange);
        }
    }
}, [videoRef]);

  const VideoElement = () => {
    if (props.videoSrc.length > 0) {
      return (
        <video
          ref={videoRef}
          className={cn(
            "col-start-1 col-end-1 row-start-1 row-end-1",
            "ease z-10 h-full w-full object-cover opacity-0 duration-300",
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
      );
    }

    return null;
  };

  const ImageElement = () => {
    if (props.image.src) {
      return (
        <ImageWithLoader
          onLoaded={() => setIsImageLoading(false)}
          className={cn(
            "col-start-1 col-end-1 row-start-1 row-end-1",
            "h-full w-full object-cover",

          )}
          {...props.image}
        />
      );
    }

    return null;
  };

  const NoGraphicContent = () => {
    if (props.videoSrc.length === 0 && props.image.src === null) {
      return (
        <ImageNotFound />
      );
    }
    return null;
  }

  return (
    <div
      className={`group ${props.className}`}
      onClick={() => (!isDesktop ? handleClick() : null)}
    >
      <AspectRatio
        className="grid grid-cols-1 grid-rows-1"
        ratio={props.ratio ? props.ratio : 16 / 9}
        onMouseEnter={() => (isDesktop ? startVideo() : null)}
        onMouseLeave={() => (isDesktop ? stopVideo() : null)}
      >
        {NoGraphicContent()}
        {VideoElement()}
        {ImageElement()}
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
      </AspectRatio>
    </div>
  );
};
