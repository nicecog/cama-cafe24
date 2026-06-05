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
        <motion.div variants={item} className="text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-slate-200/60 bg-white px-4 py-1.5 shadow-sm shadow-slate-100">
            {/* 아이콘을 위한 별도 원형 배경 */}
            <Sparkles className="h-4 w-4 text-yellow-500 fill-yellow-200/50" />
            {/* 타이포그래피 개선 */}
            <span className="text-lg font-extrabold tracking-tight text-slate-700">
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
