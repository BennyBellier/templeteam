"use client";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";



export type ButtonWithArrowProps = {
  children?: React.ReactNode;
  className?: string;
  gap?: string; // tailwind gap
  arrowSize?: number;
};

export const ButtonWithArrow = ({children, className, ...props}: ButtonWithArrowProps) => {
    const arrow = {
    initial: { x: 0 },
    animate: { x: -10 },
  };

  return (
    <motion.div
          className={`flex w-fit items-center gap-${props.gap ? props.gap : 4}`}
          initial="initial"
          animate="initial"
          whileHover="animate"
        >
          <Typography as={Button} className={className ? className : "py-5 text-lg font-bold"}>
            {children}
          </Typography>
          <motion.div variants={arrow} transition={{ type: "spring" }}>
            <ArrowLeft size={props.arrowSize ? props.arrowSize : 28 } />
          </motion.div>
        </motion.div>
  );
}