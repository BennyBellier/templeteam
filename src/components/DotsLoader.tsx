import { motion } from "framer-motion";

export default function DotsLoader() {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center">
          <motion.div
            animate={{ scale: [0, 1, 0, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear"}}
            className="mr-1 h-4 w-4 rounded-full bg-neutral-800"
          />
          <motion.div
            animate={{ scale: [0, 1, 0, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.25, ease: "linear"}}
            className="mr-1 h-4 w-4 rounded-full bg-neutral-800"
          />
          <motion.div
            animate={{ scale: [0, 1, 0, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5, ease: "linear"}}
            className="h-4 w-4 rounded-full bg-neutral-800"
          />
        </div>
      </motion.div>
    </div>
  );
}
