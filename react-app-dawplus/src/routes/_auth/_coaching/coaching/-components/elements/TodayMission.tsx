import { motion } from "framer-motion";

import missionTitle from "@/assets/images/character/missionChallenge.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";

export default function TodayMission(props: { text: React.ReactNode }) {
  const { pt } = usePageTranslation("coaching/coachingCommon");

  return (
    <div className="relative mb-6 flex flex-col items-center justify-center gap-3.5 overflow-hidden rounded-2xl border border-primary/15 bg-primary/5 p-5 shadow-sm">
      <span className="rounded-full bg-white px-3.5 py-1 text-base font-bold tracking-wider text-primary">
        🎯 {pt("today_mission_badge")}
      </span>

      <div className="relative flex h-24 items-center justify-center">
        <div className="pointer-events-none absolute inset-0 h-24 w-24 rounded-full bg-blue-50/40 blur-xl" />
        <motion.img
          src={missionTitle}
          alt={pt("step_visual_alt")}
          className="relative z-10 h-full w-auto object-contain drop-shadow-sm"
          animate={{
            y: [0, -4.5, 0],
          }}
          transition={{
            duration: 3.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="flex max-w-[280px] flex-col items-center gap-2 px-1">
        <div className="h-0.5 w-6 rounded-full bg-primary/30" />
        <p className="mt-1 break-keep text-center text-base font-bold leading-relaxed tracking-tight text-primary">
          {props.text}
        </p>
      </div>
    </div>
  );
}
