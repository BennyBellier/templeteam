"use client"; // Error components must be Client Components

import { Typography } from "@/components/ui/typography";
import { useEffect } from "react";

export default function Error({
  error,
  _reset,
}: {
  error: Error & { digest?: string };
  _reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error page: ", error.message);
  }, [error]);

  return (
    <>
      <header className="flex w-full flex-col items-center gap-10 border-b border-border px-1050 pb-16 md:flex-1">
        <Typography as="h1" variant="title">
          Erreur 404
        </Typography>
        <Typography as="h2" variant="description" className="w-3/4">
          {error.message}
        </Typography>
      </header>
      <div className="flex-6"></div>
    </>
  );
}
