import Link from "next/link";
import { Button } from "../ui/button";
import { Typography } from "../ui/typography";

export function PlaygroundLink() {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <Button
      asChild
      className="fixed z-50 bottom-5 left-4"
    >
      <Typography as={Link} href="/playground">
        Playground
      </Typography>
    </Button>
  );
}
