"use client"; // Error components must be Client Components

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
    console.error(error);
  }, [error]);

  return <div>{error.message}</div>;
}
