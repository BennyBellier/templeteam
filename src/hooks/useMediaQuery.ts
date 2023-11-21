import { useLayoutEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const getMatches = (query: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== "undefined")
      return window.matchMedia(query).matches;
    return false;
  }
  const [matches, setMatches] = useState<boolean>(getMatches(query));

  function handleChange() {
    setMatches(getMatches(query));
  }

  useLayoutEffect(() => {
    const matchMedia = window.matchMedia(query);

    // trigger initial match
    handleChange();

    // add listener
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener("change", handleChange);
    }

    return () => {
      // remove listener
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener("change", handleChange);
      }
    }
  }, [query]);

  return matches;
}