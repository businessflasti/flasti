"use client";
import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

export const TextGenerateEffect = ({
  words,
  className,
  duration = 0.8,
}: {
  words: string;
  className?: string;
  duration?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{
          duration: duration,
          ease: [0.25, 0.46, 0.45, 0.94], // Cubic bezier optimizado
        }}
        style={{ color: "#AEAEB0" }}
      >
        {words}
      </motion.div>
    </div>
  );
};