"use client";

import { Button } from "@/components/ui/button";
import toast from 'react-hot-toast';
// import { env } from "@/env.mjs";

// export const revalidate = env.REVALIDATE_TIME ?? 3600;

export default function Playground() {
  return (
    <div className="flex items-center justify-center">
      <Button
        onClick={() => {
          toast.success("Success");
        }}
      >
        Toast
      </Button>
    </div>
  );
}
