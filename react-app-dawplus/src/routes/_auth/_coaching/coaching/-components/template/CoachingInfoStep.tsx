import { motion, type Variants } from "framer-motion";
import { Sparkles } from "lucide-react";
import type React from "react";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../elements/Textbox";

interface CoachingInfoStepProps {
  title?: React.ReactNode;
  image?: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}

export function CoachingInfoStep({
  title,
  image,
  subtitle,
  children,
}: CoachingInfoStepProps) {
  const { pt } = usePageTranslation("coaching/coachingCommon");
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6  pb-6"
    >
      {/* 1. Title Area */}
      {title && (
        <motion.div
          variants={item}
          className="flex flex-col items-center text-center"
        >
          <div className="relative mb-1.5">
            <div className="absolute inset-0 rounded-full bg-yellow-100/70 blur-sm" />
            <div className="relative inline-flex h-7 w-7 items-center justify-center rounded-full border border-yellow-100 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-sm shadow-yellow-100/70">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-yellow-500 fill-yellow-200/60" />
            </div>
          </div>

          <div className="inline-flex max-w-[26rem] rounded-2xl border border-slate-200/70 bg-gradient-to-b from-white to-slate-50/60 px-4 py-2.5 shadow-sm shadow-slate-100">
            <span className="break-keep whitespace-normal text-center text-lg font-extrabold leading-snug tracking-tight text-slate-700">
              {title}
            </span>
          </div>
        </motion.div>
      )}

      {/* 2. Image Area */}
      {image && (
        <motion.div
          variants={item}
          className="relative flex min-h-[220px] items-center justify-center pt-2"
        >
          {/* Decorative background glows */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute h-40 w-40 rounded-full bg-blue-100/40 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute h-48 w-48 rounded-full bg-sky-100/30 blur-3xl"
          />

          {/* Floating Main Image */}
          <motion.img
            src={image}
            alt={pt("step_visual_alt")}
            className="relative z-10 w-60 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.05)]"
            animate={{ y: [-5, 5, -5] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      )}

      {/* 3. Subtitle Area */}
      {subtitle && (
        <motion.div variants={item} className="space-y-3 text-center">
          <h3 className="break-keep text-2xl font-black tracking-tight text-slate-900">
            {subtitle}
          </h3>
          <div className="mx-auto h-1 w-8 rounded-full bg-primary/20" />
        </motion.div>
      )}

      {/* 4. Info Area (Children) */}
      <motion.div
        variants={item}
        // className="break-keep text-justify text-[1.05rem] font-medium leading-relaxed tracking-tight text-slate-600/90"
      >
        <Textbox>{children}</Textbox>
      </motion.div>
    </motion.div>
  );
}
