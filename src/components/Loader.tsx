import { motion } from "framer-motion";

interface DotsLoaderProps {
  backgroundColor?: string;
}

export function DotsLoader({ backgroundColor, ...props }: DotsLoaderProps) {
  const bgClass = backgroundColor ? "" : "bg-neutral-800";
  return (
    <div className={"flex items-center justify-center"} {...props}>
      <motion.div
        className="flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center">
          <motion.div
            animate={{ scale: [0, 1, 0, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className={`mr-1 h-4 w-4 rounded-full ${bgClass}`}
            style = {{backgroundColor: backgroundColor}}
          />
          <motion.div
            animate={{ scale: [0, 1, 0, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.25,
              ease: "linear",
            }}
            style = {{backgroundColor: backgroundColor}}
            className={`mr-1 h-4 w-4 rounded-full ${bgClass}`}
          />
          <motion.div
            animate={{ scale: [0, 1, 0, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.5,
              ease: "linear",
            }}
            className={`h-4 w-4 rounded-full ${bgClass}`}
            style = {{backgroundColor: backgroundColor}}
          />
        </div>
      </motion.div>
    </div>
  );
}
