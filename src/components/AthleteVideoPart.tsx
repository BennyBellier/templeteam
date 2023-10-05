import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useWindowSize } from "./elements";

export function AthleteVideo({ file, name }: { file: string; name: string }) {
  const [imgLoading, setImgLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);
  const [pulsing, setPulsing] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPlayed, setVideoPlayed] = useState(false);
  const width = useWindowSize().width;

  const imageLoaded = useCallback(() => {
    setImgLoading(false);
    setTimeout(() => setPulsing(false), 400);
  }, []);

  const playVideo = () => {
    if (videoRef.current && !videoLoading && !imgLoading) {
      void videoRef.current.play();
      setVideoPlayed(true);
    }
  };

  const pauseVideo = () => {
    if (videoRef.current && !videoLoading && !imgLoading)
      void videoRef.current.pause();
  };

  useEffect(() => {
    const ref = videoRef.current;

    if (ref) {
      ref.addEventListener("canplaythrough", () => {
        setVideoLoading(false);
        imageLoaded();
      });
    }

    return () => {
      window.removeEventListener("scroll", () => null);
      if (ref) {
        ref.removeEventListener("canplaythrough", () => null);
      }
    };
  }, [videoRef, imageLoaded]);

  return (
    <motion.div
      className={`group relative flex h-[350px] w-[350px] overflow-hidden rounded-t-2xl bg-neutral-200 md:h-[375px] md:w-[375px] 1050:h-[400px] 1050:w-[400px] 1050:rounded-l-2xl 1050:rounded-br-none 1050:rounded-tr-none ${
        pulsing ? "animate-pulse" : ""
      } ${videoLoading ? "cursor-wait" : "cursor-pointer"} `}
      onMouseOver={playVideo}
      onMouseOut={pauseVideo}
      onClick={() => {
        if (width < 1050) playVideo();
      }}
    >
      <video
        ref={videoRef}
        muted
        loop
        preload="metadata"
        className={`w-full object-cover ${
          videoLoading ? "opacity-0" : "opacity-100"
        }`}
        // src={`/video/team/${file}.mp4`}
        src="/video/team/Export_v2.3.mp4"
      ></video>
      <Image
        src={`/img/team/${file}.jpg`}
        alt={name}
        layout="fill"
        onLoad={imageLoaded}
        className={`transition-opacity duration-500 ${
          imgLoading ? "opacity-0" : "opacity-100"
        } ${videoLoading ? "" : "group-hover:opacity-0"} ${width < 1050 && videoPlayed ? "opacity-0" : ""}`}
      />
      {/* Little loader */}
      <span
        className={`absolute right-3 top-3 flex h-5 w-5 transition-opacity duration-700 ${
          videoLoading && !imgLoading ? "opacity-100" : "opacity-0"
        }`}
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
          videoLoading || videoPlayed ? "opacity-0" : "opacity-100"
        }`}
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
        <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
      </span>
    </motion.div>
  );
}