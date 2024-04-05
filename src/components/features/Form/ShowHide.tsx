"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import React, { useCallback, useState } from "react";

export type ShowHideProps = {
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

const ShowHide = React.forwardRef<HTMLButtonElement, ShowHideProps>(
  ({ className, onClick, ...props }, ref) => {
    const [isShowed, setIsShowed] = useState(false);
    const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback(
      (e) => {
        setIsShowed(!isShowed);
        if (onClick) onClick(e);
      },
      [isShowed, onClick],
    );
    return (
      <Button
        type="button"
        variant="ghost"
        className={cn(className)}
        ref={ref}
        onClick={handleClick}
        {...props}
      >
        {isShowed ? <EyeOff /> : <Eye />}
      </Button>
    );
  },
);
ShowHide.displayName = "ShowHide";

export { ShowHide };
