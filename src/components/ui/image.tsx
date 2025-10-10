"use client";

import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import Image from "next/image";

type OptimizedImageProps = {
    src: string,
    alt: string,
    width?: number | `${number}`,
    height?: number | `${number}`,
    className?: string,
    fill?: boolean,
    priority?: boolean,
    quality?: number
}

export const OptimizedImage = ({
  src,
  alt,
  width = 400,
  height = 300,
  className = '',
  fill = false,
  priority = false,
  quality = 80
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-gray-100 animate-pulse ${className}`} style={{ width, height }}>
      {/* Spinner de chargement */}
      {/* {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <Image className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
      )} */}

      {/* Message d'erreur */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-500 p-4">
          <ImageOff className="w-12 h-12 mb-3 text-gray-400" />
          <p className="text-sm font-medium text-center">Image indisponible</p>
          <p className="text-xs text-gray-400 text-center mt-1">Impossible de charger l&apos;image</p>
        </div>
      )}

      {/* Image */}
      {!hasError && (
        <Image
            src={src}
            alt={alt}
            fill={fill}
            priority={priority}
            quality={quality}
            className={`transition-opacity duration-300 ${
                isLoading ? "opacity-0" : "opacity-100"
            } ${fill ? "object-cover" : ""}`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
                setIsLoading(false)
                setHasError(true)
            }}
        />
      )}
    </div>
  );
};

