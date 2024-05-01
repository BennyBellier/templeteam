"use client";

import { Button } from "@/components/ui/button";
import toast from 'react-hot-toast';

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
